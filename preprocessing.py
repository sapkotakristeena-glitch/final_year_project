# src/preprocessing.py

import spacy
from nltk.corpus import stopwords
import nltk

nltk.download('stopwords')
nlp = spacy.load("en_core_web_sm")

stop_words = set(stopwords.words('english'))
for word in ['no', 'never', 'not', 'nor', 'but']:
    stop_words.discard(word)

def preprocess(text):
    # Step 1: lowercase + keep only letters/digits/spaces
    text = text.lower()
    text = "".join(ch for ch in text if ch.isalpha() or ch.isdigit() or ch.isspace())

    # Step 2: tokenize
    tokens = text.split()

    # Step 3: remove stopwords
    tokens = [t for t in tokens if t not in stop_words]

    # Step 4: lemmatize (reduce to root form)
    doc = nlp(" ".join(tokens))
    tokens = [token.lemma_ for token in doc]

    return tokens  # always returns a list