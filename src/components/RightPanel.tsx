import { useLocation } from "react-router-dom";

export default function RightPanel() {
    const location = useLocation();
    const path = location.pathname;

    const panels: Record<string, React.ReactNode> = {
        "/app/home": (
            <>
                <PanelCard title="This week">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].slice(0, 6).map((d, i) => (
                            <div key={d} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)", width: "28px" }}>{d}</span>
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: i > 2 ? "var(--warning)" : "var(--border)" }} />
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="font-mono" style={{ fontSize: "var(--text-xl)", color: "var(--accent)", fontWeight: "bold" }}>6</span>
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>day streak</span>
                    </div>
                </PanelCard>
                <PanelCard title="Tip">
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.7, marginTop: "8px" }}>
                        Consistent check-ins are more valuable than perfect ones. Even 30 seconds counts.
                    </p>
                </PanelCard>
            </>
        ),
        "/app/log": (
            <PanelCard title="Why journaling helps">
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.7, marginTop: "8px" }}>
                    Writing helps you process emotions before they become overwhelming. Even a few words can shift your perspective.
                </p>
                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "var(--surface)", borderRadius: "10px" }}>
                    <p className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                        "The act of naming an emotion reduces its power to control you."
                    </p>
                </div>
            </PanelCard>
        ),
        "/app/coping": (
            <PanelCard title="Recently used">
                {[["🌬️", "4-7-8 Breathing", "2h ago"], ["📓", "Morning Pages", "Yesterday"]].map(([icon, name, time]) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ fontSize: "18px" }}>{icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "var(--text-xs)", fontWeight: 500 }}>{name}</div>
                            <div className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>{time}</div>
                        </div>
                    </div>
                ))}
            </PanelCard>
        ),
        "/app/trends": (
            <PanelCard title="AI Insight">
                <p style={{ fontSize: "var(--text-xs)", color: "var(--accent)", fontWeight: 500, marginTop: "8px" }}>
                    Pattern detected
                </p>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.7, marginTop: "6px" }}>
                    Your mood tends to dip mid-week. Consider scheduling a coping exercise on Wednesday evenings.
                </p>
            </PanelCard>
        ),
        "/app/connect": (
            <PanelCard title="Your privacy">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                    {["You appear as a random alias", "No real name or photo shared", "You control when to disconnect"].map(item => (
                        <div key={item} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                            <span style={{ color: "var(--accent)", fontSize: "12px", marginTop: "1px" }}>✓</span>
                            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.5 }}>{item}</span>
                        </div>
                    ))}
                </div>
            </PanelCard>
        ),
        "/app/you": (
            <PanelCard title="Data summary">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                    {[["Total logs", "42"], ["Streak", "6 days"], ["Assessments", "3"]].map(([label, val]) => (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{label}</span>
                            <span className="font-mono" style={{ fontSize: "var(--text-sm)", color: "var(--accent)", fontWeight: "bold" }}>{val}</span>
                        </div>
                    ))}
                </div>
            </PanelCard>
        )
    };

    // Match by prefix
    const key = Object.keys(panels).find(k => path.startsWith(k));
    const content = key ? panels[key] : null;

    if (!content) return null;
    return <div className="app-right-panel">{content}</div>;
}

function PanelCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "16px"
        }}>
            <div className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {title}
            </div>
            {children}
        </div>
    );
}
