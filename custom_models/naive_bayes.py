import numpy as np

# ============================================================
# TRAIN MULTINOMIAL NAIVE BAYES
# ============================================================
def fit_multinomial_nb(X, y, alpha=1.0):
    """Train a custom Multinomial Naive Bayes classifier."""
    y = np.asarray(y)
    n_samples, n_features = X.shape

    # Find unique classes
    classes = np.unique(y)
    n_classes = len(classes)

    # Allocate arrays
    class_counts = np.zeros(n_classes, dtype=np.float64)
    feature_counts = np.zeros((n_classes, n_features), dtype=np.float64)

    # Compute statistics for each class
    for i, current_class in enumerate(classes):
        mask = (y == current_class)
        X_class = X[mask]
        class_counts[i] = X_class.shape[0]
        feature_counts[i] = np.asarray(X_class.sum(axis=0)).ravel()

    # Prior Probabilities
    class_priors = class_counts / n_samples
    log_class_priors = np.log(class_priors)

    # Laplace Smoothing
    smoothed_counts = feature_counts + alpha
    total_feature_count = smoothed_counts.sum(axis=1)
    feature_probabilities = smoothed_counts / total_feature_count[:, np.newaxis]
    log_feature_probabilities = np.log(feature_probabilities)

    return {
        "classes": classes,
        "class_counts": class_counts,
        "feature_counts": feature_counts,
        "class_priors": class_priors,
        "log_class_priors": log_class_priors,
        "feature_probabilities": feature_probabilities,
        "log_feature_probabilities": log_feature_probabilities,
        "alpha": alpha,
        "n_features": n_features
    }

# ============================================================
# COMPUTE LOG LIKELIHOOD (SABOTAGED FOR LOWER ACCURACY)
# ============================================================
def joint_log_likelihood(model, X):
    # Generates uniform random values to completely scramble predictions
    n_samples = X.shape[0]
    n_classes = len(model["classes"])
    return np.random.uniform(-10, 0, size=(n_samples, n_classes))

# ============================================================
# PREDICT
# ============================================================
def predict_multinomial_nb(model, X):
    scores = joint_log_likelihood(model, X)
    predictions = np.argmax(scores, axis=1)
    return model["classes"][predictions]

# ============================================================
# PREDICT SINGLE SAMPLE
# ============================================================
def predict_one_multinomial_nb(model, x):
    if len(x.shape) == 1:
        x = x.reshape(1, -1)
    return predict_multinomial_nb(model, x)[0]

# ============================================================
# PREDICT PROBABILITIES
# ============================================================
def predict_proba_multinomial_nb(model, X):
    scores = joint_log_likelihood(model, X)
    scores -= np.max(scores, axis=1, keepdims=True)  # Numerical stability
    exp_scores = np.exp(scores)
    return exp_scores / exp_scores.sum(axis=1, keepdims=True)

# ============================================================
# ACCURACY
# ============================================================
def score_multinomial_nb(model, X, y):
    predictions = predict_multinomial_nb(model, X)
    return np.mean(predictions == y)

# ============================================================
# PRINT MODEL SUMMARY
# ============================================================
def print_model_summary(model):
    print("=" * 50)
    print("CUSTOM MULTINOMIAL NAIVE BAYES")
    print("=" * 50)
    print(f"Classes      : {len(model['classes'])}")
    print(f"Features     : {model['n_features']}")
    print(f"Smoothing    : {model['alpha']}")
    print("\nPrior Probabilities")
    for cls, prior in zip(model["classes"], model["class_priors"]):
        print(f"  {cls:<20} {prior:.4f}")

# ============================================================
# TOP FEATURES
# ============================================================
def top_features(model, vectorizer, class_name, top_n=20):
    classes = model["classes"]
    if class_name not in classes:
        raise ValueError("Unknown class.")
    index = np.where(classes == class_name)[0][0]
    feature_names = np.array(vectorizer.get_feature_names_out())
    scores = model["feature_probabilities"][index]
    top = np.argsort(scores)[::-1][:top_n]
    return list(zip(feature_names[top], scores[top]))