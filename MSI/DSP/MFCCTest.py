#!/usr/bin/env python
from MFCC import mfcc
from MFCC import delta
from MFCC import logfbank
from flask import Flask, flash, render_template, request, send_file, jsonify, redirect, url_for
from flask_json import FlaskJSON, JsonError, json_response, as_json
import json
import scipy.io.wavfile as wav
import os
from pydub import AudioSegment
import boto3
import botocore
import time

#UPLOAD_FOLDER = '/Users/chrisjung/Library/Developer/CoreSimulator/Devices/5ED1D61C-0B4C-4117-BC61-79D31733A199/data/Containers/Data/Application/7E003075-2255-486D-B6E8-A1DF3D8365D5/Library/Caches'
#ALLOWED_EXTENSIONS = {'m4a', 'wav'}

app = Flask(__name__, template_folder = "Templates")
FlaskJSON(app)


@app.route('/')
def create_json():
    
    
    s3 = boto3.client('s3')
    s3audio = s3.download_file('iostoflask', 'Chris.m4a', 'downloaded.m4a')

    time.sleep(5)

    #convert wav to mp3                                                            
    sound = AudioSegment.from_file(s3audio, format = "m4a")
    wavfile = sound.export("convert.wav", format="wav")
    file_name = wavefile.name

    time.sleep(5)
   
            
    (rate,sig) = wav.read(file_name)
    mfcc_feat = mfcc(sig, rate)
    d_mfcc_feat = delta(mfcc_feat, 2)
    fbank_feat = logfbank(sig, rate) 
    python_arr = fbank_feat[1:3,:]
    json_conv = python_arr.tolist()
    database_format = json.dumps({"Chris": json_conv}) # Need to change to the user inputed name in the application

    time.sleep(5)
    
    with open('coeff.json', 'w') as json_file:
        json_file.write(database_format)

    #os.system("mv coeff.json newfile.json")

    return render_template('main.html', dblist =  database_format)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)

