#!/usr/bin/env python
from MFCC import mfcc
from MFCC import delta
from MFCC import logfbank
from flask import Flask
import scipy.io.wavfile as wav

app = Flask(__name__)

(rate,sig) = wav.read("english.wav")
mfcc_feat = mfcc(sig, rate)
d_mfcc_feat = delta(mfcc_feat, 2)
fbank_feat = logfbank(sig, rate)

@app.route('/')
def dsp():
    return render_template('main.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)

#print(fbank_feat[1:3,:])
