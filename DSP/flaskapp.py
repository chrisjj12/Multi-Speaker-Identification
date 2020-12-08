from flask import Flask
app = Flask(__name__)

@app.route('/dsp')
def hello_world():
    return 'DSP'