import { useState } from "react";
import { Link } from "react-router-dom";

export default function CopingHub() {
    const [filter, setFilter] = useState("All");

    const EXERCISES = [
        { id: "1", title: "Box Breathing", category: "Breathing", duration: "4 min", icon: "💨", desc: "Calm your nervous system simply." },
        { id: "2", title: "5-4-3-2-1", category: "Grounding", duration: "5 min", icon: "🌍", desc: "Bring your focus to the physical room." },
        { id: "3", title: "Cognitive Diffusion", category: "CBT", duration: "7 min", icon: "🧠", desc: "Step back from overwhelming thoughts." },
        { id: "4", title: "Morning Pages", category: "Journaling", duration: "10 min", icon: "✍️", desc: "Clear your mind before the day." },
    ];

    const toggleFav = (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // prevent navigation
        const favs = JSON.parse(localStorage.getItem("calmpulse-favs") || "[]");
        if (favs.includes(id)) {
            localStorage.setItem("calmpulse-favs", JSON.stringify(favs.filter((x: string) => x !== id)));
        } else {
            localStorage.setItem("calmpulse-favs", JSON.stringify([...favs, id]));
        }
        // hacky re-render trigger just for prototype
        setFilter(filter + " ");
        setTimeout(() => setFilter(filter.trim()), 0);
    };

    const favs = JSON.parse(localStorage.getItem("calmpulse-favs") || "[]");
    const completed = JSON.parse(localStorage.getItem("calmpulse-coping-done") || "[]");

    const displayed = filter === "Saved" ? EXERCISES.filter(e => favs.includes(e.id)) :
        filter === "All" ? EXERCISES :
            EXERCISES.filter(e => e.category === filter);

    return (
        <div className="page-enter" style={{ padding: "24px 0" }}>
            <header style={{ padding: "0 16px", marginBottom: "32px" }}>
                <h1 className="font-display" style={{ fontSize: "var(--text-2xl)", marginBottom: "8px" }}>Find your calm.</h1>
                <p className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Based on your check-in: 😟 Not great</p>
            </header>

            {/* Rec Strip */}
            <section style={{ marginBottom: "32px", paddingLeft: "16px" }}>
                <h3 className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>For you right now</span>
                    <span style={{ color: "var(--accent)" }}>✦</span>
                </h3>

                <div className="hide-scrollbar" style={{ display: "flex", gap: "16px", overflowX: "auto", paddingRight: "16px", paddingBottom: "8px" }}>
                    <Link to={`/coping/1`} className="card-interactable" style={{ minWidth: "160px", backgroundColor: "var(--accent-dim)" }}>
                        <div style={{ fontSize: "32px", marginBottom: "16px" }}>💨</div>
                        <h4 style={{ fontWeight: 500, fontSize: "var(--text-sm)", marginBottom: "4px" }}>Box Breathing</h4>
                        <div className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>4 min</div>
                    </Link>
                    <Link to={`/coping/3`} className="card-interactable" style={{ minWidth: "160px", backgroundColor: "var(--accent-dim)" }}>
                        <div style={{ fontSize: "32px", marginBottom: "16px" }}>🧠</div>
                        <h4 style={{ fontWeight: 500, fontSize: "var(--text-sm)", marginBottom: "4px" }}>Cognitive Diffusion</h4>
                        <div className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>7 min</div>
                    </Link>
                </div>
            </section>

            {/* Chips */}
            <div className="hide-scrollbar" style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "0 16px", marginBottom: "24px" }}>
                {["All", "Breathing", "CBT", "Grounding", "Journaling", "Saved"].map(f => (
                    <button
                        key={f} onClick={() => setFilter(f)}
                        className={`chip ${filter === f ? "active" : ""}`}
                        style={{ padding: "0 16px" }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Main Grid */}
            <div style={{ padding: "0 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", paddingBottom: "32px" }}>
                {displayed.length === 0 ? (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🤍</div>
                        <h3 className="font-display" style={{ fontSize: "var(--text-xl)", marginBottom: "8px", color: "var(--text)" }}>Nothing saved yet.</h3>
                        <p style={{ fontSize: "var(--text-sm)" }}>Heart an exercise to find it here.</p>
                    </div>
                ) : (
                    displayed.map(e => {
                        const isDone = completed.includes(e.id);
                        const isFav = favs.includes(e.id);
                        return (
                            <Link key={e.id} to={`/coping/${e.id}`} className="card-interactable" style={{ padding: "16px", display: "flex", flexDirection: "column", position: "relative" }}>
                                <button
                                    onClick={(ev) => toggleFav(ev, e.id)}
                                    style={{ position: "absolute", top: "12px", right: "12px", fontSize: "20px", color: isFav ? "var(--danger)" : "var(--text-muted)", filter: isFav ? "drop-shadow(0 0 4px rgba(224,112,112,0.4))" : "none" }}
                                >
                                    {isFav ? "♥" : "♡"}
                                </button>
                                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{e.icon}</div>
                                <h4 style={{ fontWeight: 500, fontSize: "var(--text-sm)", marginBottom: "8px", lineHeight: 1.3 }}>{e.title}</h4>
                                <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap", marginTop: "auto" }}>
                                    <span className="font-mono" style={{ backgroundColor: "var(--accent-dim)", color: "var(--accent)", padding: "2px 6px", borderRadius: "8px", fontSize: "10px" }}>{e.duration}</span>
                                    <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{e.category}</span>
                                </div>
                                {isDone && (
                                    <div className="font-mono" style={{ fontSize: "10px", color: "var(--accent)", display: "flex", alignItems: "center", gap: "4px" }}>
                                        <span>✓</span> Completed today
                                    </div>
                                )}
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
