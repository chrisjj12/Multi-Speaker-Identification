function run_test_single_model_denoise
% Copyright (c) 2014-present University of Illinois at Urbana-Champaign
% All rights reserved.
% 		
% Developed by:     Po-Sen Huang, Paris Smaragdis
%                   Department of Electrical and Computer Engineering
%                   Department of Computer Science
%
% Given a model, evaluate the performance.
    baseDir = '../../../';
    addpath(['codes']);
    addpath(['codes', filesep, 'denoising']);

    addpath(['bss_eval']);
    addpath(['bss_eval_3']);
    addpath(['labrosa']);
    
    j=870;
    
    % Load model
    load(['denoising_model_', num2str(j),'.mat']);
    %% 
    % the commented out code below is for testing, if two known signals are
    % desired to be combined for analysis
    
%     [speech, fsS] = audioread(['gettysburg_test.wav']);
%     
%     dim_sp = iscolumn(speech);
%     if(dim_sp~=1)
%         speech = speech';
%     end 
%     [noise, fsN] = audioread(['babble.wav']);
%     
%     dim_ns = iscolumn(noise);
%     if(dim_ns~=1)
%         noise = noise';
%     end 
%     [fs] = max([fsS fsN]);
%     [Ps,Qs] = rat(fs/fsS);
%     [Pn,Qn] = rat(fs/fsN);
%     speech  = resample(speech,Ps,Qs);
%     noise   = resample(noise,Pn,Qn);
%     
%     if(length(speech) ~= length(noise))
%         [len, idx] = max([length(speech) length(noise)]);
%          if idx == 1
%             noise(end+1:length(speech)) = 0;
%          else
%             speech(end+1:length(noise)) = 0;
%          end
%     end
%     
%     x = (speech*10) + noise; 
    
    [speech, fs] = audioread(['audio.wav']);

    x = speech;
    eI.fs = fs;
    %%
    output = test_denoising_general_kl_bss3(x', theta, eI, 'testall', 0);
    %%
  	sz = 1024.*[1 1/4];
    wn = sqrt( hann( sz(1), 'periodic')); % hann window
    wav_singal = stft2( output.source_signal, sz(1), sz(2), 0, wn);
    wav_noise = stft2( output.source_noise, sz(1), sz(2), 0, wn);
    wav_singal = wav_singal./max(abs(wav_singal));
    wav_noise = wav_noise./max(abs(wav_noise));    

    audiowrite(['audio_denoised.wav'], wav_singal, fs);
end
