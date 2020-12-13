import scipy.io.wavfile as wav
import os
from pydub import AudioSegment

sound = AudioSegment.from_file("hello.m4a", format = "m4a")
wavfile = sound.export("test.wav", format="wav")
print(wavfile.name)