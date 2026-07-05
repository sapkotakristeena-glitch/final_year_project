

import spacy
from nltk.corpus import stopwords
import nltk

nltk.download('stopwords')
nlp = spacy.load("en_core_web_sm")

stop_words = set(stopwords.words('english'))
for word in ['no', 'never', 'not', 'nor', 'but']:
    stop_words.discard(word)

def preprocess(text):
    
    text = text.lower()
    text = "".join(ch for ch in text if ch.isalpha() or ch.isdigit() or ch.isspace())

   
    tokens = text.split()

    
    tokens = [t for t in tokens if t not in stop_words]

    
    doc = nlp(" ".join(tokens))
    tokens = [token.lemma_ for token in doc]

    return tokens  