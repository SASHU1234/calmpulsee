import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function CopingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [timer, setTimer] = useState(240); // 4 min default
    const [running, setRunning] = useState(false);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        let interval: any;
        if (running && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0 && running) {
            setRunning(false);
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [running, timer]);

    useEffect(() => {
        const done = JSON.parse(localStorage.getItem("calmpulse-coping-done") || "[]");
        if (done.includes(id)) setComplete(true);
    }, [id]);

    const handleComplete = () => {
        setComplete(true);
        const done = JSON.parse(localStorage.getItem("calmpulse-coping-done") || "[]");
        if (!done.includes(id)) {
            localStorage.setItem("calmpulse-coping-done", JSON.stringify([...done, id]));
        }
    };

    const steps = [
        "Breathe in slowly to a count of four.",
        "Hold your breath to a count of four.",
        "Breathe out slowly to a count of four.",
        "Hold your breath again to a count of four.",
        "Repeat this cycle."
    ];

    return (
        <div className="page-enter" style={{ padding: "8px 16px 24px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <BackButton label="Coping Hub" onBack={() => navigate("/app/coping")} />

            <header style={{ marginTop: "16px", marginBottom: "32px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ fontSize: "48px" }}>💨</div>
                <div>
                    <h1 className="font-display" style={{ fontSize: "var(--text-xl)", marginBottom: "8px" }}>Box Breathing</h1>
                    <div style={{ display: "flex", gap: "6px" }}>
                        <span className="font-mono" style={{ backgroundColor: "var(--accent-dim)", color: "var(--accent)", padding: "2px 8px", borderRadius: "12px", fontSize: "12px" }}>4 min</span>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", padding: "2px 0" }}>Breathing</span>
                    </div>
                </div>
            </header>

            <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "24px" }}>
                {steps.map((s, i) => (
                    <div key={i} className="card-base" style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px" }}>
                        <div className="font-mono" style={{ fontSize: "var(--text-lg)", color: "var(--accent)", width: "24px", textAlign: "center", fontWeight: "bold" }}>{i + 1}</div>
                        <p style={{ fontSize: "var(--text-base)", color: "var(--text)", lineHeight: 1.5 }}>{s}</p>
                    </div>
                ))}

                {/* Timer Section */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "32px 0" }}>
                    <div style={{ position: "relative", width: "160px", height: "160px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <svg width="160" height="160" viewBox="0 0 160 160" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
                            <circle cx="80" cy="80" r="76" fill="none" stroke="var(--border)" strokeWidth="4" />
                            <circle cx="80" cy="80" r="76" fill="none" stroke="var(--accent)" strokeWidth="4" strokeDasharray="477.5" strokeDashoffset={477.5 - (477.5 * (timer / 240))} style={{ transition: "stroke-dashoffset 1s linear" }} />
                        </svg>
                        <div className="font-mono" style={{ fontSize: "var(--text-3xl)", color: "var(--accent)" }}>
                            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                        <button
                            onClick={() => setRunning(!running)}
                            style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: running ? "var(--warning)" : "var(--accent)", color: "#000", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}
                        >
                            {running ? "⏸︎" : "▶︎"}
                        </button>
                        <button
                            onClick={() => { setRunning(false); setTimer(240); }}
                            style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}
                        >
                            ⟳
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <button
                    className="btn-primary"
                    disabled={complete}
                    onClick={handleComplete}
                    style={{ backgroundColor: complete ? "var(--accent-dim)" : "var(--accent)", color: complete ? "var(--accent)" : "#000" }}
                >
                    {complete ? "Done today ✓" : "Mark complete"}
                </button>
                <button className="btn-text" style={{ color: "var(--text-muted)" }} onClick={() => navigate("/app/coping")}>Cancel</button>
            </div>
        </div>
    );
}
