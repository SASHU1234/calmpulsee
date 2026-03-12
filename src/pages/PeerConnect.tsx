import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { matchPeers } from "../services/ai";

export default function PeerConnect() {
    const [optedIn, setOptedIn] = useState(localStorage.getItem("calmpulse-peer-optin") === "true");
    const [matching, setMatching] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [peers, setPeers] = useState<any[]>([]);

    const TAGS = ["Academics", "Anxiety", "Loneliness", "Family Issues", "Burnout", "Relationships", "Career Stress"];

    useEffect(() => {
        if (optedIn && localStorage.getItem("calmpulse-peer-tags")) {
            setTags(JSON.parse(localStorage.getItem("calmpulse-peer-tags") || "[]"));
            setPeers([{ id: "9X2F", alias: "Student", tags: ["Academics"], lastMsg: "How are you studying?", time: "12:00", active: true }]);
        }
    }, [optedIn]);

    const toggleTag = (t: string) => {
        if (tags.includes(t)) setTags(tags.filter(x => x !== t));
        else setTags([...tags, t]);
    };

    const handleMatch = async () => {
        setMatching(true);
        localStorage.setItem("calmpulse-peer-tags", JSON.stringify(tags));
        await matchPeers(tags);
        setTimeout(() => {
            setMatching(false);
            setPeers([
                { id: "3A9R", alias: "Student", tags: tags.slice(0, 1), lastMsg: "Hey, are you around?", time: "Just now", active: true },
                { id: "7L2P", alias: "Student", tags: ["Burnout"], lastMsg: "I get that totally.", time: "Yesterday", active: false }
            ]);
        }, 1500);
    };

    if (!optedIn) {
        return (
            <div className="page-enter" style={{ padding: "40px 24px", minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h1 className="font-display" style={{ fontSize: "var(--text-2xl)", marginBottom: "40px" }}>You're not alone.</h1>
                <div className="card-interactable" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 500 }}>Anonymous peer support</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "var(--text-sm)" }}>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <span style={{ color: "var(--accent)" }}>✓</span><span>No names or photos. Only your shared tags.</span>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <span style={{ color: "var(--accent)" }}>✓</span><span>Leave a chat anytime.</span>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <span style={{ color: "var(--accent)" }}>✓</span><span>Zero tolerance for harassment.</span>
                        </div>
                    </div>

                    <div style={{ marginTop: "16px", paddingTop: "24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 500 }}>Opt-in to Connect</span>
                        <div
                            onClick={() => {
                                localStorage.setItem("calmpulse-peer-optin", "true");
                                setOptedIn(true);
                            }}
                            style={{
                                width: "56px", height: "32px", borderRadius: "16px", backgroundColor: "var(--border)",
                                position: "relative", cursor: "pointer", transition: "all var(--duration-fast)"
                            }}
                        >
                            <div style={{
                                width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--text)",
                                position: "absolute", top: "4px", left: "4px", transition: "all var(--duration-fast)"
                            }} />
                        </div>
                    </div>
                    <p style={{ fontSize: "10px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                        Matching is based only on what you're going through. Never on who you are.
                    </p>
                </div>
            </div>
        );
    }

    if (tags.length === 0 || matching) {
        return (
            <div className="page-enter" style={{ padding: "24px 16px" }}>
                <h1 className="font-display" style={{ fontSize: "var(--text-2xl)", marginBottom: "32px" }}>You're not alone.</h1>
                <div className="card-interactable" style={{ padding: "24px" }}>
                    {matching ? (
                        <div style={{ height: "200px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "24px" }}>
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--accent)", animation: "pulse-danger 1s infinite alternate" }} />
                            <p className="font-mono" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Finding your people...</p>
                        </div>
                    ) : (
                        <div className="page-enter">
                            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 500, marginBottom: "24px" }}>What are you going through?</h2>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
                                {TAGS.map(t => (
                                    <button key={t} onClick={() => toggleTag(t)} className={`chip ${tags.includes(t) ? "active" : ""}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <div style={{ marginBottom: "24px" }} />
                            {tags.length > 0 && (
                                <button className="btn-primary page-enter" onClick={handleMatch}>Find my peers</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="page-enter" style={{ padding: "24px 16px" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
                <h1 className="font-display" style={{ fontSize: "var(--text-2xl)", marginBottom: "4px" }}>You're not alone.</h1>
            </header>

            <p className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
                Matched with {peers.length} students
            </p>

            {peers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                    <div style={{ fontSize: "40px", marginBottom: "16px" }}>👥</div>
                    <h3 className="font-display" style={{ fontSize: "var(--text-xl)", marginBottom: "8px", color: "var(--text)" }}>Finding your people.</h3>
                    <p style={{ fontSize: "var(--text-sm)" }}>Check back in a moment.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {peers.map((p) => (
                        <Link key={p.id} to={`/chat/${p.id}`} className="card-interactable" style={{ display: "flex", gap: "16px", padding: "16px", alignItems: "center", position: "relative", borderLeft: p.active ? "3px solid var(--accent)" : "1px solid var(--border)" }}>
                            {p.active && <div style={{ position: "absolute", top: "12px", right: "12px", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--accent)" }} />}
                            <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "var(--border)", flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center", opacity: p.active ? 1 : 0.5 }}>
                                <span className="font-mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>{p.alias[0]}{p.id[0]}</span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                    <h3 className="font-mono" style={{ fontSize: "var(--text-sm)", fontWeight: "bold" }}>{p.alias}_{p.id}</h3>
                                    <span className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>{p.time}</span>
                                </div>
                                <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                                    {p.tags.map((t: string) => <span key={t} style={{ fontSize: "10px", backgroundColor: "var(--bg)", border: "1px solid var(--border)", padding: "2px 6px", borderRadius: "8px", color: "var(--text-muted)" }}>{t}</span>)}
                                </div>
                                <p style={{ fontSize: "var(--text-xs)", color: p.active ? "var(--text)" : "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.lastMsg}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <button className="btn-outlined" onClick={() => setTags([])} style={{ marginTop: "32px", fontSize: "14px", height: "40px" }}>Change tags</button>
        </div>
    );
}
