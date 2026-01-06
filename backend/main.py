from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from mistralai import Mistral
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# CONFIG AZURE + LLM
# ==============================
AZURE_CUSTOM_VISION_ENDPOINT = os.getenv("AZURE_CUSTOM_VISION_ENDPOINT")
AZURE_CUSTOM_VISION_PREDICTION_KEY = os.getenv("AZURE_CUSTOM_VISION_PREDICTION_KEY")
AZURE_CUSTOM_VISION_PROJECT_ID = os.getenv("AZURE_CUSTOM_VISION_PROJECT_ID")
AZURE_CUSTOM_VISION_ITERATION = os.getenv("AZURE_CUSTOM_VISION_ITERATION")

# LLM Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

# ==============================
# APP
# ==============================

app = FastAPI(title="Atlas Vision API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration des clients LLM
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-pro')
mistral_client = Mistral(api_key=MISTRAL_API_KEY)

print("✅ Atlas Vision API démarrée")

# ==============================
# LLM avec FALLBACK
# ==============================

def call_llm_with_fallback(prompt: str, system_prompt: str = "") -> str:
    """
    Essaie d'abord Gemini, puis Mistral en fallback.
    """
    # Essai avec Gemini (primaire)
    try:
        full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
        response = gemini_model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        print(f" Erreur Gemini, fallback vers Mistral: {e}")
        
        # Fallback vers Mistral
        try:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            response = mistral_client.chat.complete(
                model="mistral-large-latest",
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e2:
            print(f" Erreur Mistral également: {e2}")
            return "Description indisponible."

# ==============================
# DESCRIPTION IA
# ==============================

def generer_description_courte(monument: str, language: str = "fr"):
    system_prompt = f"Tu es un guide touristique expert. Tu réponds en {language}."
    prompt = f"Donne une description courte (2 phrases max) du monument : {monument}."
    return call_llm_with_fallback(prompt, system_prompt)

# ==============================
# ANALYSE IMAGE
# ==============================

@app.post("/analyze-landmark")
async def analyze_landmark(file: UploadFile = File(...)):
    print(" Analyse image via Azure Custom Vision")

    api_url = (
        f"{AZURE_CUSTOM_VISION_ENDPOINT.rstrip('/')}/customvision/v3.0/Prediction/"
        f"{AZURE_CUSTOM_VISION_PROJECT_ID}/classify/iterations/{AZURE_CUSTOM_VISION_ITERATION}/image"
    )

    headers = {
        "Prediction-Key": AZURE_CUSTOM_VISION_PREDICTION_KEY,
        "Content-Type": "application/octet-stream"
    }

    image_data = await file.read()

    if len(image_data) > 4_000_000:
        return {"found": False, "message": "Image trop volumineuse"}

    response = requests.post(api_url, headers=headers, data=image_data)
    response.raise_for_status()
    data = response.json()

    predictions = data.get("predictions", [])
    if not predictions:
        return {"found": False}

    best = max(predictions, key=lambda p: p["probability"])

    if best["probability"] < 0.5:
        return {"found": False}

    description = generer_description_courte(best["tagName"], "fr")

    return {
        "found": True,
        "name": best["tagName"],
        "confidence": best["probability"],
        "ai_description": description
    }


# ==============================
# CHATBOT
# ==============================

class ChatRequest(BaseModel):
    monument_name: str
    question: str

@app.post("/chat")
async def chat_handler(request: ChatRequest):
    system_prompt = f"Tu es le monument : {request.monument_name}. Réponds comme un guide."
    reply = call_llm_with_fallback(request.question, system_prompt)
    return {"reply": reply}

# ==============================
# RUN
# ==============================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
