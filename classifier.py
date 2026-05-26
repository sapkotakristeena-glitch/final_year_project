
import math
from collections import defaultdict


def nested_defaultdict():
    return defaultdict(float)

class NaiveBayes:
    def __init__(self):
        self.class_prob = {}
        self.word_prob = defaultdict(nested_defaultdict)  
        self.class_word_totals = defaultdict(float)
        self.vocab_size = 0

    def fit(self, X_counts, y):
        total_docs = len(X_counts)
        class_counts = defaultdict(int)

        for vec, label in zip(X_counts, y):
            class_counts[label] += 1
            for i, count in enumerate(vec):
                if count > 0:
                    self.word_prob[label][i] += count
                    self.class_word_totals[label] += count

        for c, count in class_counts.items():
            self.class_prob[c] = count / total_docs

        self.vocab_size = len(X_counts[0]) if X_counts else 0

    def predict(self, X_counts):
        predictions = []
        for vec in X_counts:
            scores = {}
            for c in self.class_prob:
                score = math.log(self.class_prob[c])
                total = self.class_word_totals[c] + self.vocab_size
                for i, count in enumerate(vec):
                    if count > 0:
                        prob = (self.word_prob[c][i] + 1) / total
                        score += count * math.log(prob)
                scores[c] = score
            predictions.append(max(scores, key=scores.get))  
        return predictions