import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { generatePassphrase } from "../utils/passphrase";

// ─── Sub-views ────────────────────────────────────────────────────
type View = "main" | "email" | "anon-choice" | "anon-create" | "anon-restore";

export default function Login() {
    const navigate = useNavigate();
    const { loginWithGoogle, loginWithEmail, createAnonSession, loginWithPassphrase } = useAuth();

    const [view, setView] = useState<View>("main");
    const [loading, setLoading] = useState(false);

    // Email state
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // Anonymous create state
    const [generatedPhrase, setGeneratedPhrase] = useState("");
    const [copied, setCopied] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [acknowledged, setAcknowledged] = useState(false);

    // Anonymous restore state
    const [restorePhrase, setRestorePhrase] = useState("");
    const [restoreError, setRestoreError] = useState("");

    // ── Handlers ──────────────────────────────────────────────────

    const handleGoogle = () => {
        setLoading(true);
        // Simulate async
        setTimeout(() => {
            loginWithGoogle();
            localStorage.setItem("calmpulse-onboarded", "true");
            navigate("/app/home");
        }, 800);
    };

    const handleEmail = () => {
        setEmailError("");
        if (!email || !email.includes("@")) {
            setEmailError("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            const result = loginWithEmail(email);
            if (result.success) {
                localStorage.setItem("calmpulse-onboarded", "true");
                navigate("/app/home");
            } else {
                setEmailError(result.error || "Login failed.");
                setLoading(false);
            }
        }, 800);
    };

    const handleCreateAnon = () => {
        const phrase = generatePassphrase();
        setGeneratedPhrase(phrase);
        setView("anon-create");
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPhrase).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleDownload = () => {
        const content = `CalmPulse Recovery Key: ${generatedPhrase}\n\nKeep this safe. It is the only way to restore your data on a new device.`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "calmpulse-recovery-key.txt";
        a.click();
        URL.revokeObjectURL(url);
        setDownloaded(true);
    };

    const handleConfirmAnon = async () => {
        setLoading(true);
        await createAnonSession(generatedPhrase);
        navigate("/app/onboarding");
    };

    const handleRestore = async () => {
        setRestoreError("");
        const normalized = restorePhrase.trim().toLowerCase();
        if (!normalized) return;

        const words = normalized.split("-").filter(Boolean);
        if (words.length !== 4) {
            setRestoreError("Passphrase must be 4 words separated by dashes.");
            return;
        }

        setLoading(true);
        try {
            const result = await loginWithPassphrase(normalized);
            if (result.success) {
                localStorage.setItem("calmpulse-onboarded", "true");
                navigate("/app/home");
            } else {
                setRestoreError(result.error || "Passphrase not found.");
                setLoading(false);
            }
        } catch {
            setRestoreError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    // ── Loading overlay ──────────────────────────────────────────
    if (loading) {
        return (
            <div style={{
                height: "100vh", display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center",
                backgroundColor: "var(--bg)", gap: "16px"
            }}>
                <div style={{
                    width: "16px", height: "16px", borderRadius: "50%",
                    backgroundColor: "var(--accent)",
                    animation: "pulse 0.8s infinite ease-in-out"
                }} />
                <span className="font-mono" style={{
                    fontSize: "var(--text-xs)", color: "var(--text-muted)"
                }}>
                    Signing in...
                </span>
            </div>
        );
    }

    return (
        <div className="login-root page-enter">
            <div className="login-container">

                {/* Logo */}
                <div className="login-header">
                    <h1 className="font-display login-wordmark">CalmPulse</h1>
                    <div className="login-dot" />
                </div>

                {/* ── Main View ── */}
                {view === "main" && (
                    <div className="login-panel page-enter">
                        <h2 className="font-display" style={{
                            fontSize: "var(--text-xl)", marginBottom: "8px",
                            textAlign: "center"
                        }}>
                            Welcome back.
                        </h2>
                        <p style={{
                            fontSize: "var(--text-sm)", color: "var(--text-muted)",
                            textAlign: "center", marginBottom: "32px", lineHeight: 1.6
                        }}>
                            Choose how you'd like to continue.
                        </p>

                        {/* Google */}
                        <button
                            className="login-btn login-btn-google"
                            onClick={handleGoogle}
                            id="login-google-btn"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Email */}
                        <button
                            className="login-btn login-btn-email"
                            onClick={() => setView("email")}
                            id="login-email-btn"
                        >
                            <span style={{ fontSize: "18px" }}>✉️</span>
                            Continue with Email
                        </button>

                        {/* Divider */}
                        <div className="login-divider">
                            <span className="font-mono">or</span>
                        </div>

                        {/* Anonymous */}
                        <button
                            className="login-btn login-btn-anon"
                            onClick={() => setView("anon-choice")}
                            id="login-anon-btn"
                        >
                            <span style={{ fontSize: "18px" }}>🔑</span>
                            Continue Anonymously
                        </button>

                        <p className="font-mono" style={{
                            fontSize: "var(--text-xs)", color: "var(--text-muted)",
                            textAlign: "center", marginTop: "24px", lineHeight: 1.6
                        }}>
                            No account needed · Privacy first · Always free
                        </p>
                    </div>
                )}

                {/* ── Email View ── */}
                {view === "email" && (
                    <div className="login-panel page-enter">
                        <button
                            className="login-back-btn"
                            onClick={() => { setView("main"); setEmailError(""); }}
                        >
                            ← Back
                        </button>

                        <h2 className="font-display" style={{
                            fontSize: "var(--text-xl)", marginBottom: "8px"
                        }}>
                            Sign in with email
                        </h2>
                        <p style={{
                            fontSize: "var(--text-sm)", color: "var(--text-muted)",
                            marginBottom: "28px", lineHeight: 1.6
                        }}>
                            Enter your email to continue. We'll create an account if one doesn't exist.
                        </p>

                        <input
                            type="email"
                            placeholder="you@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleEmail()}
                            className="login-input"
                            id="login-email-input"
                            autoFocus
                            style={{
                                borderColor: emailError ? "var(--danger)" : undefined
                            }}
                        />

                        {emailError && (
                            <p className="font-mono" style={{
                                fontSize: "var(--text-xs)", color: "var(--danger)",
                                marginTop: "-8px", marginBottom: "12px"
                            }}>
                                {emailError}
                            </p>
                        )}

                        <button
                            className="btn-primary"
                            onClick={handleEmail}
                            disabled={!email.trim()}
                            id="login-email-submit"
                        >
                            Continue →
                        </button>
                    </div>
                )}

                {/* ── Anonymous Choice ── */}
                {view === "anon-choice" && (
                    <div className="login-panel page-enter">
                        <button
                            className="login-back-btn"
                            onClick={() => setView("main")}
                        >
                            ← Back
                        </button>

                        <h2 className="font-display" style={{
                            fontSize: "var(--text-xl)", marginBottom: "8px"
                        }}>
                            Anonymous access
                        </h2>
                        <p style={{
                            fontSize: "var(--text-sm)", color: "var(--text-muted)",
                            marginBottom: "32px", lineHeight: 1.6
                        }}>
                            No email. No identity. Just a private passphrase that's yours alone.
                        </p>

                        <button
                            className="login-btn login-btn-create"
                            onClick={handleCreateAnon}
                            id="login-create-anon-btn"
                        >
                            <span style={{ fontSize: "20px" }}>✨</span>
                            <div style={{ textAlign: "left" }}>
                                <div style={{ fontWeight: 500, marginBottom: "2px" }}>Create new anonymous session</div>
                                <div className="font-mono" style={{
                                    fontSize: "var(--text-xs)", color: "var(--text-muted)"
                                }}>
                                    Generate a fresh passphrase
                                </div>
                            </div>
                        </button>

                        <button
                            className="login-btn login-btn-restore"
                            onClick={() => setView("anon-restore")}
                            id="login-restore-anon-btn"
                        >
                            <span style={{ fontSize: "20px" }}>🔑</span>
                            <div style={{ textAlign: "left" }}>
                                <div style={{ fontWeight: 500, marginBottom: "2px" }}>Log in with passphrase</div>
                                <div className="font-mono" style={{
                                    fontSize: "var(--text-xs)", color: "var(--text-muted)"
                                }}>
                                    I already have a recovery key
                                </div>
                            </div>
                        </button>
                    </div>
                )}

                {/* ── Anonymous Create (Passphrase Display) ── */}
                {view === "anon-create" && (
                    <div className="login-panel page-enter">
                        <button
                            className="login-back-btn"
                            onClick={() => { setView("anon-choice"); setAcknowledged(false); setCopied(false); setDownloaded(false); }}
                        >
                            ← Back
                        </button>

                        <h2 className="font-display" style={{
                            fontSize: "var(--text-xl)", marginBottom: "8px"
                        }}>
                            Save this. It's your only key.
                        </h2>
                        <p style={{
                            fontSize: "var(--text-sm)", color: "var(--text-muted)",
                            marginBottom: "28px", lineHeight: 1.7
                        }}>
                            We don't know who you are — and we never will. This passphrase is the only way to access your data.
                        </p>

                        {/* Passphrase card */}
                        <div className="login-passphrase-card">
                            <div className="font-mono login-passphrase-text">
                                {generatedPhrase}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                            <button
                                onClick={handleCopy}
                                className="login-action-btn"
                                style={{
                                    flex: 1,
                                    backgroundColor: copied ? "var(--accent-dim)" : "var(--card)",
                                    borderColor: copied ? "var(--accent)" : "var(--border)",
                                    color: copied ? "var(--accent)" : "var(--text)",
                                }}
                            >
                                {copied ? "Copied ✓" : "📋 Copy"}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="login-action-btn"
                                style={{
                                    flex: 1,
                                    backgroundColor: downloaded ? "var(--accent-dim)" : "var(--card)",
                                    borderColor: downloaded ? "var(--accent)" : "var(--border)",
                                    color: downloaded ? "var(--accent)" : "var(--text)",
                                }}
                            >
                                {downloaded ? "Saved ✓" : "📥 Download"}
                            </button>
                        </div>

                        {/* Warning */}
                        <p className="font-mono" style={{
                            fontSize: "var(--text-xs)", color: "var(--danger)",
                            marginBottom: "24px", lineHeight: 1.5
                        }}>
                            ⚠ If you lose this passphrase, your data cannot be recovered.
                        </p>

                        {/* Checkbox */}
                        <label style={{
                            display: "flex", alignItems: "flex-start", gap: "12px",
                            cursor: "pointer", marginBottom: "24px"
                        }}>
                            <div
                                onClick={() => setAcknowledged(a => !a)}
                                style={{
                                    width: "20px", height: "20px", borderRadius: "6px", flexShrink: 0,
                                    marginTop: "2px",
                                    border: `1.5px solid ${acknowledged ? "var(--accent)" : "var(--border)"}`,
                                    backgroundColor: acknowledged ? "var(--accent)" : "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all var(--duration-fast)", cursor: "pointer"
                                }}
                            >
                                {acknowledged && <span style={{ color: "#000", fontSize: "12px", fontWeight: "bold" }}>✓</span>}
                            </div>
                            <span style={{
                                fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: 1.5
                            }}>
                                I've saved my passphrase somewhere safe
                            </span>
                        </label>

                        <button
                            className="btn-primary"
                            disabled={!acknowledged}
                            onClick={handleConfirmAnon}
                            id="login-confirm-anon-btn"
                        >
                            Enter CalmPulse →
                        </button>
                    </div>
                )}

                {/* ── Anonymous Restore ── */}
                {view === "anon-restore" && (
                    <div className="login-panel page-enter">
                        <button
                            className="login-back-btn"
                            onClick={() => { setView("anon-choice"); setRestoreError(""); }}
                        >
                            ← Back
                        </button>

                        <h2 className="font-display" style={{
                            fontSize: "var(--text-xl)", marginBottom: "8px"
                        }}>
                            Enter your passphrase
                        </h2>
                        <p style={{
                            fontSize: "var(--text-sm)", color: "var(--text-muted)",
                            marginBottom: "28px", lineHeight: 1.6
                        }}>
                            Type your 4-word passphrase separated by dashes.
                        </p>

                        <input
                            type="text"
                            placeholder="word-word-word-word"
                            value={restorePhrase}
                            onChange={e => setRestorePhrase(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleRestore()}
                            className="login-input font-mono"
                            id="login-passphrase-input"
                            autoFocus
                            style={{
                                color: "var(--accent)",
                                letterSpacing: "0.04em",
                                borderColor: restoreError ? "var(--danger)" : undefined
                            }}
                        />

                        {restoreError && (
                            <p className="font-mono" style={{
                                fontSize: "var(--text-xs)", color: "var(--danger)",
                                marginTop: "-8px", marginBottom: "12px"
                            }}>
                                {restoreError}
                            </p>
                        )}

                        <button
                            className="btn-primary"
                            onClick={handleRestore}
                            disabled={!restorePhrase.trim()}
                            id="login-restore-submit"
                        >
                            Restore my data →
                        </button>

                        <p style={{
                            fontSize: "var(--text-sm)", color: "var(--text-muted)",
                            textAlign: "center", marginTop: "20px"
                        }}>
                            Don't have your passphrase?{" "}
                            <button
                                onClick={handleCreateAnon}
                                style={{
                                    color: "var(--accent)",
                                    fontSize: "var(--text-sm)",
                                    fontFamily: "'Epilogue', sans-serif"
                                }}
                            >
                                Start fresh →
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
