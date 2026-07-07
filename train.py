# ============================================================
# IMPORTS
# ============================================================

import pickle
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report

from preprocessing import preprocess

from custom_models.naive_bayes import (
    fit_multinomial_nb,
    predict_multinomial_nb
)

from custom_models.linear_svm import (
    fit_multiclass_svm,
    predict_multiclass_svm
)


# ============================================================
# LOAD DATASET
# ============================================================

print("=" * 60)
print("LOADING DATASET")
print("=" * 60)

data = pd.read_csv("sampledataset.csv")

X_raw = data["complaint"].astype(str)
y = data["category"]

print(f"Samples      : {len(data):,}")
print(f"Categories   : {len(np.unique(y))}")

print("\nDistribution")
print(y.value_counts())


# ============================================================
# PREPROCESS
# ============================================================

print("\n" + "=" * 60)
print("PREPROCESSING")
print("=" * 60)

X_clean = [

    " ".join(preprocess(text))

    for text in X_raw

]


# ============================================================
# TRAIN TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(

    X_clean,

    y,

    test_size=0.20,

    random_state=42,

    stratify=y

)

print(f"\nTraining Samples : {len(X_train):,}")
print(f"Testing Samples  : {len(X_test):,}")


# ============================================================
# TF-IDF
# ============================================================

print("\n" + "=" * 60)
print("TF-IDF VECTORIZATION")
print("=" * 60)

vectorizer = TfidfVectorizer(

    max_features=5000,

    ngram_range=(1, 2),

    sublinear_tf=True,

    min_df=2

)

X_train_tfidf = vectorizer.fit_transform(X_train)

X_test_tfidf = vectorizer.transform(X_test)

print(f"Vocabulary Size : {len(vectorizer.vocabulary_):,}")


# ============================================================
# LABEL NOISE
# ============================================================

noise_rate = 0.05

categories = np.unique(y)

y_train = np.asarray(y_train, dtype=object).copy()

num_noisy = int(len(y_train) * noise_rate)

indices = np.random.choice(

    len(y_train),

    num_noisy,

    replace=False

)

for idx in indices:

    current = y_train[idx]

    choices = categories[categories != current]

    y_train[idx] = np.random.choice(choices)

print(f"\nInjected {num_noisy} noisy labels.")


# ============================================================
# CUSTOM MULTINOMIAL NAIVE BAYES
# ============================================================

print("\n" + "=" * 60)
print("TRAINING CUSTOM MULTINOMIAL NAIVE BAYES")
print("=" * 60)

nb_model = fit_multinomial_nb(

    X_train_tfidf,

    y_train,

    alpha=0.1

)

nb_predictions = predict_multinomial_nb(

    nb_model,

    X_test_tfidf

)

nb_accuracy = accuracy_score(

    y_test,

    nb_predictions

)

print(f"\nNaive Bayes Accuracy : {nb_accuracy*100:.2f}%")

print("\nClassification Report\n")

print(

    classification_report(

        y_test,

        nb_predictions

    )

)

# ============================================================
# CUSTOM LINEAR SVM
# ============================================================

print("\n" + "=" * 60)
print("TRAINING CUSTOM LINEAR SVM")
print("=" * 60)

svm_model = fit_multiclass_svm(

    X=X_train_tfidf,

    y=y_train,

    learning_rate=0.05,

    lambda_param=0.01,

    epochs=20,

    batch_size=128

)

svm_predictions = predict_multiclass_svm(

    svm_model,

    X_test_tfidf

)

svm_accuracy = accuracy_score(

    y_test,

    svm_predictions

)

print(f"\nLinear SVM Accuracy : {svm_accuracy*100:.2f}%")

print("\nClassification Report\n")

print(

    classification_report(

        y_test,

        svm_predictions

    )

)


# ============================================================
# MODEL COMPARISON
# ============================================================

print("\n" + "=" * 60)
print("MODEL COMPARISON")
print("=" * 60)

print(f"Custom Multinomial Naive Bayes : {nb_accuracy*100:.2f}%")
print(f"Custom Linear SVM             : {svm_accuracy*100:.2f}%")

if svm_accuracy >= nb_accuracy:

    best_model = svm_model

    best_name = "Custom Linear SVM"

    best_accuracy = svm_accuracy

else:

    best_model = nb_model

    best_name = "Custom Multinomial Naive Bayes"

    best_accuracy = nb_accuracy


print("\nBest Model")
print("-" * 60)

print(best_name)

print(f"Accuracy : {best_accuracy*100:.2f}%")



# ============================================================
# SAVE TRAINED MODELS
# ============================================================

print("\n" + "=" * 60)
print("SAVING MODELS")
print("=" * 60)

model_package = {

    # Production model
    "model": best_model,

    "model_name": best_name,

    "vectorizer": vectorizer,

    # Individual models
    "naive_bayes": nb_model,

    "linear_svm": svm_model,

    # Performance
    "naive_bayes_accuracy": nb_accuracy,

    "linear_svm_accuracy": svm_accuracy

}

with open("trained_model.pkl", "wb") as file:

    pickle.dump(

        model_package,

        file

    )

print("\ntrained_model.pkl saved successfully.")

print("\nTraining Complete!")

print("=" * 60)