# train.py
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, classification_report
from preprocessing import preprocess

# ── Load dataset ──────────────────────────────────────────────────
print("Loading dataset...")
data  = pd.read_csv("sampledataset.csv")
X_raw = data["complaint"].astype(str)
y     = data["category"]

print(f"Total samples : {len(data):,}")
print(f"Categories    : {sorted(y.unique())}")
print(f"Distribution  :\n{y.value_counts()}\n")

# ── Preprocess text ───────────────────────────────────────────────
print("Preprocessing text (this may take a while)...")
X_clean = [" ".join(preprocess(text)) for text in X_raw]

# ── Train/test split ──────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X_clean, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
print(f"Train samples : {len(X_train):,}")
print(f"Test samples  : {len(X_test):,}\n")

# ── TF-IDF Vectorization ──────────────────────────────────────────
print("Fitting TF-IDF vectorizer...")
vectorizer = TfidfVectorizer(
    max_features=20000,
    ngram_range=(1, 2),   # unigrams + bigrams
    sublinear_tf=True,    # apply log normalization
    min_df=2,             # ignore very rare words
)
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf  = vectorizer.transform(X_test)
print(f"Vocabulary size: {len(vectorizer.vocabulary_):,}\n")

# ════════════════════════════════════════════════════════════════════
# MODEL 1 — Multinomial Naive Bayes
# ════════════════════════════════════════════════════════════════════
print("=" * 50)
print("Training Multinomial Naive Bayes...")
nb_model   = MultinomialNB(alpha=0.1)
nb_model.fit(X_train_tfidf, y_train)
nb_preds   = nb_model.predict(X_test_tfidf)
nb_accuracy = accuracy_score(y_test, nb_preds)

print(f"Naive Bayes Accuracy : {nb_accuracy * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, nb_preds))

# ════════════════════════════════════════════════════════════════════
# MODEL 2 — Support Vector Machine (LinearSVC)
# ════════════════════════════════════════════════════════════════════
print("=" * 50)
print("Training Support Vector Machine...")
svm_model    = LinearSVC(C=1.0, max_iter=2000, random_state=42)
svm_model.fit(X_train_tfidf, y_train)
svm_preds    = svm_model.predict(X_test_tfidf)
svm_accuracy = accuracy_score(y_test, svm_preds)

print(f"SVM Accuracy         : {svm_accuracy * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, svm_preds))

# ════════════════════════════════════════════════════════════════════
# MODEL COMPARISON & SELECTION
# ════════════════════════════════════════════════════════════════════
print("=" * 50)
print("Model Comparison:")
print(f"  Naive Bayes : {nb_accuracy  * 100:.2f}%")
print(f"  SVM         : {svm_accuracy * 100:.2f}%")

if svm_accuracy >= nb_accuracy:
    best_model      = svm_model
    best_model_name = "SVM"
    best_accuracy   = svm_accuracy
else:
    best_model      = nb_model
    best_model_name = "Naive Bayes"
    best_accuracy   = nb_accuracy

print(f"\n✓ Best model: {best_model_name} ({best_accuracy * 100:.2f}%)")
print(f"  This model will be used for predictions in the app.\n")

# ════════════════════════════════════════════════════════════════════
# SAVE MODELS
# ════════════════════════════════════════════════════════════════════
print("Saving models...")
with open("trained_model.pkl", "wb") as f:
    pickle.dump({
        # Best model for production use
        "model":      best_model,
        "model_name": best_model_name,
        "vectorizer": vectorizer,

        # Both models saved for reference/comparison
        "nb_model":   nb_model,
        "svm_model":  svm_model,

        # Accuracy scores
        "nb_accuracy":  nb_accuracy,
        "svm_accuracy": svm_accuracy,
    }, f)

print(f"✓ Models saved to trained_model.pkl")
print(f"✓ Active model: {best_model_name}")
print("Training complete!")