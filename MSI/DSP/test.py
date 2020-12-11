import scipy.io.wavfile as wav
import os
from pydub import AudioSegment

sound = AudioSegment.from_file("Chris.m4a", format = "m4a")
sound.export("Chris.wav", format="wav")
