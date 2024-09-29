from optimum.intel import OVModelForCausalLM
from transformers import AutoTokenizer
from flask import Flask, request
import json
#prompt = "What is the school the University of Nebraska Lincoln?"
model_id = "OpenVINO/Phi-3-mini-128k-instruct-int4-ov"
print("Model: " + model_id)
tokenizer = AutoTokenizer.from_pretrained(model_id)
#inputs = tokenizer(prompt, return_tensors="pt")
model = OVModelForCausalLM.from_pretrained(model_id)
#model.to("GPU")
#outputs = model.generate(**inputs, max_new_tokens=50)

api = Flask(__name__)

@api.route("/complete", methods=['POST'])
async def complete():
    data = request.get_json()
    request_prompt = data.get("prompt")
    inputs = tokenizer(request_prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=250)
    allOutputs = []
    for o in outputs:
        tokened = tokenizer.decode(o, skip_special_tokens=True)
        print(tokened)
        allOutputs.append(tokened)
    return json.dumps(allOutputs)
 
api.run(host='0.0.0.0')