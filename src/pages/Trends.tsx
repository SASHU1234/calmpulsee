import { useState, useEffect } from "react";
import { detectPattern } from "../services/ai";
import BackButton from "../components/BackButton";
import { useNavigationContext } from "../components/NavigationProvider";

export default function Trends() {
    const { previousScreenName } = useNavigationContext();
    const [range, setRange] = useState("30D");
    const [logs, setLogs] = useState<any[]>([]);
    const [insight, setInsight] = useState("");

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("calmpulse-logs") || "[]");
        setLogs(data);

        if (data.length > 0) {
            detectPattern(data).then(res => setInsight(res.insight));
        }
    }, []);

    const RANGES = ["7D", "30D", "90D", "All"];

    if (logs.length === 0) {
        return (
            <div className="page-enter" style={{ padding: "8px 16px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", textAlign: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 16, left: 16 }}><BackButton label={previousScreenName} /></div>
                <div style={{ fontSize: "48px", marginBottom: "16px", color: "var(--text-muted)" }}>📈</div>
                <h1 className="font-display" style={{ fontSize: "var(--text-xl)", marginBottom: "8px" }}>Your story starts here.</h1>
                <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>Log your first mood to start seeing patterns.</p>
            </div>
        );
    }

    return (
        <div className="page-enter" style={{ padding: "8px 0 24px" }}>
            <div style={{ padding: "0 16px" }}><BackButton label={previousScreenName} /></div>
            <header style={{ padding: "0 16px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: "var(--text-2xl)", marginBottom: "4px" }}>Your story.</h1>
                    <p className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase" }}>Last {range.toLowerCase()}</p>
                </div>
            </header>

            {/* Range Switcher */}
            <div style={{ display: "flex", backgroundColor: "var(--card)", borderRadius: "24px", padding: "4px", margin: "0 16px 32px", border: "1px solid var(--border)" }}>
                {RANGES.map(r => (
                    <button
                        key={r} onClick={() => setRange(r)}
                        className="font-mono"
                        style={{
                            flex: 1, padding: "8px 0", borderRadius: "20px", fontWeight: "bold", fontSize: "12px",
                            backgroundColor: range === r ? "var(--accent)" : "transparent",
                            color: range === r ? "#000" : "var(--text-muted)",
                            transition: "all var(--duration-fast)"
                        }}
                    >
                        {r}
                    </button>
                ))}
            </div>

            {/* Mood Chart (Mock) */}
            <section style={{ marginBottom: "40px", position: "relative" }}>
                <div style={{ display: "flex", padding: "0 16px", height: "200px" }}>
                    {/* Y-Axis */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: "16px", borderRight: "1px solid var(--border)" }}>
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>😊</span>
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>🙂</span>
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>😐</span>
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>😟</span>
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>😔</span>
                    </div>

                    {/* Chart Area */}
                    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ position: "absolute" }}>
                            <defs>
                                <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0,80 Q25,40 50,60 T100,20 L100,100 L0,100 Z" fill="url(#chart-fill)" />
                            <path d="M0,80 Q25,40 50,60 T100,20" fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />

                            {/* Points */}
                            <circle cx="25" cy="50" r="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                            <circle cx="50" cy="60" r="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                            <circle cx="75" cy="40" r="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                            <circle cx="100" cy="20" r="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </div>
                </div>
                {/* X-Axis */}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 16px 0 40px" }}>
                    <span className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>Mar 1</span>
                    <span className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>Mar 12</span>
                </div>
            </section>

            {/* Stats row */}
            <section style={{ padding: "0 16px", marginBottom: "40px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    <div className="card-base" style={{ textAlign: "center", padding: "16px 8px" }}>
                        <div className="font-mono" style={{ fontSize: "var(--text-2xl)", color: "var(--accent)", marginBottom: "4px" }}>3.8</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Avg Mood</div>
                    </div>
                    <div className="card-base" style={{ textAlign: "center", padding: "16px 8px" }}>
                        <div className="font-mono" style={{ fontSize: "var(--text-2xl)", color: "var(--accent)", marginBottom: "4px" }}>6</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Streak</div>
                    </div>
                    <div className="card-base" style={{ textAlign: "center", padding: "16px 8px" }}>
                        <div className="font-mono" style={{ fontSize: "var(--text-2xl)", color: "var(--accent)", marginBottom: "4px" }}>2</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Assmnts</div>
                    </div>
                </div>
            </section>

            {/* Notable days */}
            <section style={{ padding: "0 16px", marginBottom: "40px" }}>
                <h3 className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Notable days</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div className="card-base" style={{ display: "flex", padding: "16px", gap: "16px", alignItems: "center" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--danger)", flexShrink: 0 }} />
                        <div className="font-mono" style={{ fontSize: "12px", width: "48px" }}>Mar 8</div>
                        <div style={{ fontSize: "20px", width: "24px" }}>😔</div>
                        <div style={{ fontSize: "var(--text-sm)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Felt exhausted all day</div>
                    </div>
                    <div className="card-base" style={{ display: "flex", padding: "16px", gap: "16px", alignItems: "center" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0 }} />
                        <div className="font-mono" style={{ fontSize: "12px", width: "48px" }}>Mar 10</div>
                        <div style={{ fontSize: "20px", width: "24px" }}>😊</div>
                        <div style={{ fontSize: "var(--text-sm)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Finished the project early</div>
                    </div>
                </div>
            </section>

            {/* Tags breakdown */}
            <section style={{ padding: "0 16px", marginBottom: "40px" }}>
                <h3 className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>What's been on your mind</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[{ t: "Academics", p: 75, c: 12 }, { t: "Sleep", p: 50, c: 8 }, { t: "Family", p: 25, c: 4 }].map(tag => (
                        <div key={tag.t} style={{ position: "relative", height: "40px", display: "flex", alignItems: "center", padding: "0 12px", borderRadius: "8px", overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${tag.p}%`, backgroundColor: "var(--accent)", opacity: 0.06, borderRadius: "8px" }} />
                            <div style={{ fontSize: "var(--text-sm)", flex: 1, zIndex: 1 }}>{tag.t}</div>
                            <div className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", zIndex: 1 }}>{tag.c}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* AI Insight */}
            <section style={{ padding: "0 16px" }}>
                <div className="card-base" style={{ borderStyle: "dashed", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ color: "var(--accent)", fontSize: "16px", marginTop: "2px" }}>✦</div>
                    <div>
                        <div className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>AI insight</div>
                        <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text)" }}>
                            {insight || "You tend to feel more anxious on days marked 'Academics'. Consider trying Box Breathing before study sessions."}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
