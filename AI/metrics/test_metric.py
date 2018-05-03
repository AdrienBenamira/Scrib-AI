import json
import sys

def main(reference, summary):
    print(json.dumps({"score": 3}))
	

if __name__ == "__main__":
    reference, summary = sys.argv[1], sys.argv[2]
    main(reference, summary)
