import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [state, setState] = useState("Andhra Pradesh");
  const [district, setDistrict] = useState("Chittoor");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const districts = [
    "Chittoor",
    "Guntur",
    "Krishna",
    "Visakhapatnam",
    "East Godavari",
    "West Godavari",
    "Nellore",
    "Kurnool",
    "Prakasam",
    "Kadapa",
    "Anantapur"
  ];

  // preload voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  // 🎤 VOICE ENGINE (FIXED)
  const speak = (text) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 1;
    speech.pitch = 1.25;
    speech.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    const selectedVoice =
      voices.find(v => v.name.toLowerCase().includes("female")) ||
      voices.find(v => v.name.toLowerCase().includes("google")) ||
      voices.find(v => v.name.toLowerCase().includes("zira")) ||
      voices[0];

    speech.voice = selectedVoice;

    window.speechSynthesis.speak(speech);
  };

  const askAI = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/ai-agent", {
        state,
        district,
        message
      });

      setResponse(res.data);
      speak(res.data.voice_text || res.data.reply);

    } catch (err) {
      setResponse({
        error: "Backend not connected ❌",
        hint: "Run uvicorn main:app --reload"
      });
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>

      <h1 style={styles.title}>🌾 AgriShield AI</h1>
      <p style={styles.subtitle}>
        Smart Farming Assistant for Andhra Pradesh Farmers
      </p>

      <div style={styles.card}>

        <div style={styles.row}>
          <div style={styles.box}>
            <label>State</label>
            <select value={state} onChange={(e) => setState(e.target.value)} style={styles.input}>
              <option>Andhra Pradesh</option>
            </select>
          </div>

          <div style={styles.box}>
            <label>District</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} style={styles.input}>
              {districts.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <input
          style={styles.textbox}
          placeholder="Ask: crop, price, rainfall, risk..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button style={styles.button} onClick={askAI}>
          {loading ? "Analyzing AI..." : "🚀 Ask AI"}
        </button>

      </div>

      <div style={styles.card}>
        <h2>🤖 AI Response</h2>

        {!response && <p>No response yet</p>}

        {response && (
          <pre style={styles.output}>
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

/* ---------------- UI STYLES ---------------- */
const styles = {
  page: {
    fontFamily: "Arial",
    background: "#f5f7fb",
    minHeight: "100vh",
    padding: 20
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    marginBottom: 5
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: 20
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  row: {
    display: "flex",
    gap: 20,
    marginBottom: 10
  },
  box: {
    flex: 1
  },
  input: {
    width: "100%",
    padding: 8,
    marginTop: 5
  },
  textbox: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    marginBottom: 10
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  },
  output: {
    background: "#111",
    color: "#0f0",
    padding: 10,
    borderRadius: 8,
    overflowX: "auto"
  }
};
