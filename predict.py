
import pickle
from preprocessing import preprocess

with open("trained_model.pkl", "rb") as f:
    saved = pickle.load(f)

model = saved["model"]
vocab = saved["vocab"]

def classify_complaint(text):
    tokens = preprocess(text)
    counts = [tokens.count(w) for w in vocab]
    category = model.predict([counts])[0]
    return category

complaint = input("Enter complaint: ")
print("Category:", classify_complaint(complaint))