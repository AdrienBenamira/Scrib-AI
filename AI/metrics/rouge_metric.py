import json
import sys
from pyrouge import Rouge155

def main(reference, summary):
    ref_texts = {'A': reference}
    rouge = Rouge155(n_words=200)
    score = rouge.score_summary(summary, ref_texts)
    print(json.dumps({"score": score['rouge_4_f_score']}))
	

if __name__ == "__main__":
    reference, summary = sys.argv[1], sys.argv[2]
    main(reference, summary)
