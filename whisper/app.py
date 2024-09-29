from pathlib import Path
import os

import torch
import intel_extension_for_pytorch as ipex
from transformers import AutoProcessor, pipeline
from optimum.intel.openvino import OVModelForSpeechSeq2Seq
from flask import Flask, request, jsonify
# from datasets import load_dataset

# os.environ["NUMBA_ENABLE_AVX"] = "1"

device = "cpu"
# Maybe try torch.float32?
torch_dtype = torch.float

# Define model remote and local location
model_id = "distil-whisper/distil-large-v3"
model_path = Path(model_id.replace("/", "_"))
ov_config = {"CACHE_DIR": ""}

# If model hasn't been converted to Intel OpenVINO convert it
if not model_path.exists():
    ov_model = OVModelForSpeechSeq2Seq.from_pretrained(
        model_id,
        ov_config=ov_config,
        export=True,
        compile=False,
        load_in_8bit=False,
        torch_dtype=torch_dtype, 
        low_cpu_mem_usage=True, 
        use_safetensors=True
    )
    # More optimizations
    ov_model = ov_model.eval()
    # ov_model = ipex.llm.optimize(ov_model, dtype=torch_dtype)
    ov_model.half()
    ov_model.save_pretrained(model_path)
else:
    ov_model = OVModelForSpeechSeq2Seq.from_pretrained(
        model_path, 
        ov_config=ov_config, 
        compile=False,
        load_in_8bit=False,
        torch_dtype=torch_dtype, 
        low_cpu_mem_usage=True, 
        use_safetensors=True
    )

# Send the OpenVINO model to device
ov_model.to(device)

# Initialize the pipe
processor = AutoProcessor.from_pretrained(model_id)
pipe = pipeline(
    "automatic-speech-recognition",
    model=ov_model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    max_new_tokens=128,
    torch_dtype=torch_dtype,
    device=device,
)

# Testing pre-ffmpeg
# dataset = load_dataset("hf-internal-testing/librispeech_asr_dummy", "clean", split="validation")
# sample = dataset[0]["audio"]

# Testing post-ffmpeg
# sample = "preamble.wav"
# result = pipe(sample)
# print(result["text"])

# Flask app integration
api = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@api.route("/audio", methods=['POST'])
async def audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']

    # Check if the file is a .wav file
    if file.filename == '' or not file.filename.endswith('.wav'):
        return jsonify({"error": "Invalid file type. Only .wav files are allowed."}), 400

    # Save the file to the uploads directory
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    
    result = pipe(filepath)
    
    return jsonify({"message": "file transcribed successfully", "text": result["text"]}), 200

print('running flask API...')
api.run(host='0.0.0.0')
