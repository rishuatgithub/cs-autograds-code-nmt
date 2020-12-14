import torch
import torch.nn as nn
import numpy as np
import pandas as pd
import argparse
import os
import sys

import fastBPE

import preprocessing.src.code_tokenizer as code_tokenizer
from XLM.src.data.dictionary import Dictionary, BOS_WORD, EOS_WORD, PAD_WORD, UNK_WORD, MASK_WORD
from XLM.src.model import build_model
from XLM.src.utils import AttrDict

SUPPORTED_LANGUAGE=['java','python']
MODEL_PATH='model/model_1.pth'
BPE_PATH='data/BPE_with_comments_codes'

def get_params():
    parser = argparse.ArgumentParser(description="Code Translator Params")
    parser.add_argument("--src_lang", type=str, default="java", help=f"Supported Language: {' '.join(SUPPORTED_LANGUAGE)}")
    parser.add_argument("--tgt_lang", type=str, default="python", help=f"Supported Language: {' '.join(SUPPORTED_LANGUAGE)}")

    return parser


def model_fn(model_dir):
    model = torch.load(model_dir, map_location=device)
    return model


class NMTranslator:
    def __init__(self, params):
        model = model_fn(MODEL_PATH)
        model['encoder'] = {(k[len('module.'):] if k.startswith('module.') else k):v for k, v in model['encoder'].items()}
        
        if 'decoder' in model:
            decoders_names = ['decoder']
        else:
            decoders_names = ['decoder_0','decoder_1']
        
        for decoder_name in decoders_names:
            model[decoder_name] = {(k[len('module.'):] if k.startswith('module.') else k):v for k, v in model[decoder_name].items()}
        
        self.model_params = AttrDict(model['params'])
        self.dico = Dictionary(model['dico_id2word'], model['dico_word2id'], model['dico_counts'])
        self.model_params['reload_model'] = ','.join([MODEL_PATH] * 2)

        encoder1, decoder1 = build_model(self.model_params, self.dico)

        self.encoder = encoder1[0]
        self.encoder.load_state_dict(model['encoder'])

        self.decoder = decoder1[0]
        self.decoder.load_state_dict(model['decoder'])
        
        self.encoder.cuda()
        self.decoder.cuda()
        
        self.bpe_model = fastBPE.fastBPE(os.path.abspath(BPE_PATH))

    def predict_fn(self, input, lang1, lang2, n=1, beam_size=1):
        with torch.no_grad():
            tokenizer = getattr(code_tokenizer, f'tokenize_{lang1}')
            detokenizer = getattr(code_tokenizer, f'tokenize_{lang2}')

            lang1 += '_sa'
            lang2 += '_sa'

            lang1_id = self.model_params.lang2id[lang1]
            lang2_id = self.model_params.lang2id[lang2]

            tokens = [t for t in tokenizer(input)]
            tokens = self.bpe_model.apply(tokens)
            tokens = ['</s>'] + tokens + ['</s>']
            input = " ".join(tokens)

            len1 = len(input.split())
            len1 = torch.LongTensor(1).fill_(len1).to(device)

            x1 = torch.LongTensor([self.dico.index(w) for w in input.split()]).to(device)[:, None]

            langs1 = x1.clone().fill_(lang1_id)
            enc1 = self.encoder('fwd', x=x1, lengths=len1, langs=langs1, causal=False)
            enc1 = enc1.transpose(0, 1)

            x2, len2 = self.decoder.generate(enc1,len1,lang2_id,
                max_len=int(min(self.model_params.max_len, 3 * len1.max().item() + 10)),
                sample_temperature=None)

            tok = []
            for i in range(x2.shape[1]):
                wid = [self.dico[x2[j, i].item()] for j in range(len(x2))][1:]
                wid = wid[:wid.index(EOS_WORD)] if EOS_WORD in wid else wid
                tok.append(" ".join(wid).replace("@@ ", ""))

            results = []
            for t in tok:
                results.append(detokenizer(t))

            
            return results




if __name__=='__main__':
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    #print(f'Detected device: {device}')
    params = get_params()

    translator = NMTranslator(params)

    input = sys.argv[1]

    with torch.no_grad():
        output = translator.predict_fn(input, lang1="java", lang2="python", n=1, beam_size=1)

    print(output)

    

    