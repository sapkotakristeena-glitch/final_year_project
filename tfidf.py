# src/tfidf.py
import math

class TFIDF:
    def __init__(self):
        self.idf = {}
        self.vocab = []

    def fit(self, corpus):           # corpus = list of token lists (training data only)
        N = len(corpus)
        all_words = set(w for doc in corpus for w in doc)

        for word in all_words:
            df = sum(1 for doc in corpus if word in doc)
            self.idf[word] = math.log((N + 1) / (df + 1)) + 1  # fixed formula

        self.vocab = list(self.idf.keys())

    def transform(self, doc):        # doc = single token list
        total = len(doc) if doc else 1
        tf = {}
        for word in doc:
            tf[word] = tf.get(word, 0) + 1 / total

        vector = []
        for word in self.vocab:
            tfidf_score = tf.get(word, 0) * self.idf.get(word, 0)
            vector.append(tfidf_score)

        return vector