from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

app = FastAPI()

# 🌐 CORS (needed for Vercel frontend later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔑 OpenWeather API Key (set in Render / .env)
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


# 🚀 ROOT ROUTE (your output)
@app.get("/")
def home():
    return {
        "status": "AgriShield AI Running 🚀"
    }


# 🌦️ WEATHER API (OpenWeather)
@app.get("/weather")
def get_weather(city: str):
    if not OPENWEATHER_API_KEY:
        return {"error": "Missing OPENWEATHER_API_KEY"}

    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
    )

    response = requests.get(url)
    return response.json()


# 🤖 AI AGENT (AgriShield Intelligence)
@app.post("/ai-agent")
def ai_agent(payload: dict):
    message = payload.get("message", "").lower()

    # 🌧️ Rain advice
    if "rain" in message:
        return {
            "reply": "🌧️ Rain expected. Avoid pesticide spraying and protect harvested crops.",
            "risk": "medium"
        }

    # 🐛 Pest control
    if "pest" in message or "insect" in message:
        return {
            "reply": "🐛 Pest detected. Use neem oil spray or organic pesticides for safety.",
            "risk": "high"
        }

    # 📊 Market price
    if "price" in message or "market" in message:
        return {
            "reply": "📊 Market prices change daily. Check nearest mandi before selling crops.",
            "risk": "low"
        }

    # 🌱 default response
    return {
        "reply": "🤖 Please provide details like crop, weather, pest, or market query.",
        "risk": "unknown"
    }