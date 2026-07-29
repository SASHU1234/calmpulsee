import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { generatePassphrase, savePassphrase } from "../utils/passphrase";
import { useAuth } from "../components/AuthProvider";

// ─── Main Onboarding ─────────────────────────────────────────────
export default function Onboarding() {
    const navigate = useNavigate();
    const { session } = useAuth();
    // Steps: 0=consent, 1=mood, 2=needs
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // Mood/needs state
    const [mood, setMood] = useState<number | null>(null);
    const [needs, setNeeds] = useState<string[]>([]);

    // Ensure we have the user's passphrase if they are anonymous
    useEffect(() => {
        if (!session?.passphrase) {
            const existing = localStorage.getItem("calmpulse-passphrase");
            if (!existing) {
                const phrase = generatePassphrase();
                savePassphrase(phrase);
            }
        }
    }, [session]);

    const handleComplete = async () => {
        setLoading(true);
        // If not already an anon session and user chose anon, it would be created here,
        // but since login now handles auth, they should already be authenticated.
        localStorage.setItem("calmpulse-onboarded", "true");
        navigate("/app/home");
    };

    const MOCK_MOODS = [
        { label: "Really low", emoji: "😔", color: "var(--danger)" },
        { label: "Not great", emoji: "😟", color: "var(--warning)" },
        { label: "Okay", emoji: "😐", color: "#8888AA" },
        { label: "Pretty good", emoji: "🙂", color: "#88AA88" },
        { label: "Really good", emoji: "😊", color: "var(--accent)" },
    ];

    const toggleNeed = (n: string) => {
        if (needs.includes(n)) setNeeds(needs.filter(x => x !== n));
        else if (needs.length < 2) setNeeds([...needs, n]);
    };

    // Step count for progress dots (steps 1-2 map to dots 1-2)
    const totalDots = 2;
    const dotStep = step; // step 0 = no dots, steps 1-2 = dots

    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "var(--bg)" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "var(--accent)", animation: "pulse 0.8s infinite ease-in-out" }} />
            </div>
        );
    }

    return (
        <div
            className="page-enter"
            style={{ padding: "40px 24px", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg)", position: "relative" }}
        >
            {/* Back button — shown on steps 1+ */}
            {step > 0 && (
                <div style={{ position: "absolute", top: 16, left: 16 }}>
                    <BackButton onBack={() => setStep(step - 1)} />
                </div>
            )}

            {/* Progress dots — steps 1-4 */}
            {step > 0 && (
                <div style={{ display: "flex", gap: "8px", marginBottom: "40px", justifyContent: "center" }}>
                    {Array.from({ length: totalDots }, (_, i) => i + 1).map(s => (
                        <div key={s} style={{
                            height: "6px",
                            width: s === dotStep ? "16px" : "6px",
                            borderRadius: "3px",
                            backgroundColor: s <= dotStep ? "var(--accent)" : "var(--border)",
                            transition: "all var(--duration-base) var(--ease-out)"
                        }} />
                    ))}
                </div>
            )}

            {/* ── Step 0: Consent ── */}
            {step === 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h1 className="font-display" style={{ fontSize: "var(--text-2xl)", marginBottom: "40px" }}>Before we begin.</h1>
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontSize: "var(--text-md)", marginBottom: "48px" }}>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <span style={{ color: "var(--accent)", marginTop: "2px" }}>✓</span>
                            <span>No name. No email. No identity — ever collected.</span>
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <span style={{ color: "var(--accent)", marginTop: "2px" }}>✓</span>
                            <span>Your data lives on your device by default.</span>
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <span style={{ color: "var(--accent)", marginTop: "2px" }}>✓</span>
                            <span>A private passphrase lets you restore across devices.</span>
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <span style={{ color: "var(--accent)", marginTop: "2px" }}>✓</span>
                            <span>This supports you. It doesn't replace real help.</span>
                        </div>
                    </div>
                    <button className="btn-primary" onClick={() => setStep(1)} style={{ marginTop: "auto" }}>
                        I understand
                    </button>
                </div>
            )}



            {/* ── Step 1: Mood check ── */}
            {step === 1 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <h1 style={{ fontSize: "var(--text-lg)", marginBottom: "24px", fontWeight: 500 }}>How are you feeling right now?</h1>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                        {MOCK_MOODS.map((m, i) => (
                            <button
                                key={i}
                                onClick={() => setMood(i)}
                                style={{
                                    width: "100%", height: "56px", borderRadius: "12px", padding: "0 16px",
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    backgroundColor: mood === i ? "var(--accent-dim)" : "var(--card)",
                                    border: `1px solid ${mood === i ? "var(--accent)" : "var(--border)"}`,
                                    transform: mood === i ? "scale(1.02)" : "scale(1)",
                                    transition: "all var(--duration-fast) var(--ease-out)"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <span style={{ fontSize: "24px" }}>{m.emoji}</span>
                                    <span style={{ fontWeight: 500, fontSize: "var(--text-base)", color: "var(--text)" }}>{m.label}</span>
                                </div>
                                <div style={{
                                    width: "20px", height: "20px", borderRadius: "50%",
                                    border: mood === i ? "none" : "1.5px solid var(--border)",
                                    backgroundColor: mood === i ? "var(--accent)" : "transparent",
                                    display: "flex", justifyContent: "center", alignItems: "center"
                                }}>
                                    {mood === i && <span style={{ color: "#000", fontSize: "12px", fontWeight: "bold" }}>✓</span>}
                                </div>
                            </button>
                        ))}
                    </div>

                    <textarea
                        placeholder="Anything on your mind? (optional)"
                        style={{
                            width: "100%", minHeight: "80px", backgroundColor: "var(--bg)",
                            border: "1px solid var(--border)", borderRadius: "12px", padding: "16px",
                            color: "var(--text)", fontFamily: "inherit", fontSize: "var(--text-base)", resize: "none"
                        }}
                    />

                    <button className="btn-primary" disabled={mood === null} onClick={() => setStep(2)} style={{ marginTop: "auto" }}>
                        Continue
                    </button>
                </div>
            )}

            {/* ── Step 2: Needs ── */}
            {step === 2 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <h1 style={{ fontSize: "var(--text-lg)", marginBottom: "24px", fontWeight: 500 }}>What would help most right now?</h1>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                        {["🧘 Help me calm down", "📊 Track how I'm feeling", "💬 Talk to someone", "🔍 Just looking around"].map(n => (
                            <button
                                key={n}
                                onClick={() => toggleNeed(n)}
                                style={{
                                    width: "100%", height: "56px", borderRadius: "12px", padding: "0 16px",
                                    display: "flex", alignItems: "center", textAlign: "left",
                                    backgroundColor: needs.includes(n) ? "var(--accent-dim)" : "var(--card)",
                                    border: `1px solid ${needs.includes(n) ? "var(--accent)" : "var(--border)"}`,
                                    color: "var(--text)", fontWeight: 500, fontSize: "var(--text-base)",
                                    transition: "all var(--duration-fast)"
                                }}
                            >
                                {n}
                            </button>
                        ))}
                    </div>

                    <button className="btn-primary" disabled={needs.length === 0} onClick={handleComplete} style={{ marginTop: "auto" }}>
                        Enter CalmPulse
                    </button>
                </div>
            )}

        </div>
    );
}
