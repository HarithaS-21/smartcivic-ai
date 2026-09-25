import sys
import os
import joblib

text = sys.argv[1]

base_path = os.path.dirname(os.path.abspath(__file__))

vectorizer_path = os.path.join(base_path, "vectorizer.pkl")
model_path = os.path.join(base_path, "category_model.pkl")

vectorizer = joblib.load(vectorizer_path)
model = joblib.load(model_path)

X = vectorizer.transform([text])

category = model.predict(X)[0]

high_priority_words = [
    "danger",
    "dangerous",
    "accident",
    "overflowing",
    "severe",
    "huge",
    "major",
    "emergency",
    "broken pipe",
    "open manhole"
]

priority = "Medium"

for word in high_priority_words:
    if word.lower() in text.lower():
        priority = "High"
        break

print(category)
print(priority)