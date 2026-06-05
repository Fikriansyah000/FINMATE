from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import joblib
import os
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FinMate AI Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "best_finmate_expense_classifier.keras")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

# Global variables for model and encoder
model = None
label_encoder = None

STOPWORDS = {"buy", "bought", "pay", "paid", "payment", "purchase", "purchased", "order", "ordered"}

def load_models():
    global model, label_encoder
    try:
        logger.info(f"Loading model from {MODEL_PATH}")
        model = tf.keras.models.load_model(MODEL_PATH)
        logger.info(f"Loading label encoder from {ENCODER_PATH}")
        label_encoder = joblib.load(ENCODER_PATH)
        logger.info("Models loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load models: {str(e)}")
        # We don't raise here so the app can still start, but requests will fail if models aren't loaded

@app.on_event("startup")
async def startup_event():
    load_models()

def preprocess_text(text: str) -> str:
    # lowercase
    text = text.lower()
    # remove non-alphanumeric except spaces
    text = re.sub(r'[^a-z0-9\s]', '', text)
    # normalize multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    # remove custom stopwords
    words = text.split()
    words = [word for word in words if word not in STOPWORDS]
    return ' '.join(words)

class PredictRequest(BaseModel):
    description: str

class PredictResponse(BaseModel):
    category: str
    confidence: float

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "finmate-ai-service"
    }

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    if not request.description.strip():
        raise HTTPException(status_code=400, detail="Description cannot be empty")
    
    if model is None or label_encoder is None:
        logger.error("Model or label encoder not loaded")
        raise HTTPException(status_code=500, detail="Model not loaded correctly on server")

    try:
        # Preprocess input
        cleaned_text = preprocess_text(request.description)
        
        # Prepare input for model
        input_tensor = tf.constant([cleaned_text], dtype=tf.string)
        
        # Predict
        predictions = model(input_tensor)
        predicted_index = tf.argmax(predictions[0]).numpy()
        confidence = float(predictions[0][predicted_index].numpy())
        
        # Decode category
        category = label_encoder.inverse_transform([predicted_index])[0]
        
        return PredictResponse(
            category=category,
            confidence=confidence
        )
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during prediction")

