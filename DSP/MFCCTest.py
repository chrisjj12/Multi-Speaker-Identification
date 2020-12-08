#!/usr/bin/env python
from MFCC import mfcc
from MFCC import delta
from MFCC import logfbank
from flask import Flask, render_template, request, send_file, jsonify
import json
import scipy.io.wavfile as wav


app = Flask(__name__)
#file_name = "kcoeff.json"

@app.route('/')

def dsp():

    #return render_template('main.html')



#def create_json():
(rate,sig) = wav.read("english.wav")
mfcc_feat = mfcc(sig, rate)
d_mfcc_feat = delta(mfcc_feat, 2)
fbank_feat = logfbank(sig, rate) 
python_arr = fbank_feat[1:3,:]
main = python_arr.tolist()


#database_format = json.dumps({"Name": json_conv})) # Need to change to the user inputed name in the application
#print(json.dumps({"Name": json_conv})) # Need to change to the user inputed name in the application

#print(database_format)

    return render_template('main.html',main=main)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)

#print(fbank_feat[1:3,:])w
