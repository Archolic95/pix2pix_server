from flask import Flask, request, jsonify
from json import loads, dumps
import numpy as np

from PIL import Image
import base64
import torch
import torchvision
import argparse
import cv2
import termios

from options.test_options import TestOptions
from models import pix2pix_model, networks
from util import util
from data import find_dataset_using_name, create_dataset

model = networks.define_G(input_nc=3,
                          output_nc=3,  
                          ngf=64, 
                          netG="unet_256")

state_dict = torch.load("./checkpoints/500_net_G.pth")
model.load_state_dict(state_dict)
model.eval()

print("model loaded!")

try:
    app = Flask(__name__)
except(termios.error):
    pass

@app.route('/generate', methods=['POST'])
def prediction_payload():
    #name = request.json['name']
    s = request.json['params']

    imgdata = base64.b64decode(s)
    filename = 'some_image.jpg'  # I assume you have a way of picking unique filenames
    with open(filename, 'wb') as f:
        f.write(imgdata)

    #q = base64.decodebytes()
    input_image = np.asarray(Image.open('some_image.jpg').convert('RGB'))

    input_transformed = np.transpose(((input_image/255.0)*2.0-1.0),(2,0,1))
    input_tensor = torch.FloatTensor(input_transformed).unsqueeze(0)
    print(input_tensor.shape)
    
    out_img = util.tensor2im(model(input_tensor))
    cv2.imwrite("output_image.jpg",out_img)

    with open("output_image.jpg", "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read())
        req_file = encoded_image.decode('utf-8')

    headers = {
    'Content-Type': 'application/json',  # This is important
    }

    payload = dumps({'predicted':req_file})
    return jsonify(payload)


if __name__ == "__main__":
    app.run(port=7020,debug=True)

