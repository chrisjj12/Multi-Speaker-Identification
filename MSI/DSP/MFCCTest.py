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

#UPLOAD_FOLDER = '/Users/chrisjung/Library/Developer/CoreSimulator/Devices/5ED1D61C-0B4C-4117-BC61-79D31733A199/data/Containers/Data/Application/7E003075-2255-486D-B6E8-A1DF3D8365D5/Library/Caches'
#ALLOWED_EXTENSIONS = {'m4a', 'wav'}

app = Flask(__name__, template_folder = "Templates")
FlaskJSON(app)
#app.config['/Users/chrisjung/Library/Developer/CoreSimulator/Devices/5ED1D61C-0B4C-4117-BC61-79D31733A199/data/Containers/Data/Application/7E003075-2255-486D-B6E8-A1DF3D8365D5/Library/Caches'] = UPLOAD_FOLDER
"""
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
"""


@app.route('/audio_record', methods=['POST'])
def save_record():

    logger.info("welcome to upload`")
    # file = request.files['file']
    #filename = secure_filename(file.title)

    file = request.files['file']

    print('File from the POST request is: {}'.format(file))
    try: 
        read_audio_file(file[0])
        return "****** Audio Read ******"
    except: 
        print("In the except", file[0]) # Gets printed as undefined
        title = request.form['title']
        print(title) # Able to print title 
        return "Request received and responded"
        # app.logger.debug(request.files['file'].filename) 

@app.route('/')
def create_json():
    
    


            # convert wav to mp3                                                            
    #sound = AudioSegment.from_file("hello.m4a", format = "m4a")
    #wavfile = sound.export("test.wav", format="wav")
    #file_name = wavefile.name
   
            
    (rate,sig) = wav.read("hello.wav")
    mfcc_feat = mfcc(sig, rate)
    d_mfcc_feat = delta(mfcc_feat, 2)
    fbank_feat = logfbank(sig, rate) 
    python_arr = fbank_feat[1:3,:]
    json_conv = python_arr.tolist()
    database_format = json.dumps({"Chris": json_conv}) # Need to change to the user inputed name in the application


    return render_template('main.html', dblist =  database_format)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)

