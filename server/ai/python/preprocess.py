import os
from pathlib import Path
import re

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

CURRENT_DIR = Path(__file__).resolve().parent
DATASET_PATH = Path(
    os.getenv("SENTIMENT_DATASET_PATH", CURRENT_DIR / "1.csv")
).resolve()

if not DATASET_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found at {DATASET_PATH}. "
        "Set SENTIMENT_DATASET_PATH to a valid CSV file before training."
    )

data = pd.read_csv(DATASET_PATH)
data.columns = data.columns.str.strip()

# Preprocessing function
def preprocess_text(text):
    text = text.lower()  
    text = re.sub(r'\d+', '', text)  
    text = re.sub(r'[^\w\s]', '', text)  
    text = re.sub(r'\s+', ' ', text).strip()  
    return text

# Apply preprocessing
data['Cleaned_Review'] = data['text'].apply(preprocess_text)

# Vectorize text data
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(data['Cleaned_Review'])

# Use 'airline_sentiment' as the target
y = data['airline_sentiment']


from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

logistic_model = LogisticRegression()
logistic_model.fit(X_train, y_train)
print("Accuracy:", logistic_model.score(X_test, y_test))

ENABLE_BERT = os.getenv("ENABLE_BERT_FINE_TUNE") == "true"

if ENABLE_BERT:
    from transformers import BertTokenizer, TFBertForSequenceClassification

    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    bert_model = TFBertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=3)

    inputs = tokenizer(list(data['Cleaned_Review']), return_tensors="tf", padding=True, truncation=True)
    bert_model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    bert_model.fit(inputs, y, epochs=5, batch_size=16)

from sklearn.metrics import classification_report

y_pred = logistic_model.predict(X_test)
print(classification_report(y_test, y_pred))
