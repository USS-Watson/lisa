from pathlib import Path
# import os

import torch
from transformers import AutoProcessor, pipeline
from optimum.intel.openvino import OVModelForSpeechSeq2Seq
# from datasets import load_dataset

# os.environ["NUMBA_ENABLE_AVX"] = "1"

device = "cpu"
# Maybe try torch.float32?
torch_dtype = torch.float32

# Define model remote and local location
model_id = "distil-whisper/distil-large-v3"
model_path = Path(model_id.replace("/", "_"))
ov_config = {"CACHE_DIR": ""}

# If model hasn't been converted to intel openvino convert it
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

# Send the OpenVino model to device
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

sample = "preamble.wav"
result = pipe(sample)
print(result["text"])
