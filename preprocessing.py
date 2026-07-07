import re


# ============================================================
# TEXT CLEANING FUNCTIONS
# ============================================================

def to_lowercase(text):
    """
    Convert text to lowercase.
    """
    return text.lower()


def remove_urls(text):
    """
    Remove URLs.
    """
    return re.sub(r"http\S+|www\S+", " ", text)


def remove_emails(text):
    """
    Remove email addresses.
    """
    return re.sub(r"\S+@\S+", " ", text)


def remove_numbers(text):
    """
    Remove numbers.
    """
    return re.sub(r"\d+", " ", text)


def remove_punctuation(text):
    """
    Keep only letters and whitespace.
    """
    return re.sub(r"[^a-zA-Z\s]", " ", text)


def remove_extra_spaces(text):
    """
    Replace multiple spaces with a single space.
    """
    return re.sub(r"\s+", " ", text).strip()


# ============================================================
# TOKENIZATION
# ============================================================

def tokenize(text):
    """
    Split sentence into words.
    """
    return text.split()


# ============================================================
# STOPWORDS
# ============================================================

STOPWORDS = {

    "a", "an", "the",

    "is", "am", "are", "was", "were",

    "be", "been", "being",

    "to", "of", "for", "on", "in", "at",

    "this", "that", "these", "those",

    "it", "its", "it's",

    "i", "me", "my", "mine",

    "you", "your", "yours",

    "he", "she", "they", "them",

    "we", "our", "ours",

    "and", "or", "but",

    "if", "then", "than",

    "with", "without",

    "as", "by", "from",

    "have", "has", "had",

    "do", "does", "did",

    "can", "could", "will", "would",

    "should", "may", "might",

    "not", "no"

}


def remove_stopwords(tokens):
    """
    Remove common English stopwords.
    """
    return [

        word

        for word in tokens

        if word not in STOPWORDS

    ]


# ============================================================
# MAIN PREPROCESSING PIPELINE
# ============================================================

def preprocess(text):
    """
    Complete preprocessing pipeline.

    Returns
    -------
    list
        List of processed tokens.
    """

    text = str(text)

    text = to_lowercase(text)

    text = remove_urls(text)

    text = remove_emails(text)

    text = remove_numbers(text)

    text = remove_punctuation(text)

    text = remove_extra_spaces(text)

    tokens = tokenize(text)

    tokens = remove_stopwords(tokens)

    return tokens