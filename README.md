# Multi Speaker Identification

## DSP RESEARCH

Cited source: https://pdfs.semanticscholar.org/c082/f14d48d2ac744a5cdc2fbe7ac2a55887c86f.pdf

Speech recognition using dsp requires the use of mel frequency cepstrum coefficients to analyze the input signal and then vector quantization to correctly identify the speaker.

Block Diagram: ![Block Diagram](https://github.com/chrisjj12/Multi-Speaker-Identification/blob/master/BlockDiagram.png)

### Frame Blocking

The continuous speech signal is blocked into frames of N samples and the second frames starting with M samples, which overlaps by N-M samples. The third starts by 2M and this will continue to 3M,4M,5M, nM (n=number) through each following frame.

### Windowing

Following frame, windowing is the next process which goes through each frame and reduce the distorted signals from the beginning and end of each of the frames. Using the hamming window, the beginning and end of the signals will be tapered to 0.

Hamming window: w(n) = 0.54-0.46cos((2*pi*n)/N-1), 0 <= n <= N-1 *N = number of samples per frame

Signal: y1(n) = x1(n)w(n), 0<=n<=N-1 *N = number of samples per frame

### FFT

The next step is to do the fast fourier transform (DTF). This converts each frame of N samples from the time domain into the frequency domain. The FFT algorithm will compute the discrete fourier transform (DFT).

Equation: ![FFT](https://github.com/chrisjj12/Multi-Speaker-Identification/blob/master/FFT.png)


### Mel-Frequency Wrapping

Since human perception of frequency for speech signals don't follow a linear scale. The mel-frequency is a linear frequency spacing below 1000 Hz and logarithmic spacing above 1000 Hz.

Mel frequency equation: ![MFCC](https://github.com/chrisjj12/Multi-Speaker-Identification/blob/master/MFCC.png)

Using a filter bank, which is spaced uniformly on the mel scale, a spectrum can be formed. the mel spectrum coefficients, K, is usually 20.

### Cepstrum

The log mel spectrum is converted from the frequency domain back to the time domain. the mel spectrum coefficients are real numbers, so they can be converted back to time domain using discrete cosine transform (DCT)


MFCC Equation: 




For each frame of about 30msec with some overlap, a vector of mel-frequency cepstrum coefficients is compute from the DCT of the logarithm of the short term power spectrum on the mel-frequency scale. This vector of coefficients is an acoustic vector so each input signal from speech is represented as a sequence of acoustic vectors.

### Next Steps

The acoustic vector will then be compared to previously recorded spoken words/phrases in a database to be able to detect whether the speaker can be recognized.

## Machine Learning DNN

Cited source: http://www.cs.cmu.edu/~alnu/sefiles/SE_4.pdf

DNN-WPM: https://arxiv.org/pdf/1803.09016.pdf

## Code Diagram Explained

Inputted signal -> ML -> DSP MFCC -> JSON Database

The inputted signal will be processed by ML, which will eliminate the white noise to make the voice sound clearer and more understandable. Once that is done it will create a .wav file that will go through signal processing and then mel-frequency cepstral analysis to create K-coefficients. These K coefficients will be place in a .json database.

## How the Application Works

The home page has two different buttons, "First Time User" and "Operation." 

### First Time User Instructions

A first time user will enter the "First Time User" button. Once the user gets to that new page, the user will press the record button and read a displayed statement outloud. Once that is finished they will enter their name in the textbox below and press submit. This will create the K-coefficients and will add them to .json file.

### Operation Instructions

To test to see if the speaker can be identified, the user will hit the "Operation" button. Once the user gets to that new page, the microphone will be continuously on and be hearing for the displayed message to be read. Once it is read, the app will make . wave file. The app will compare the K-coefficients pulled form the .wave to those in the .json database and if there is a match, the name of the user will pop-up, but if not, a pop-up saying, "No match" will be displayed.