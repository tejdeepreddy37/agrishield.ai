import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bot, User, Mic, Wheat } from "lucide-react";

export default function App() {

  const [state, setState] = useState("Andhra Pradesh");
  const [district, setDistrict] = useState("Chittoor");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [voiceOn, setVoiceOn] = useState(true);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);
  let speaking = false;

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speak = (text) => {
    if (!voiceOn || speaking) return;

    speaking = true;

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
      .replace(/\*/g, "")
      .replace(/\n/g, " ");

    const msg = new SpeechSynthesisUtterance(cleanText);

    msg.rate = 0.92;
    msg.pitch = 1.2;
    msg.lang = "en-IN";

    const voices = window.speechSynthesis.getVoices();
    msg.voice = voices.find(v => v.lang.includes("en")) || voices[0];

    msg.onend = () => {
      speaking = false;
    };

    window.speechSynthesis.speak(msg);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/ai-agent", {
        state,
        district,
        message: input
      });

      const aiText = res.data.reply || "No response";

      const aiMsg = { role: "ai", text: aiText };

      setMessages(prev => [...prev, aiMsg]);

      speak(aiText);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Backend not connected" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2><Wheat /> AgriShield AI</h2>

        <div style={styles.row}>
          <select value={state} onChange={(e)=>setState(e.target.value)}>
            <option>Andhra Pradesh</option>
          </select>

          <select value={district} onChange={(e)=>setDistrict(e.target.value)}>
            <option>Chittoor</option>
            <option>Guntur</option>
            <option>Krishna</option>
            <option>Kurnool</option>
          </select>

          <button onClick={()=>setVoiceOn(!voiceOn)}>
            <Mic /> {voiceOn ? "Voice ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* CHAT */}
      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={{
            ...styles.msg,
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            background: m.role === "user" ? "#2e7d32" : "#222",
            color: "white"
          }}>
            {m.role === "user" ? <User size={14}/> : <Bot size={14}/>}
            <span style={{marginLeft: 8}}>{m.text}</span>
          </div>
        ))}

        {loading && <p>AI thinking...</p>}
        <div ref={chatRef}></div>
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Ask about crops, price, risk..."
          style={styles.input}
        />

        <button onClick={sendMessage} style={styles.btn}>
          Send
        </button>
      </div>

    </div>
  );
}

/* STYLES */

const styles = {
  page: { fontFamily: "Arial", height: "100vh", display: "flex", flexDirection: "column" },
  header: { padding: 12, background: "#fff", borderBottom: "1px solid #ddd" },
  row: { display: "flex", gap: 10, marginTop: 8 },
  chatBox: { flex: 1, padding: 10, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 },
  msg: { padding: 10, borderRadius: 10, maxWidth: "70%", display: "flex", alignItems: "center" },
  inputBox: { display: "flex", padding: 10, borderTop: "1px solid #ddd" },
  input: { flex: 1, padding: 10 },
  btn: { marginLeft: 10, padding: "10px 15px", background: "green", color: "white", border: "none" }
};
