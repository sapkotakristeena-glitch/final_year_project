
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from preprocessing import preprocess

# Load saved model
with open("trained_model.pkl", "rb") as f:
    saved = pickle.load(f)

model = saved["model"]
vocab = saved["vocab"]

# Reload and reprocess data
data = pd.read_csv("sampledataset.csv")
X_raw = data['complaint']
y = data['category']

X = [preprocess(text) for text in X_raw]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.15, random_state=42, stratify=y
)

# Build count vectors for test set
X_test_counts = [[doc.count(w) for w in vocab] for doc in X_test]

# Predict
predictions = model.predict(X_test_counts)

# Results
print("\n--- Classification Report ---")
print(classification_report(y_test, predictions))

print("\n--- Confusion Matrix ---")
print(confusion_matrix(y_test, predictions))