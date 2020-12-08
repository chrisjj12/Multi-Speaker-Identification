#!/usr/bin/env python
"""
from MFCC import mfcc
from MFCC import delta
from MFCC import logfbank
from flask import Flask, render_template, request, send_file, jsonify
from flask_json import FlaskJSON, JsonError, json_response, as_json
import json
import scipy.io.wavfile as wav


app = Flask(__name__)
FlaskJSON(app)
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

#course_list = list(client.db.course_col.find({"major": major.upper()}))
 #   return flask.jsonify(**course_list)
"""
#from datetime import datetime
from flask import Flask, request
from flask_json import FlaskJSON, JsonError, json_response, as_json

app = Flask(__name__)
FlaskJSON(app)

"""
@app.route('/get_time')
def get_time():
    now = datetime.utcnow()
    return json_response(time=now)
"""

@app.route('/increment_value', methods=['POST'])
def increment_value():
    # We use 'force' to skip mimetype checking to have shorter curl command.
    data = request.get_json(force=True)
    try:
        value = int(data['value'])
    except (KeyError, TypeError, ValueError):
        raise JsonError(description='Invalid value.')
    return json_response(value=value + 1)


@app.route('/get_value')
@as_json
def get_value():
    return dict(value=12)


if __name__ == '__main__':
    app.run()
