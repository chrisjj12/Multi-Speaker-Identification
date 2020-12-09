#!/usr/bin/env python
from MFCC import mfcc
from MFCC import delta
from MFCC import logfbank
from flask import Flask, render_template, request, send_file, jsonify
from flask_json import FlaskJSON, JsonError, json_response, as_json
import json
import scipy.io.wavfile as wav

f= open("kcoeff.txt","w+")



app = Flask(__name__, template_folder="Templates")
FlaskJSON(app)

@app.route('/')

def create_json():
    (rate,sig) = wav.read("english.m4a")
    mfcc_feat = mfcc(sig, rate)
    d_mfcc_feat = delta(mfcc_feat, 2)
    fbank_feat = logfbank(sig, rate) 
    python_arr = fbank_feat[1:3,:]
    json_conv = python_arr.tolist()
    database_format = json.dumps({"Name": json_conv}) # Need to change to the user inputed name in the application
    f= open("kcoeff.txt","a+")
    for i in range(2):
        f.write(database_format[i])


    return render_template('main.html', dblist =  database_format)
    f.close()

f.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)

