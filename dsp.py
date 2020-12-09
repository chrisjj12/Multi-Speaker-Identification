from decimal import localcontext, Decimal, ROUND_HALF_UP
import numpy
import math
import logging

def preemphasis(signal, preem_coeff = 0.95):
    """perform preemphasis on the input signal.

    :param signal: The signal to filter.
    :param coeff: The preemphasis coefficient. 0 is no filter, default is 0.95.
    :returns: the filtered signal.
    """
    new_signal = numpy.append(signal[0], signal[1:] - preem_coeff * signal[:-1])
    return new_signal



def round_up(number):
    with localcontext() as ctx:
        tx.rounding = ROUND_HALF_UP
        for i in range(1, 15, 2):
            n = Decimal(i) / 2

    return n.to_integral_value()


def framesig(sig, frame_len, frame_step, winfunc=<function <lambda>>, stride_trick=True):

    siglen = len(sig)
    frame_len = int(round_half_up(frame_len))
    frame_step = int(round_half_up(frame_step))

    if siglen 

    return

def deframesig(frames, siglen, frame_len, frame_step, winfunc=<function <lambda>>):

def magspec(frames, NFFT)

def powspec(frames, NFFT)

def logpowspec(frames, NFFT, norm=1)
