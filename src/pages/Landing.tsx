import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

const FEATURES = [
    {
        icon: "🧘",
        title: "Daily mood tracking",
        body: "Log how you're feeling in 30 seconds. Build a picture of your mental health over time."
    },
    {
        icon: "📋",
        title: "Validated self-assessments",
        body: "PHQ-9 and GAD-7 — the same tools used by clinicians, explained in plain language."
    },
    {
        icon: "✨",
        title: "AI-powered coping",
        body: "Personalized exercises based on your mood and what's been on your mind."
    },
    {
        icon: "💬",
        title: "Anonymous peer support",
        body: "Connect with students facing similar challenges. Matched by experience, never by identity."
    },
    {
        icon: "📈",
        title: "Mood trends & insights",
        body: "See patterns in your emotional health over weeks and months. Understand yourself better."
    },
    {
        icon: "🔒",
        title: "Privacy by design",
        body: "No account. No name. No email. Your data stays on your device unless you say otherwise."
    }
];

export default function Landing() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Scroll reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );

        const elements = document.querySelectorAll(".reveal");
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const scrollToFeatures = () => {
        document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
    };

    const openApp = () => navigate(isAuthenticated ? "/app/home" : "/login");

    return (
        <div className="landing-root">

            {/* ─── Sticky Navbar ─── */}
            <nav className="landing-nav">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="font-display landing-nav-wordmark">
                        CalmPulse
                    </span>
                </Link>

                <button
                    className="landing-nav-link"
                    onClick={scrollToFeatures}
                >
                    How it works
                </button>

                <button
                    className="cta-primary landing-nav-cta"
                    onClick={openApp}
                >
                    Open app →
                </button>
            </nav>

            {/* ─── Hero ─── */}
            <section style={{ minHeight: "calc(100vh - 72px)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                <div className="grain-overlay" />
                <div className="hero-glow" />

                {/* Hero content */}
                <div className="landing-container" style={{ flex: 1, display: "flex", alignItems: "center", position: "relative", zIndex: 2, paddingTop: "40px", paddingBottom: "60px" }}>
                    <div className="landing-hero-inner">
                        {/* Left */}
                        <div className="landing-hero-left">
                            <p className="font-mono" style={{ fontSize: "var(--text-sm)", color: "var(--accent)", marginBottom: "20px" }}>
                                Student Mental Health · Anonymous · Free
                            </p>

                            <h1 className="hero-headline">
                                You don't have to<br />
                                explain yourself<br />
                                here.
                            </h1>

                            <p style={{ fontSize: "var(--text-md)", color: "var(--text-muted)", maxWidth: "480px", lineHeight: 1.7, marginTop: "20px" }}>
                                CalmPulse is a private space to track your mood, find calm, and connect with peers who get it. No account. No judgment. Just support.
                            </p>

                            <div className="landing-ctas">
                                <button className="cta-primary" onClick={openApp}>
                                    Open the app →
                                </button>
                                <button className="cta-secondary" onClick={scrollToFeatures}>
                                    See how it works
                                </button>
                            </div>

                            <div className="trust-signals">
                                {["🔑 Passphrase protected", "📱 No account needed", "💚 Always free"].map(s => (
                                    <span key={s} className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right — phone mockup */}
                        <div className="landing-hero-right">
                            <div className="phone-frame">
                                {/* Simplified app preview inside frame */}
                                <div className="phone-inner">
                                    <div style={{ padding: "24px 16px", height: "808px", backgroundColor: "var(--bg)", overflowY: "hidden" }}>
                                        {/* Simulated home screen */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 600 }}>CalmPulse</span>
                                            <span style={{ fontSize: "20px" }}>🌙</span>
                                        </div>
                                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", lineHeight: 1.1, marginBottom: "8px" }}>Good morning.</h2>
                                        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "var(--text-muted)", marginBottom: "32px" }}>
                                            <span style={{ color: "var(--accent)", fontWeight: "bold" }}>6</span> days in a row · Keep going
                                        </p>

                                        {/* Check-in card */}
                                        <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                                <span style={{ fontSize: "48px" }}>😊</span>
                                                <div>
                                                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", marginBottom: "4px" }}>Pretty good</div>
                                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "var(--text-muted)" }}>Logged at 9:30 AM</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick actions */}
                                        <div style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Quick actions</div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                            {[["📋", "Assessment"], ["🧘", "Coping Hub"], ["📈", "My Trends"], ["👥", "Peer Connect"]].map(([icon, label]) => (
                                                <div key={label} style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                                    <span style={{ fontSize: "24px", color: "var(--accent)" }}>{icon}</span>
                                                    <span style={{ fontWeight: 500, fontSize: "13px" }}>{label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Features ─── */}
            <section id="features" className="landing-section" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="landing-container">
                    <p className="section-label reveal">What CalmPulse does</p>
                    <h2 className="section-headline reveal" style={{ animationDelay: "80ms", maxWidth: "600px" }}>
                        Everything you need.<br />Nothing you don't.
                    </h2>

                    <div className="features-grid">
                        {FEATURES.map((f, i) => (
                            <div
                                key={f.title}
                                className="feature-card reveal"
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{f.icon}</div>
                                <h3 style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 600, fontSize: "var(--text-lg)", marginBottom: "10px", letterSpacing: 0, lineHeight: 1.3 }}>
                                    {f.title}
                                </h3>
                                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: 1.7 }}>
                                    {f.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── How it works ─── */}
            <section className="landing-section" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="landing-container">
                    <p className="section-label reveal">How it works</p>
                    <h2 className="section-headline reveal">Simple by design.</h2>

                    <div className="how-steps">
                        {[
                            {
                                n: "01",
                                title: "Check in daily",
                                body: "Log your mood and what's going on. Takes less than a minute."
                            },
                            {
                                n: "02",
                                title: "Get personalized support",
                                body: "AI suggests coping exercises based on exactly how you're feeling."
                            },
                            {
                                n: "03",
                                title: "Track your growth",
                                body: "Watch your patterns, understand your triggers, and see yourself improve."
                            }
                        ].map((step, i) => (
                            <>
                                <div key={step.n} className="how-step reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                                    <div className="font-mono" style={{ fontSize: "var(--text-3xl)", color: "var(--accent)", fontWeight: 400, lineHeight: 1, marginBottom: "16px", opacity: 0.6 }}>
                                        {step.n}
                                    </div>
                                    <h3 style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 600, fontSize: "var(--text-lg)", marginBottom: "10px", letterSpacing: 0, lineHeight: 1.3 }}>
                                        {step.title}
                                    </h3>
                                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: 1.7 }}>
                                        {step.body}
                                    </p>
                                </div>
                                {i < 2 && <div className="how-step-arrow reveal">→</div>}
                            </>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Privacy ─── */}
            <section className="landing-section" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="landing-container">
                    <div className="privacy-card reveal">
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "var(--text-xl)", lineHeight: 1.2, marginBottom: "16px" }}>
                                Your privacy is<br />non-negotiable.
                            </h2>
                            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", lineHeight: 1.7 }}>
                                We built CalmPulse around a simple idea: you shouldn't have to trade your privacy for mental health support.
                            </p>
                        </div>

                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                            {[
                                "No name, no email, no identity — ever collected",
                                "Your data lives on your device by default",
                                "A private passphrase lets you restore across devices",
                                "No ads. No data selling. No exceptions."
                            ].map(item => (
                                <div key={item} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <span style={{ color: "var(--accent)", marginTop: "2px", flexShrink: 0 }}>✓</span>
                                    <span style={{ fontSize: "var(--text-sm)", lineHeight: 1.6 }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA Banner ─── */}
            <div className="cta-banner">
                <div className="landing-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                    <h2 className="section-headline reveal" style={{ textAlign: "center" }}>
                        Start in 30 seconds.
                    </h2>
                    <p className="reveal" style={{ fontSize: "var(--text-md)", color: "var(--text-muted)", textAlign: "center" }}>
                        No signup. No commitment. Just open it.
                    </p>
                    <button
                        className="cta-primary reveal"
                        onClick={openApp}
                        style={{ marginTop: "8px", height: "60px", padding: "0 40px", fontSize: "var(--text-md)", width: "auto" }}
                    >
                        Open CalmPulse →
                    </button>
                </div>
            </div>

            {/* ─── Crisis Resources ─── */}
            <section
                id="crisis-resources"
                style={{ borderTop: "1px solid var(--border)" }}
            >
                <div className="landing-container" style={{ padding: "64px 24px" }}>
                    <h2
                        className="font-display reveal"
                        style={{ fontSize: "var(--text-xl)", marginBottom: "12px" }}
                    >
                        Need help right now?
                    </h2>
                    <p
                        className="reveal"
                        style={{
                            fontFamily: "'Epilogue', sans-serif",
                            fontSize: "var(--text-sm)",
                            color: "var(--text-muted)",
                            marginBottom: "40px",
                            animationDelay: "60ms"
                        }}
                    >
                        These helplines are free, confidential, and available now.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                        {[
                            { org: "iCall India", number: "9152987821", tel: "9152987821" },
                            { org: "Vandrevala Foundation", number: "1860-2662-345", tel: "18602662345" },
                            { org: "NIMHANS Helpline", number: "080-46110007", tel: "08046110007" },
                        ].map((r, i) => (
                            <div
                                key={r.org}
                                className="reveal"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "20px 0",
                                    borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                                    animationDelay: `${(i + 1) * 60}ms`,
                                    gap: "16px",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "baseline", gap: "20px", flex: 1 }}>
                                    <span style={{
                                        fontFamily: "'Epilogue', sans-serif",
                                        fontSize: "var(--text-sm)",
                                        fontWeight: 500,
                                        color: "var(--text)",
                                        minWidth: "180px",
                                    }}>
                                        {r.org}
                                    </span>
                                    <span className="font-mono" style={{
                                        fontSize: "var(--text-sm)",
                                        color: "var(--text-muted)",
                                        letterSpacing: "0.02em",
                                    }}>
                                        {r.number}
                                    </span>
                                </div>
                                <a
                                    href={`tel:${r.tel}`}
                                    className="font-mono"
                                    style={{
                                        fontSize: "var(--text-sm)",
                                        color: "var(--accent)",
                                        textDecoration: "none",
                                        flexShrink: 0,
                                    }}
                                >
                                    Call
                                </a>
                            </div>
                        ))}
                    </div>

                    <p className="font-mono reveal" style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--text-muted)",
                        marginTop: "32px",
                        animationDelay: "240ms",
                    }}>
                        CalmPulse does not operate these helplines.
                    </p>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer style={{ borderTop: "1px solid var(--border)" }}>
                <div className="landing-container">
                    <div className="landing-footer">
                        <div className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                            CalmPulse &copy; 2026
                        </div>
                        <button
                            className="font-mono"
                            style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", cursor: "pointer" }}
                            onClick={() =>
                                document.getElementById("crisis-resources")?.scrollIntoView({ behavior: "smooth" })
                            }
                        >
                            Crisis Resources
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
