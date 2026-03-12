import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [theme, setTheme] = useState(localStorage.getItem("calmpulse-theme") || "dark");
    const [lastEntry, setLastEntry] = useState<any>(null);

    useEffect(() => {
        const logs = JSON.parse(localStorage.getItem("calmpulse-logs") || "[]");
        if (logs.length > 0) setLastEntry(logs[0]);
    }, []);

    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        localStorage.setItem("calmpulse-theme", next);

        // Update DOM instantly so state syncs with global app setting
        if (next === "light") document.documentElement.classList.add("light");
        else document.documentElement.classList.remove("light");
    };

    const hr = new Date().getHours();
    const greeting = hr < 12 ? "Good morning." : hr < 17 ? "Good afternoon." : hr < 22 ? "Good evening." : "Hey, it's late.";

    const hasCheckedInToday = lastEntry && new Date(lastEntry.date).toDateString() === new Date().toDateString();

    return (
        <div className="page-enter" style={{ padding: "24px 16px" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <h1 className="font-display" style={{ fontSize: "var(--text-md)", color: "var(--text)" }}>CalmPulse</h1>
                </Link>
                <button onClick={toggleTheme} style={{ color: "var(--text-muted)", fontSize: "20px" }}>
                    {theme === "dark" ? "☀️" : "🌙"}
                </button>
            </header>

            <section style={{ marginBottom: "40px" }}>
                <h2 className="font-display" style={{ fontSize: "var(--text-2xl)", marginBottom: "8px" }}>{greeting}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                    <span className="font-mono" style={{ color: "var(--accent)", fontWeight: "bold" }}>6</span> days in a row · Keep going
                </div>
            </section>

            {/* Today Check-in Card */}
            <section style={{ marginBottom: "40px" }}>
                <div className="card-interactable" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderStyle: hasCheckedInToday ? "solid" : "dashed" }}>
                    {hasCheckedInToday ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <span style={{ fontSize: "48px" }}>{lastEntry.emoji}</span>
                            <div>
                                <h3 className="font-display" style={{ fontSize: "var(--text-lg)", marginBottom: "4px" }}>{lastEntry.label}</h3>
                                <div className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Logged at {new Date(lastEntry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 style={{ fontSize: "var(--text-md)", marginBottom: "4px" }}>No check-in yet today</h3>
                            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Takes 30 seconds.</p>
                        </div>
                    )}

                    <Link to="/app/log">
                        <button className="btn-text" style={{ fontSize: "var(--text-sm)" }}>
                            {hasCheckedInToday ? "Edit" : "Log now"}
                        </button>
                    </Link>
                </div>
            </section>

            {/* Weekly Mood Strip */}
            <section style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between" }}>
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "36px" }}>
                        <span className="font-mono" style={{ fontSize: "var(--text-xs)", color: i === 6 ? "var(--text)" : "var(--text-muted)" }}>{d}</span>
                        <div style={{
                            width: "12px", height: "12px", borderRadius: "50%",
                            backgroundColor: i === 6 ? "transparent" : i > 2 ? "var(--warning)" : "var(--border)",
                            border: i === 6 ? "2px solid var(--accent)" : "none"
                        }} />
                    </div>
                ))}
            </section>

            {/* Quick Actions */}
            <section style={{ marginBottom: "40px" }}>
                <h3 className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Quick actions</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Link to="/app/assessment" className="card-interactable" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <span style={{ fontSize: "24px", color: "var(--accent)" }}>📋</span>
                        <span style={{ fontWeight: 500, fontSize: "var(--text-sm)" }}>Assessment</span>
                    </Link>
                    <Link to="/app/coping" className="card-interactable" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <span style={{ fontSize: "24px", color: "var(--accent)" }}>🧘</span>
                        <span style={{ fontWeight: 500, fontSize: "var(--text-sm)" }}>Coping Hub</span>
                    </Link>
                    <Link to="/app/trends" className="card-interactable" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <span style={{ fontSize: "24px", color: "var(--accent)" }}>📈</span>
                        <span style={{ fontWeight: 500, fontSize: "var(--text-sm)" }}>My Trends</span>
                    </Link>
                    <Link to="/app/connect" className="card-interactable" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <span style={{ fontSize: "24px", color: "var(--accent)" }}>👥</span>
                        <span style={{ fontWeight: 500, fontSize: "var(--text-sm)" }}>Peer Connect</span>
                    </Link>
                </div>
            </section>

            {/* Last Entry */}
            {lastEntry && (
                <section>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Last entry</h3>
                    </div>
                    <div className="card-base" style={{ padding: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <span className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                                {new Date(lastEntry.date).toLocaleDateString([], { month: "short", day: "numeric" })}
                            </span>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <span>{lastEntry.emoji}</span>
                                {lastEntry.tags?.slice(0, 1).map((t: string) => <span key={t} className="chip" style={{ height: "24px", fontSize: "10px" }}>{t}</span>)}
                            </div>
                        </div>
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--text)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "16px" }}>
                            {lastEntry.journal || "No journal added for this entry. Kept it simple."}
                        </p>
                        <Link to="/app/trends" className="btn-text" style={{ fontSize: "var(--text-xs)" }}>View all entries →</Link>
                    </div>
                </section>
            )}
        </div>
    );
}
