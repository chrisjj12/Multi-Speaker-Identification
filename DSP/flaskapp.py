from flask import Flask
app = Flask(__name__)
    

@app.route('/dsp')
def dsp():
    return "DSP"

