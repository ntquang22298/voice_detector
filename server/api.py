import librosa
import numpy as np
import os
import math
# from sklearn.cluster import KMeans
import hmmlearn.hmm
from pydub import AudioSegment
import pickle

class_names = ['khong', 'nhieu', 'thoigian', 'nguoi', 'tien']
model = {}
for key in class_names:
    name = "model_{}.pkl".format(key)
    with open(name, 'rb') as file:
        model[key] = pickle.load(file)


def detect_leading_silence(sound, silence_threshold=-42.0, chunk_size=10):
    '''
    sound is a pydub.AudioSegment
    silence_threshold in dB
    chunk_size in ms

    iterate over chunks until you find the first one with sound
    '''
    trim_ms = 0 # ms

    assert chunk_size > 0 # to avoid infinite loop
    while sound[trim_ms:trim_ms+chunk_size].dBFS < silence_threshold and trim_ms < len(sound):
        trim_ms += chunk_size

    return trim_ms


def get_mfcc(filename):
    sound = AudioSegment.from_file(filename, format="wav")

    start_trim = detect_leading_silence(sound)
    end_trim = detect_leading_silence(sound.reverse())

    duration = len(sound)

    trimmed_sound = sound[start_trim:duration-end_trim]
    trimmed_sound.export("trimmed.wav", format="wav")

    y, sr = librosa.load('trimmed.wav') # read .wav file
    hop_length = math.floor(sr*0.010) # 10ms hop
    win_length = math.floor(sr*0.025) # 25ms frame
    # mfcc is 13 x T matrix
    mfcc = librosa.feature.mfcc(
        y, sr, n_mfcc=13, n_fft=1024,
        hop_length=hop_length)
        # win_length=win_length)
    # substract mean from mfcc --> normalize mfcc
    mfcc = mfcc - np.mean(mfcc, axis=1).reshape((-1,1))
    # delta feature 1st order and 2nd order
    delta1 = librosa.feature.delta(mfcc, order=1)
    delta2 = librosa.feature.delta(mfcc, order=2)
    # X is 39 x T
    X = np.concatenate([mfcc, delta1, delta2], axis=0) # O^r
    # return T x 39 (transpose of X)
    return X.T # hmmlearn use T x N matrix


def predict(mfcc):
    scores = [model[cname].score(mfcc) for cname in class_names]
    pred = np.argmax(scores)
    return class_names[pred]


def predict_func():
    mfcc = get_mfcc('test.wav')
    result = predict(mfcc)
    return {'message': result}


if __name__ == '__main__':
    mfcc = get_mfcc('test.wav')
    result = predict(mfcc)
    print(result)