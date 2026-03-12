import { useState } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
    const [theme, setTheme] = useState(localStorage.getItem("calmpulse-theme") || "dark");
    const [fontScale, setFontScale] = useState(localStorage.getItem("calmpulse-font-scale") || "1");
    const [clearText, setClearText] = useState("");
    const [showClear, setShowClear] = useState(false);
    const [dailyRem, setDailyRem] = useState(true);

    const anonymousId = localStorage.getItem("calmpulse-id") || "WAIT-INGG";

    const handleTheme = (t: string) => {
        setTheme(t);
        localStorage.setItem("calmpulse-theme", t);
        if (t === "light") document.documentElement.classList.add("light");
        else document.documentElement.classList.remove("light");
    };

    const handleFont = (s: string) => {
        setFontScale(s);
        localStorage.setItem("calmpulse-font-scale", s);
        document.documentElement.style.setProperty("--font-scale", s);
    };

    const handleClear = () => {
        if (clearText === "CLEAR") {
            localStorage.clear();
            window.location.href = "/";
        }
    };

    return (
        <div className="page-enter" style={{ padding: "24px 16px" }}>
            <header style={{ marginBottom: "40px" }}>
                <h1 className="font-display" style={{ fontSize: "var(--text-2xl)" }}>You.</h1>
            </header>

            {/* Identity */}
            <section style={{ marginBottom: "40px" }}>
                <div className="card-base" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <h3 className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase" }}>Your anonymous ID</h3>
                    <div className="font-mono" style={{ fontSize: "var(--text-xl)", color: "var(--accent)" }}>{anonymousId}</div>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Local to this device only.</p>
                </div>
            </section>

            {/* Milestones */}
            <section style={{ marginBottom: "40px" }}>
                <h3 className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Your milestones</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    <div className="card-base" style={{ textAlign: "center", padding: "16px 8px" }}>
                        <div style={{ fontSize: "32px", marginBottom: "8px" }}>🌱</div>
                        <div style={{ fontSize: "var(--text-xs)", fontWeight: 500, marginBottom: "4px" }}>First step</div>
                        <div className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>Mar 1</div>
                    </div>
                    <div className="card-base" style={{ textAlign: "center", padding: "16px 8px", borderColor: "var(--accent)" }}>
                        <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔥</div>
                        <div style={{ fontSize: "var(--text-xs)", fontWeight: 500, marginBottom: "4px" }}>7 Day Streak</div>
                        <div className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>Mar 8</div>
                    </div>
                    <div className="card-base" style={{ textAlign: "center", padding: "16px 8px", opacity: 0.5 }}>
                        <div style={{ fontSize: "32px", marginBottom: "8px", filter: "grayscale(100%)" }}>🔒</div>
                        <div style={{ fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-muted)" }}>Coping Explorer</div>
                        <div className="font-mono" style={{ fontSize: "10px", color: "var(--border)", marginTop: "4px" }}>Locked</div>
                    </div>
                </div>
            </section>

            {/* Appearance */}
            <section style={{ marginBottom: "40px" }}>
                <h3 className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Appearance</h3>
                <div className="card-base" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Theme</span>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handleTheme("dark")} className={`chip ${theme === "dark" ? "active" : ""}`} style={{ borderRadius: "12px", border: theme === "dark" ? "none" : "1px solid var(--border)" }}>Dark</button>
                            <button onClick={() => handleTheme("light")} className={`chip ${theme === "light" ? "active" : ""}`} style={{ borderRadius: "12px", border: theme === "light" ? "none" : "1px solid var(--border)" }}>Light</button>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Font size</span>
                        <div style={{ display: "flex", gap: "8px" }}>
                            {["0.9", "1", "1.15"].map(s => (
                                <button key={s} onClick={() => handleFont(s)} className={`chip ${fontScale === s ? "active" : ""}`} style={{ borderRadius: "12px", width: "40px", border: fontScale === s ? "none" : "1px solid var(--border)" }}>
                                    {s === "0.9" ? "S" : s === "1" ? "M" : "L"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Reminders */}
            <section style={{ marginBottom: "40px" }}>
                <h3 className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Reminders</h3>
                <div className="card-base" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <button style={{ color: "var(--danger)", textAlign: "left", fontSize: "var(--text-sm)", fontWeight: 500 }} onClick={() => setDailyRem(false)}>
                        Silence everything
                    </button>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
                        <div>
                            <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginBottom: "4px" }}>Daily Check-in</div>
                            <div className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>20:00 every day</div>
                        </div>

                        <div
                            onClick={() => setDailyRem(!dailyRem)}
                            style={{ width: "44px", height: "24px", borderRadius: "12px", backgroundColor: dailyRem ? "var(--accent)" : "var(--border)", position: "relative", cursor: "pointer", transition: "all 0.2s" }}
                        >
                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#fff", position: "absolute", top: "2px", left: dailyRem ? "22px" : "2px", transition: "all 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Data */}
            <section style={{ marginBottom: "40px" }}>
                <h3 className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Data & Privacy</h3>
                <div className="card-base" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <button className="btn-text" style={{ textAlign: "left", fontSize: "var(--text-sm)" }}>Export data →</button>
                    <button className="btn-text" style={{ textAlign: "left", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Restore backup →</button>
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
                        {!showClear ? (
                            <button
                                className="btn-text" style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}
                                onClick={() => setShowClear(true)}
                            >
                                Clear all data
                            </button>
                        ) : (
                            <div>
                                <p style={{ color: "var(--danger)", fontSize: "var(--text-xs)", marginBottom: "8px" }}>Type "CLEAR" to proceed.</p>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <input type="text" value={clearText} onChange={e => setClearText(e.target.value)} style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--danger)", backgroundColor: "transparent", color: "var(--text)", fontFamily: "inherit" }} />
                                    <button onClick={handleClear} disabled={clearText !== "CLEAR"} style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: clearText === "CLEAR" ? "var(--danger)" : "var(--surface)", color: clearText === "CLEAR" ? "#000" : "var(--text-muted)", fontWeight: "bold", fontSize: "var(--text-sm)" }}>
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section style={{ textAlign: "center", marginBottom: "40px" }}>
                <div className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)", margin: "16px 0" }}>CalmPulse v2.0.0</div>
                <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                    <span className="btn-text" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", cursor: "pointer" }}>What's new</span>
                    <span className="btn-text" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", cursor: "pointer" }}>Privacy Policy</span>
                </div>
            </section>
        </div>
    );
}
