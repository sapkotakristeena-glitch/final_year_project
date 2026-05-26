
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from preprocessing import preprocess
from tfidf import TFIDF
from classifier import NaiveBayes

data = pd.read_csv("sampledataset.csv")
X_raw = data['complaint']
y = data['category']


X = [preprocess(text) for text in X_raw]


X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.15, random_state=42, stratify=y
)


tfidf = TFIDF()
tfidf.fit(X_train)


def to_count_vector(doc, vocab):
    counts = {w: doc.count(w) for w in vocab}
    return [counts.get(w, 0) for w in vocab]

vocab = tfidf.vocab
X_train_counts = [to_count_vector(doc, vocab) for doc in X_train]
X_test_counts  = [to_count_vector(doc, vocab) for doc in X_test]


model = NaiveBayes()
model.fit(X_train_counts, list(y_train))

with open("trained_model.pkl", "wb") as f:
    pickle.dump({"model": model, "tfidf": tfidf, "vocab": vocab}, f)

print("Model trained and saved.")