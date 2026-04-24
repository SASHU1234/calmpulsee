import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { generatePassphrase, savePassphrase } from "../utils/passphrase";
import { useAuth } from "../components/AuthProvider";

// ─── Restore bottom sheet ────────────────────────────────────────
function RestoreSheet({ onClose }: { onClose: () => void }) {
    const navigate = useNavigate();
    const { loginWithPassphrase } = useAuth();
    const [phrase, setPhrase] = useState("");

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleRestore = async () => {
        if (!phrase.trim()) return;
        setStatus("loading");
        try {
            const result = await loginWithPassphrase(phrase.trim().toLowerCase());
            if (result.success) {
                setStatus("success");
                setTimeout(() => {
                    localStorage.setItem("calmpulse-onboarded", "true");
                    navigate("/app/home");
                }, 1200);
            } else {
                setStatus("error");
                setTimeout(() => setStatus("idle"), 2000);
            }
        } catch {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    // Trap focus inside sheet
    const ref = useRef<HTMLDivElement>(null);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed", inset: 0,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    zIndex: 200
                }}
            />
            {/* Sheet */}
            <div
                ref={ref}
                style={{
                    position: "fixed",
                    bottom: 0, left: 0, right: 0,
                    zIndex: 201,
                    backgroundColor: "var(--surface)",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                    padding: "32px 24px 48px",
                    boxShadow: "0 -8px 40px rgba(0,0,0,0.4)",
                    animation: "slideUp 0.25s var(--ease-out)",
                }}
            >
                <div style={{
                    width: "32px", height: "4px", borderRadius: "2px",
                    backgroundColor: "var(--border)",
                    margin: "0 auto 28px",
                }} />

                <h2 className="font-display" style={{ fontSize: "var(--text-xl)", marginBottom: "8px" }}>
                    Enter your recovery passphrase
                </h2>
                <p style={{
                    fontFamily: "'Epilogue', sans-serif",
                    fontSize: "var(--text-sm)",
                    color: "var(--text-muted)",
                    marginBottom: "28px",
                    lineHeight: 1.6
                }}>
                    Type your 4-word passphrase separated by dashes.
                </p>

                <input
                    type="text"
                    placeholder="word-word-word-word"
                    value={phrase}
                    onChange={e => setPhrase(e.target.value)}
                    className="font-mono"
                    style={{
                        width: "100%",
                        height: "56px",
                        backgroundColor: "var(--card)",
                        border: `1px solid ${status === "error" ? "var(--danger)" : "var(--border)"}`,
                        borderRadius: "12px",
                        padding: "0 16px",
                        color: "var(--accent)",
                        fontSize: "var(--text-md)",
                        letterSpacing: "0.04em",
                        boxSizing: "border-box",
                        marginBottom: "16px",
                        transition: "border-color var(--duration-fast)",
                    }}
                    onKeyDown={e => e.key === "Enter" && handleRestore()}
                    autoFocus
                />

                {status === "error" && (
                    <p className="font-mono" style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--danger)",
                        marginBottom: "12px",
                    }}>
                        That doesn't look right. Check the format: word-word-word-word
                    </p>
                )}

                <button
                    className="btn-primary"
                    onClick={handleRestore}
                    disabled={status === "loading" || status === "success" || !phrase.trim()}
                    style={{ marginBottom: "24px" }}
                >
                    {status === "loading" ? "Restoring…" :
                        status === "success" ? "Data restored ✓" :
                            "Restore my data"}
                </button>

                <div style={{ textAlign: "center" }}>
                    <p style={{
                        fontFamily: "'Epilogue', sans-serif",
                        fontSize: "var(--text-sm)",
                        color: "var(--text-muted)",
                    }}>
                        Don't have your passphrase?{" "}
                        <button
                            onClick={onClose}
                            style={{ color: "var(--accent)", fontFamily: "'Epilogue', sans-serif", fontSize: "var(--text-sm)" }}
                        >
                            Start fresh →
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}

// ─── Main Onboarding ─────────────────────────────────────────────
export default function Onboarding() {
    const navigate = useNavigate();
    const { session, loginWithGoogle: authGoogleLogin, createAnonSession } = useAuth();
    // Steps: 0=consent, 1=welcome, 2=recovery-key, 3=mood, 4=needs
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showRestore, setShowRestore] = useState(false);

    // Recovery key state
    const [passphrase, setPassphrase] = useState("");
    const [copied, setCopied] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [acknowledged, setAcknowledged] = useState(false);

    // Mood/needs state
    const [mood, setMood] = useState<number | null>(null);
    const [needs, setNeeds] = useState<string[]>([]);

    // Generate passphrase on mount (only once)
    useEffect(() => {
        // If user already has a passphrase from auth, use it
        if (session?.passphrase) {
            setPassphrase(session.passphrase);
        } else {
            const existing = localStorage.getItem("calmpulse-passphrase");
            if (!existing) {
                setPassphrase(generatePassphrase());
            } else {
                setPassphrase(existing);
            }
        }
    }, [session]);

    const handleComplete = async () => {
        setLoading(true);
        savePassphrase(passphrase);
        // If not already an anon session, create one
        if (!session || session.authMethod !== "anon") {
            await createAnonSession(passphrase);
        }
        localStorage.setItem("calmpulse-onboarded", "true");
        navigate("/app/home");
    };

    const handleGoogleSignIn = () => {
        setLoading(true);
        setTimeout(() => {
            authGoogleLogin();
            localStorage.setItem("calmpulse-onboarded", "true");
            navigate("/app/home");
        }, 1200);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(passphrase).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleDownload = () => {
        const content = `CalmPulse Recovery Key: ${passphrase}\n\nKeep this safe. It is the only way to restore your data on a new device.`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "calmpulse-recovery-key.txt";
        a.click();
        URL.revokeObjectURL(url);
        setDownloaded(true);
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

    // Step count for progress dots (steps 1-4 map to dots 1-4)
    const totalDots = 4;
    const dotStep = step; // step 0 = no dots, steps 1-4 = dots

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
                    <button
                        onClick={() => setShowRestore(true)}
                        style={{
                            marginTop: "20px",
                            color: "var(--text-muted)",
                            fontFamily: "'Epilogue', sans-serif",
                            fontSize: "var(--text-sm)",
                            textAlign: "center",
                            transition: "color 150ms",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                        Restoring a previous account →
                    </button>
                </div>
            )}

            {/* ── Step 1: Welcome ── */}
            {step === 1 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <h1 className="font-display" style={{ fontSize: "var(--text-xl)", marginBottom: "16px", marginTop: "10vh" }}>
                        You don't have to explain yourself here.
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
                        CalmPulse is a private space to check in with yourself, find calm, and connect with peers who get what you're going through.
                    </p>
                    <div style={{ marginTop: "auto", textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <button className="btn-primary" onClick={() => setStep(2)}>
                            Get started anonymously
                        </button>
                        <button
                            onClick={handleGoogleSignIn}
                            style={{
                                width: "100%", height: "56px", borderRadius: "12px",
                                backgroundColor: "var(--card)", border: "1px solid var(--border)",
                                color: "var(--text)", fontFamily: "'Epilogue', sans-serif", fontSize: "var(--text-base)",
                                fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                                cursor: "pointer", transition: "all var(--duration-fast)"
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                        <div className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "4px" }}>
                            Or use a passphrase · No account required
                        </div>
                    </div>
                </div>
            )}

            {/* ── Step 2: Recovery Key ── */}
            {step === 2 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <h1 className="font-display" style={{ fontSize: "var(--text-xl)", marginBottom: "16px" }}>
                        Save this. It's your only key.
                    </h1>
                    <p style={{
                        fontFamily: "'Epilogue', sans-serif",
                        fontSize: "var(--text-sm)",
                        color: "var(--text-muted)",
                        lineHeight: 1.7,
                        marginBottom: "32px",
                    }}>
                        We don't know who you are — and we never will. This passphrase is the only way to restore your data on a new device.
                    </p>

                    {/* Passphrase card */}
                    <div style={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "16px",
                        padding: "28px 20px",
                        textAlign: "center",
                        marginBottom: "20px",
                    }}>
                        <div className="font-mono" style={{
                            fontSize: "clamp(16px, 4.5vw, var(--text-xl))",
                            color: "var(--accent)",
                            letterSpacing: "0.04em",
                            lineHeight: 1.4,
                            wordBreak: "break-all",
                        }}>
                            {passphrase}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                        <button
                            onClick={handleCopy}
                            style={{
                                flex: 1, height: "44px", borderRadius: "12px",
                                backgroundColor: copied ? "var(--accent-dim)" : "var(--card)",
                                border: `1px solid ${copied ? "var(--accent)" : "var(--border)"}`,
                                color: copied ? "var(--accent)" : "var(--text)",
                                fontFamily: "'Epilogue', sans-serif",
                                fontSize: "var(--text-sm)",
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all var(--duration-fast)",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                            }}
                        >
                            {copied ? "Copied ✓" : "📋 Copy passphrase"}
                        </button>
                        <button
                            onClick={handleDownload}
                            style={{
                                flex: 1, height: "44px", borderRadius: "12px",
                                backgroundColor: downloaded ? "var(--accent-dim)" : "var(--card)",
                                border: `1px solid ${downloaded ? "var(--accent)" : "var(--border)"}`,
                                color: downloaded ? "var(--accent)" : "var(--text)",
                                fontFamily: "'Epilogue', sans-serif",
                                fontSize: "var(--text-sm)",
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all var(--duration-fast)",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                            }}
                        >
                            {downloaded ? "Saved ✓" : "📥 Download .txt"}
                        </button>
                    </div>

                    {/* Warning */}
                    <p className="font-mono" style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--danger)",
                        marginBottom: "28px",
                        lineHeight: 1.5,
                    }}>
                        If you lose this, your data cannot be recovered.
                    </p>

                    {/* Checkbox */}
                    <label style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        cursor: "pointer",
                        marginBottom: "auto",
                    }}>
                        <div
                            onClick={() => setAcknowledged(a => !a)}
                            style={{
                                width: "20px", height: "20px", borderRadius: "6px", flexShrink: 0, marginTop: "2px",
                                border: `1.5px solid ${acknowledged ? "var(--accent)" : "var(--border)"}`,
                                backgroundColor: acknowledged ? "var(--accent)" : "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all var(--duration-fast)",
                                cursor: "pointer",
                            }}
                        >
                            {acknowledged && <span style={{ color: "#000", fontSize: "12px", fontWeight: "bold" }}>✓</span>}
                        </div>
                        <span style={{
                            fontFamily: "'Epilogue', sans-serif",
                            fontSize: "var(--text-sm)",
                            color: "var(--text-muted)",
                            lineHeight: 1.5,
                        }}>
                            I've saved my passphrase somewhere safe
                        </span>
                    </label>

                    <button
                        className="btn-primary"
                        disabled={!acknowledged}
                        onClick={() => { savePassphrase(passphrase); setStep(3); }}
                        style={{ marginTop: "28px" }}
                    >
                        Continue
                    </button>
                </div>
            )}

            {/* ── Step 3: Mood check ── */}
            {step === 3 && (
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

                    <button className="btn-primary" disabled={mood === null} onClick={() => setStep(4)} style={{ marginTop: "auto" }}>
                        Continue
                    </button>
                </div>
            )}

            {/* ── Step 4: Needs ── */}
            {step === 4 && (
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

            {/* Restore sheet */}
            {showRestore && <RestoreSheet onClose={() => setShowRestore(false)} />}
        </div>
    );
}
