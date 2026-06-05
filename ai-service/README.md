# FinMate AI Service

This is the FastAPI microservice that serves the TensorFlow expense categorization model.

## Setup

1. Make sure you have Python 3.10+ installed.
2. Ensure that the model files are placed in the `model/` directory:
   - `model/best_finmate_expense_classifier.keras`
   - `model/label_encoder.pkl`

## Local Development

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
uvicorn main:app --reload --port 8000
```

## Testing

Check health:
```bash
curl -X GET http://localhost:8000/health
```

Test prediction:
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d "{\"description\":\"fried chicken\"}"
```
