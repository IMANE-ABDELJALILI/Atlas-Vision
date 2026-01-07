#  Atlas Vision

**What if walls could share their history?**

Atlas Vision is a Fullstack AI application designed to valorize cultural heritage. It acts as an intelligent guide capable of recognizing monuments from a single photo and narrating their history using Generative AI.

[![Live Demo](https://img.shields.io/badge/Demo-Live_App-brightgreen?style=for-the-badge)](https://atlas-vision.netlify.app)
[![Tech Stack](https://img.shields.io/badge/Stack-FastAPI_|_React-blue?style=for-the-badge)](#tech-stack)

---

##  About The Project

Developed as an engineering project , Atlas Vision solves a common problem: visiting historic places without knowing their context.

Unlike generic object detection apps, Atlas Vision uses a **Hybrid AI Architecture** that combines specialized computer vision with advanced Large Language Models (LLMs) to provide a rich, interactive educational experience.

### Key Features
* **Instant Recognition:** Identifies monuments from user-uploaded photos.
* **Interactive Guide:** Chat with the AI to ask specific questions about the place (history, architecture, anecdotes).
* **Hybrid Intelligence:** Combines the precision of Computer Vision with the reasoning of LLMs.
* **Moroccan Heritage Focus:** The model is specifically fine-tuned on a dataset of Moroccan landmarks.

---

##  Architecture

The system operates in two distinct phases:

### 1. The Vision (Perception)
* **Technology:** Azure Custom Vision .
* **Process:** the Azure Custom Vision service to build a specialized recognition system. By providing a curated dataset of local monuments, I enabled the application to detect and identify landmarks with high accuracy.

### 2. The Intelligence (Cognition)
* **Technology:** Multi-LLM Pipeline (Google Gemini & Mistral AI).
* **Process:** Once the monument is identified (e.g., "Hassan II Mosque"), the metadata is passed to the GenAI engine which generates historical context and handles the user's conversational queries.

---

##  Tech Stack

### Frontend
* **Framework:** React.js (Vite)
* **Hosting:** Netlify
* **Styling:** CSS Modules / Tailwind

### Backend
* **Framework:** FastAPI (Python)
* **Runtime:** Docker Containers
* **Hosting:** Hugging Face Spaces
* **Security:** Environment Variables for API Key management

### AI Services
* **Computer Vision:** Azure Custom Vision
* **LLMs:** Google Gemini Pro, Mistral AI

---

##  Getting Started

### Prerequisites
* Python 3.9+
* Docker (Optional)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/IMANE-ABELJALILI/atlas-vision.git](https://github.com/IMANE-ABDELJALILI/atlas-vision.git)
    cd atlas-vision
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    pip install -r requirements.txt
    # Create a .env file with your API Keys (GEMINI_API_KEY, etc.)
    uvicorn app:app --reload
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---
## ⚠️ Usage Note

The recognition model has been specifically trained on **Moroccan heritage sites**. For the best performance and accuracy, please test the application with photos of monuments located in Morocco.

---

## 👤 Author

**Your Name**
* Student at National School of Applied Sciences of Fez (ENSA Fès)
* LinkedIn: www.linkedin.com/in/imane-abdeljalili-b15976261

---

*Developed with ❤️ by IMANE ABDELJALILI .*
