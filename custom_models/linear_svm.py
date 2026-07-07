import numpy as np


# ============================================================
# TRAIN A SINGLE BINARY LINEAR SVM
# Mini-Batch Gradient Descent + Vectorized Operations
# ============================================================

def fit_binary_svm(
    X,
    y,
    learning_rate=0.05,
    lambda_param=0.01,
    epochs=20,
    batch_size=128
):
    """
    Train a binary Linear SVM using
    Mini-Batch Gradient Descent.

    Supports sparse TF-IDF matrices directly.
    """

    y = np.asarray(y, dtype=np.float64)

    n_samples, n_features = X.shape

    weights = np.zeros(n_features, dtype=np.float64)
    bias = 0.0

    for epoch in range(epochs):

        # Shuffle indices only (don't copy X)
        indices = np.random.permutation(n_samples)

        for start in range(0, n_samples, batch_size):

            end = min(start + batch_size, n_samples)

            batch = indices[start:end]

            X_batch = X[batch]
            y_batch = y[batch]

            # -----------------------------
            # Decision Function
            # -----------------------------

            scores = X_batch.dot(weights) + bias

            margins = y_batch * scores

            # -----------------------------
            # Hinge Loss Mask
            # -----------------------------

            active = (margins < 1).astype(np.float64)

            # -----------------------------
            # Gradient
            # -----------------------------

            grad_w = (
                lambda_param * weights
                -
                (
                    X_batch.T.dot(
                        y_batch * active
                    )
                    / len(y_batch)
                )
            )

            grad_b = -np.sum(
                y_batch * active
            ) / len(y_batch)

            # -----------------------------
            # Parameter Update
            # -----------------------------

            weights -= (
                learning_rate *
                np.asarray(grad_w).ravel()
            )

            bias -= learning_rate * grad_b

    return {

        "weights": weights,

        "bias": bias

    }

# ============================================================
# TRAIN MULTICLASS SVM (ONE-VS-REST)
# ============================================================

def fit_multiclass_svm(
    X,
    y,
    learning_rate=0.01,
    lambda_param=0.01,
    epochs=50,
    batch_size=64
):

    y = np.asarray(y)

    classes = np.unique(y)

    classifiers = {}

    print("\n" + "=" * 60)
    print("CUSTOM LINEAR SVM TRAINING")
    print("=" * 60)
    print(f"Classes      : {len(classes)}")
    print(f"Epochs       : {epochs}")
    print(f"Batch Size   : {batch_size}")
    print(f"LearningRate : {learning_rate}")
    print(f"Lambda       : {lambda_param}")
    print("=" * 60)

    for i, current_class in enumerate(classes):

        print(f"\n[{i+1}/{len(classes)}] Training '{current_class}'")

        binary_labels = np.where(
            y == current_class,
            1.0,
            -1.0
        )

        classifiers[current_class] = fit_binary_svm(

            X=X,

            y=binary_labels,

            learning_rate=learning_rate,

            lambda_param=lambda_param,

            epochs=epochs,

            batch_size=batch_size

        )

        print("Completed.")

    print("\nTraining Finished.\n")

    return {

        "classes": classes,

        "classifiers": classifiers,

        "learning_rate": learning_rate,

        "lambda_param": lambda_param,

        "epochs": epochs,

        "batch_size": batch_size

    }

# ============================================================
# DECISION FUNCTION
# ============================================================

def decision_function(model, X):
    """
    Compute decision scores for every class.
    """

    classes = model["classes"]
    classifiers = model["classifiers"]

    return np.column_stack([

        X.dot(
            classifiers[current]["weights"]
        ) + classifiers[current]["bias"]

        for current in classes

    ])


# ============================================================
# PREDICT MULTIPLE SAMPLES
# ============================================================

def predict_multiclass_svm(model, X):
    """
    Predict class labels.
    """

    scores = decision_function(model, X)

    best_indices = np.argmax(scores, axis=1)

    return model["classes"][best_indices]


# ============================================================
# PREDICT SINGLE SAMPLE
# ============================================================

def predict_one_svm(model, x):
    """
    Predict one sample.
    """

    if len(x.shape) == 1:
        x = x.reshape(1, -1)

    prediction = predict_multiclass_svm(model, x)

    return prediction[0]


# ============================================================
# RETURN RAW SCORES
# ============================================================

def predict_scores(model, X):
    """
    Return raw decision scores.
    """

    return decision_function(model, X)


# ============================================================
# ACCURACY
# ============================================================

def score_multiclass_svm(model, X, y):
    """
    Compute classification accuracy.
    """

    predictions = predict_multiclass_svm(model, X)

    return np.mean(predictions == y)


# ============================================================
# PRINT MODEL SUMMARY
# ============================================================

def print_model_summary(model):

    print("\n" + "=" * 60)
    print("CUSTOM LINEAR SUPPORT VECTOR MACHINE")
    print("=" * 60)

    print(f"Classes        : {len(model['classes'])}")
    print(f"Epochs         : {model['epochs']}")
    print(f"Batch Size     : {model['batch_size']}")
    print(f"Learning Rate  : {model['learning_rate']}")
    print(f"Lambda         : {model['lambda_param']}")

    print("\nBinary Classifiers")

    for cls in model["classes"]:
        print(f"  • {cls}")

    print("=" * 60)