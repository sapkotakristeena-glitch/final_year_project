import nltk
import spacy
import math
from nltk.corpus import stopwords
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))
lemm = spacy.load("en_core_web_sm")

for word in ['no','never','nor','not','but']:
    stop_words.discard(word)
    
def clean_tokenize(rtext):    
    
    rtext= rtext.lower()
    clean_lowertext = ""
    for ch in rtext:
        if ch.isalpha() or ch.isdigit() or ch.isspace():
            clean_lowertext += ch
            
    punctuation = ".,!?;:'\"()-#$%\\`~@&*+=/<>[]{}|^_"

    for p in punctuation:
        clean_lowertext= clean_lowertext.replace(p,"")
    tokens = clean_lowertext.split()
    print(f"tokens:",tokens)
    return tokens

def stopword_removal(tokens):
    filtered_rawtext = []
    for clean_token in tokens:
        if clean_token not in stop_words:
            filtered_rawtext.append(clean_token)

    clean_rtext = " ".join(filtered_rawtext)
    print("clean text:",clean_rtext)
    return clean_rtext

def lemmataization_rootform(clean_rtext):
    root = lemm(clean_rtext)
    lemmatization = [tokenroot.lemma_ for tokenroot in root]
    print("Word root form:", lemmatization)
    return lemmatization

def TF_calculation(lemmatization):
    tf_dict = {}
    total_words = len(lemmatization)
    for word in lemmatization:
        tf_dict[word] = tf_dict.get(word,0)+1
        
    for word in tf_dict:
        tf_dict[word] = tf_dict[word]/total_words
        

    print("TF", tf_dict)
    return tf_dict

corpus = []

def IDF_calculation(tf_dict):
    
    N= len(corpus)
    idf_dict = {}
    all_words = set(word for doc in corpus for word in doc)
    for word in all_words:
        doc_count = sum(1 for doc in corpus if word in doc)
        idf_dict[word]= math.log((N/(1+doc_count)))+1
    print("IDF",idf_dict)
    return idf_dict

def TF_IDF_calculation(tf_dict,idf_dict):
    tf_idf_dict ={}

    for word in tf_dict:
        if word in idf_dict:
            tf_idf_dict[word]= tf_dict[word]*idf_dict[word]
    
    return tf_idf_dict
    
def classify(tf_idf_dict):

    if "payment" in tf_idf_dict:
        return "Payment Issue"
    elif "internet" in tf_idf_dict or "network" in tf_idf_dict or "wifi" in tf_idf_dict:
        return "Network Issue"
    elif "service" in tf_idf_dict:
        return "Delivery Issue"
    else:
        return "General Issue"

def get_priority(tf_idf_dict):
    if "fail" in tf_idf_dict or "not" in tf_idf_dict or "stop" in tf_idf_dict:
        return "High"
    elif "slow" in tf_idf_dict:
        return "Medium"
    else:
        return "Low"

def preprocessing_part(rtext):
    tokens = clean_tokenize(rtext)
    clean_rtext = stopword_removal(tokens)
    lemmataization = lemmataization_rootform(clean_rtext)
    corpus.append(lemmataization) 
    tf_dict = TF_calculation(lemmataization)
    idf_dict = IDF_calculation(corpus)
    tf_idf_dict = TF_IDF_calculation(tf_dict, idf_dict)
    category = classify(tf_idf_dict)
    priority = get_priority(tf_idf_dict)
    print("TF-IDF", tf_idf_dict)
    print("Category:", category)
    print("Priority:",priority)
    return{
        "TF-IDF":tf_idf_dict,
        "Category": category,
        "Priority": priority
    } 
rtext = input("enter complain:")
result = preprocessing_part(rtext)

print("\nCorpus till now:",corpus)
