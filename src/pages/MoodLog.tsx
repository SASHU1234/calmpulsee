import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeEntry } from "../services/ai";
import BackButton from "../components/BackButton";
import { useAuth } from "../components/AuthProvider";
import { saveLog } from "../services/db";
import { useLogs } from "../components/LogsProvider";

export default function MoodLog() {
    const navigate = useNavigate();
    const { session } = useAuth();
    const { refreshLogs } = useLogs();
    const [mood, setMood] = useState<{ label: string, emoji: string, color: string } | null>(null);
    const [intensity, setIntensity] = useState(5);
    const [tags, setTags] = useState<string[]>([]);
    const [journal, setJournal] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const MOCK_MOODS = [
        { label: "Really low", emoji: "😔", color: "var(--danger)" },
        { label: "Not great", emoji: "😟", color: "var(--warning)" },
        { label: "Okay", emoji: "😐", color: "#8888AA" },
        { label: "Pretty good", emoji: "🙂", color: "#88AA88" },
        { label: "Really good", emoji: "😊", color: "var(--accent)" },
    ];

    const TAGS = ["Academics", "Sleep", "Relationships", "Family", "Work", "Health", "Loneliness", "Other"];

    const handleSave = async () => {
        setSaving(true);
        const result = await analyzeEntry(journal); // call AI stub

        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            label: mood!.label,
            emoji: mood!.emoji,
            score: MOCK_MOODS.findIndex(m => m.label === mood!.label) + 1,
            intensity,
            tags,
            journal,
            aiAnalysis: result
        };

        if (session?.userId) {
            await saveLog(session.userId, entry);
            await refreshLogs();
        } else {
            console.error("No active user session to save log");
        }

        setSaving(false);
        setSaved(true);

        setTimeout(() => {
            navigate("/app/home");
        }, 2500);
    };

    const toggleTag = (t: string) => {
        if (tags.includes(t)) setTags(tags.filter(x => x !== t));
        else setTags([...tags, t]);
    };

    if (saved) {
        return (
            <div className="page-enter" style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "var(--bg)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, margin: "auto", maxWidth: "390px" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>{mood?.emoji}</div>
                <h1 className="font-display" style={{ fontSize: "var(--text-xl)", marginBottom: "8px" }}>{mood?.label}</h1>
                <div className="font-mono" style={{ color: "var(--accent)", fontSize: "var(--text-sm)", marginBottom: "16px" }}>Saved</div>
                <div className="font-mono" style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "32px" }}>
                    {new Date().toLocaleDateString()} · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>See you tomorrow.</p>

                <button className="btn-text" onClick={() => navigate("/home")} style={{ marginTop: "40px" }}>Dismiss</button>
            </div>
        );
    }

    return (
        <div className="page-enter" style={{ padding: "24px 16px", position: "relative" }}>
            <div style={{ marginBottom: "24px" }}>
                <BackButton fallback="/app/home" />
            </div>

            <header style={{ marginBottom: "32px" }}>
                <div className="font-mono" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "8px" }}>
                    {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <h1 className="font-display" style={{ fontSize: "var(--text-xl)" }}>How are you right now?</h1>
            </header>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                {MOCK_MOODS.map((m) => {
                    const isSelected = mood?.label === m.label;
                    return (
                        <button
                            key={m.label}
                            onClick={() => setMood(m)}
                            style={{
                                width: "100%", height: "56px", borderRadius: "12px", padding: "0 16px",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                backgroundColor: isSelected ? "var(--accent-dim)" : "var(--card)",
                                border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                                transform: isSelected ? "scale(1.02)" : "scale(1)",
                                transition: "all var(--duration-fast) var(--ease-out)"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <span style={{ fontSize: "24px" }}>{m.emoji}</span>
                                <span style={{ fontWeight: 500, fontSize: "var(--text-base)", color: "var(--text)" }}>{m.label}</span>
                            </div>
                            <div style={{
                                width: "20px", height: "20px", borderRadius: "50%",
                                border: isSelected ? "none" : "1.5px solid var(--border)",
                                backgroundColor: isSelected ? "var(--accent)" : "transparent",
                                display: "flex", justifyContent: "center", alignItems: "center"
                            }}>
                                {isSelected && <span style={{ color: "#000", fontSize: "12px", fontWeight: "bold" }}>✓</span>}
                            </div>
                        </button>
                    );
                })}
            </div>

            {mood && (
                <div className="page-enter" style={{ marginBottom: "32px" }}>
                    <label className="font-mono" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", display: "block", marginBottom: "16px" }}>How intense is this feeling?</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <input
                            type="range" min="1" max="10" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))}
                            style={{ flex: 1, accentColor: mood.color, height: "4px", backgroundColor: "var(--border)", appearance: "none", borderRadius: "2px" }}
                        />
                        <span className="font-mono" style={{ fontSize: "var(--text-md)", color: mood.color, minWidth: "24px", textAlign: "right" }}>{intensity}</span>
                    </div>

                    <style>{`
            input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: var(--card);
              border: 2px solid ${mood.color};
              cursor: pointer;
            }
          `}</style>
                </div>
            )}

            {mood && (
                <div className="page-enter" style={{ marginBottom: "32px" }}>
                    <label className="font-mono" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", display: "block", marginBottom: "16px" }}>What's going on?</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {TAGS.map(t => (
                            <button
                                key={t} onClick={() => toggleTag(t)}
                                className={`chip ${tags.includes(t) ? "active" : ""}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {tags.length > 0 && mood && (
                <div className="page-enter" style={{ marginBottom: "32px" }}>
                    <label className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", display: "block", marginBottom: "12px" }}>Anything you want to add?</label>
                    <div style={{ position: "relative" }}>
                        <textarea
                            value={journal} onChange={e => setJournal(e.target.value)}
                            placeholder="Write freely. This stays here."
                            style={{
                                width: "100%", minHeight: "100px", backgroundColor: "transparent",
                                border: "none", borderBottom: "2px solid var(--border)", padding: "8px 0",
                                color: "var(--text)", fontFamily: "inherit", fontSize: "var(--text-base)",
                                resize: "none", transition: "border-color var(--duration-fast)", outline: "none"
                            }}
                            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                        />
                        <div className="font-mono" style={{ position: "absolute", bottom: "8px", right: "8px", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                            {journal.length}
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                        <button className="btn-text" style={{ fontSize: "var(--text-xs)", display: "flex", alignItems: "center", gap: "4px" }}>
                            <span className="font-mono">📷</span> Add photo
                        </button>
                    </div>
                </div>
            )}

            <button className="btn-primary" disabled={!mood || saving} onClick={handleSave}>
                {saving ? "Saving..." : "Save entry"}
            </button>
        </div>
    );
}
