#  Atlas Vision

Atlas Vision est une application Fullstack intelligente qui permet d'analyser des lieux touristiques à partir d'images et de discuter avec une IA spécialisée, intégrant la puissance de Gemini et Mistral.

![Status](https://img.shields.io/badge/Status-Live-success)
![Stack](https://img.shields.io/badge/Tech-React%20%7C%20FastAPI-blue)

##  Démo en ligne

- ** (Site Web) :** [https://atlas-vision.netlify.app](https://atlas-vision.netlify.app)

##  Fonctionnalités

* ** Analyse de Monuments :** Identifie et donne des informations détaillées sur des lieux touristiques à partir d'une simple photo (utilisant l'IA multimodale).
* ** Assistant Chatbot :** Un chat interactif pour poser des questions sur la culture, l'histoire ou le tourisme.
* ** Multi-LLM :** Combinaison des modèles **Google Gemini** et **Mistral AI** pour des réponses précises.
* ** Rapide & Réactif :** Interface moderne construite avec React et Vite.

## 🛠️ Stack Technique

### Frontend
* **Framework :** React.js (Vite)
* **Hébergement :** Netlify
* **Langage :** JavaScript / JSX

### Backend
* **Framework :** FastAPI (Python)
* **Hébergement :** Hugging Face Spaces (Docker)
* **APIs Externes :** Google Gemini API, Mistral API

## ⚙️ Installation Locale

Si vous souhaitez cloner et lancer le projet sur votre machine :

### 1. Backend (API)
```bash
cd backend
# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
uvicorn main:app --reload
