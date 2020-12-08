function run_test_single_model
% Copyright (c) 2014-present University of Illinois at Urbana-Champaign
% All rights reserved.
% 		
% Developed by:     Po-Sen Huang, Paris Smaragdis
%                   Department of Electrical and Computer Engineering
%                   Department of Computer Science
%
% Given a model, evaluate the performance.
    %baseDir = '../../../';
    addpath(['codes']);
    addpath(['codes', filesep,'timit']);

    addpath(['bss_eval']);
    addpath(['bss_eval_3']);
    addpath(['labrosa']);
    addpath(['codes', filesep,'timit', filesep, 'Data_with_dev']);

    j=70;
  
    % Load model
    load(['model_', num2str(j),'.mat']);
    eI.writewav=1;
    eI.bss3=1;
    eI.dropout=1;
%     eI.DataPath=[baseDir, filesep, 'codes', filesep, 'timit', ...
%         filesep, 'Wavfile', filesep];
%     eI.saveDir = [baseDir, filesep, 'codes', filesep, 'timit', ...
%         filesep, 'demo', filesep, 'results', filesep];
%     eI.CFGPath = [baseDir, filesep, 'tools', filesep, 'htk_features', filesep];
    eI.writewav = 1;
    test_timit_general_kl_recurrent(eI.modelname, theta, eI, 'done', j);
end

