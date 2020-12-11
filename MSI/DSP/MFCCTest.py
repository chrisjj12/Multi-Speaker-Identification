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


@app.route('/', methods = ['GET'])
def create_json():


    s3_client = boto3.client("s3")
    #s3audio = s3_client("https://iostoflask.s3.us-east-2.amazonaws.com/audio/file%3A///Users/chrisjung/Library/Developer/CoreSimulator/Devices/5ED1D61C-0B4C-4117-BC61-79D31733A199/data/Containers/Data/Application/0EFB813A-C67D-45E1-9826-7A5EBF0AD6BC/Library/Caches/Chris.m4a")
    #s3audio = s3_client.download_file('iostoflask', 'audio/file:///Users/chrisjung/Library/Developer/CoreSimulator/Devices/5ED1D61C-0B4C-4117-BC61-79D31733A199/data/Containers/Data/Application/0EFB813A-C67D-45E1-9826-7A5EBF0AD6BC/Library/Caches/Chris.m4a', 'downloaded.m4a')
    s3audio = s3_client.download_file("iostoflask", "audio/file:///Users/chrisjung/Library/Developer/CoreSimulator/Devices/5ED1D61C-0B4C-4117-BC61-79D31733A199/data/Containers/Data/Application/0EFB813A-C67D-45E1-9826-7A5EBF0AD6BC/Library/Caches/Chris.m4a", "downloaded.m4a")

    print('sfgasg')



    #convert wav to mp3                                                            
    sound = AudioSegment.from_file(s3audio, format = "m4a")
    print('kllk3k')
    wavfile = sound.export("convert.wav", format = "wav")
    print('yaaa')
    file_name = wavefile.name


   
            
    (rate,sig) = wav.read(file_name)
    mfcc_feat = mfcc(sig, rate)
    d_mfcc_feat = delta(mfcc_feat, 2)
    fbank_feat = logfbank(sig, rate) 
    python_arr = fbank_feat[1:3,:]
    json_conv = python_arr.tolist()
    database_format = json.dumps({"Chris": json_conv}) # Need to change to the user inputed name in the application

    
    with open('coeff.json', 'w') as json_file:
        json_file.write(database_format)

    #os.system("mv coeff.json newfile.json")

    return render_template('main.html', dblist =  database_format)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)

