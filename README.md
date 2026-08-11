# JanSetu-AI — Citizen Grievance Redressal Portal

**“Your Grievance. Our Bridge to Resolution.”**



## Key Features

1.  **AI Voice Input**: Citizens can speak their complaints. Powered by the browser's Web Speech API with multilingual support.
2.  **Automatic Department Classification**: The NLP engine classifies complaints into categories (Municipal Corporation, Electricity Department, Water Supply, etc.) with confidence scoring.
3.  **Priority & SLA Predictor**: Assigns severity level (Critical, High, Medium, Low) and sets expected resolution deadlines (e.g. 24 hours, 48 hours, 4 days).
4.  **Emergency Threat Detector**: Scans for life-safety threats (fire, live wire) and flags them as Critical while displaying local emergency help contact cards (112/100).
5.  **Duplicate Proximity Scanner**: Compares incoming descriptions against active cases within a 1 km radius to prevent duplicate municipal workload.
6.  **Interactive Timelines**: Citizens can track status steps from submission, officer assignment, on-site progress, to resolution.
7.  **Interactive Geolocation**: Integrated GPS mapping for precise issue location reporting.
8.  **Citizen Satisfaction Rating**: Citizens can rate resolutions on a 5-star metric or choose to **Reopen & Escalate** unresolved cases.
9.  **Officer Workspace**: Dashboard for ward officers to filter/search grievances, accept cases, record updates, and upload resolution proof photos.
10. **Admin Command Center**: Visual executive analytics reporting system displaying department performance, monthly trend graphs, and SLA breach queues.
11. **JanSetu AI Chatbot**: Floating assistant widget answering status checks and civic routing questions.
12. **Multilingual i18n support**: Switch UI interfaces instantly between **English**, **Hindi (हिन्दी)**, and **Gujarati (ગુજરાતી)**.

---

## Tech Stack

*   **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts (data visualizations), Lucide Icons, Canvas Confetti.
*   **Backend**: Python FastAPI, Uvicorn ASGI Server, Pydantic v2 schemas.
*   **Database**: Supabase PostgreSQL (Production) + SQLite / LocalStorage Cache (Dual-Mode Demo Fallback).
*   **AI/NLP**: Python Regex & keyword probability modeling (modularly designed to swap in Gemini API / OpenAI API).

---

## User Roles & Demo Credentials

| Role | Email | Password | Primary Functions |
|---|---|---|---|
| **Citizen** | `demo.citizen@jansetu.ai` | `Demo@123` | Lodge complaints, voice logs, track timeline, leave feedback ratings. |
| **Officer** | `demo.officer@jansetu.ai` | `Demo@123` | View assigned department complaints, update status, upload resolution proof. |
| **Admin** | `demo.admin@jansetu.ai` | `Demo@123` | Performance analytics charts, monitor SLA breaches, system settings. |

---

## AI Architecture

```text
Citizen Input (Voice / Text)
       ↓
Browser Web Speech API (if voice)
       ↓
NLP Keyword & Priority Classifier
       ↓
Emergency Detection Checks (Life-safety keywords -> alert 112/100)
       ↓
Duplicate Proximity Match (1 km radius text overlap check)
       ↓
Department & Subcategory Routing (Municipal, Electricity, Water, etc.)
       ↓
SLA Time Limit Calculator (Critical: 24h, High: 48h, Medium: 96h, Low: 168h)
       ↓
Smart Dispatcher Routing (Officer assignment in target Ward)
```

---

## How to Run the Project

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)

### 
   ```
2. Create and activate a Python virtual environment:
   *   **Windows**:
       ```bash
       python -m venv .venv
       .venv\Scripts\activate
       ```
   *   **macOS/Linux**:
       ```bash
       python3 -m venv .venv
       source .venv/bin/activate
       ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *The server will run on `http://127.0.0.1:8000`. You can visit health checks at `http://127.0.0.1:8000/api/health`.*

### 2. Run Frontend React Web Application
1. In the project root directory, install npm packages:
   ```bash
   npm install
   ```
2. Start the Vite local development server:
   ```bash
   npm run dev
   ```
   *Vite will start on `http://localhost:5173`. Open this URL in Chrome or Edge to try the voice inputs.*

---

## Connecting Real AI APIs (Gemini / Vertex AI)

The AI engine in `backend/services/ai_service.py` is fully decoupled from the routing and database. To connect a real LLM (like Google Gemini):

1.  Add `google-genai` to `backend/requirements.txt`.
2.  Set your API key in `backend/.env`: `GEMINI_API_KEY=your_key_here`.
3.  Replace the mock logic in `backend/services/ai_service.py` with:
    ```python
    import os
    from google import genai

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def analyze_grievance(description: str, location: dict):
        # Program a structured output schema in Pydantic
        # Send text to Gemini Flash to classify department, priority, and summary
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=description,
            # Pass your Pydantic schema for structured output classification
        )
        return response.parsed
    ```

---

## Connecting Live Supabase Database

The backend client in `backend/database.py` and frontend in `src/services/supabaseClient.ts` support dual-mode database operations:

