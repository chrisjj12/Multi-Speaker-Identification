#!/usr/bin/env python
from MFCC import mfcc
from MFCC import delta
from MFCC import logfbank
from flask import Flask, render_template, request, send_file
import json
import scipy.io.wavfile as wav

app = Flask(__name__, template_folder = "Templates")
file_name = "kcoeff.json"

@app.route('/')
def dsp():

    return render_template('main.html')

@app.route('/', methods = ["POST"])
def create_json
    (rate,sig) = wav.read("english.wav")
    mfcc_feat = mfcc(sig, rate)
    d_mfcc_feat = delta(mfcc_feat, 2)
    fbank_feat = logfbank(sig, rate)
    json_conv = json.dumps(fbank_feat)

    return json_conv


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)

#print(fbank_feat[1:3,:])
