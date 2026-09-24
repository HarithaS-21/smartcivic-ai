from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

complaints = [
    "garbage is overflowing",
    "garbage dumped on road",
    "waste is not collected",
    "dustbin is full",
    "road has a large pothole",
    "road is damaged",
    "broken road near school",
    "potholes on main road",
    "street light is not working",
    "lamp post is broken",
    "no light on the street",
    "streetlight needs repair",
    "water pipe is leaking",
    "water leakage on road",
    "drinking water pipe is broken",
    "water is leaking continuously",
    "drain is blocked",
    "drainage is overflowing",
    "sewage water on road",
    "blocked drainage near house"
]

categories = [
    "Garbage",
    "Garbage",
    "Garbage",
    "Garbage",
    "Road Damage",
    "Road Damage",
    "Road Damage",
    "Road Damage",
    "Streetlight",
    "Streetlight",
    "Streetlight",
    "Streetlight",
    "Water Leakage",
    "Water Leakage",
    "Water Leakage",
    "Water Leakage",
    "Drainage",
    "Drainage",
    "Drainage",
    "Drainage"
]

vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(complaints)

model = LogisticRegression()

model.fit(X, categories)

joblib.dump(vectorizer, "vectorizer.pkl")
joblib.dump(model, "category_model.pkl")

print("AI model trained successfully")