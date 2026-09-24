import sys
import os

text = sys.argv[1] if len(sys.argv) > 1 else ""
text_lower = text.lower()

# High confidence rule-based classification for core civic issues
category = None
if any(k in text_lower for k in ["manhole", "drain", "drainage", "sewer", "sewage", "gutter", "waterlogged", "stagnant water"]):
    category = "Drainage"
elif any(k in text_lower for k in ["garbage", "trash", "waste", "rubbish", "dump", "dustbin", "litter"]):
    category = "Garbage"
elif any(k in text_lower for k in ["streetlight", "street light", "lamp post", "no light", "dark street", "street lamp", "bulb", "illumination"]):
    category = "Streetlight"
elif any(k in text_lower for k in ["pothole", "crater", "road damage", "damaged road", "broken road", "asphalt", "pavement"]):
    category = "Road Damage"
elif any(k in text_lower for k in ["water leak", "pipeline leak", "pipe burst", "pipe broken", "drinking water", "water leakage"]):
    category = "Water Leakage"

# ML Statistical fallback if no explicit keyword matched
if not category:
    try:
        import joblib
        base_path = os.path.dirname(os.path.abspath(__file__))
        vectorizer_path = os.path.join(base_path, "vectorizer.pkl")
        model_path = os.path.join(base_path, "category_model.pkl")
        if os.path.exists(vectorizer_path) and os.path.exists(model_path):
            vectorizer = joblib.load(vectorizer_path)
            model = joblib.load(model_path)
            X = vectorizer.transform([text])
            category = model.predict(X)[0]
    except Exception:
        pass

if not category:
    category = "Road Damage"

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
    "open manhole",
    "hazard",
    "critical"
]

priority = "Medium"
for word in high_priority_words:
    if word in text_lower:
        priority = "High"
        break

print(category)
print(priority)