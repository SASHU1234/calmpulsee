import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { interpretScore } from "../services/ai";
import BackButton from "../components/BackButton";
import { useNavigationContext } from "../components/NavigationProvider";

export default function Assessment() {
    const navigate = useNavigate();
    const { previousScreenName } = useNavigationContext();
    const [tab, setTab] = useState("PHQ-9"); // PHQ-9 or GAD-7
    const [inTest, setInTest] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [result, setResult] = useState<any>(null);

    const PHQ_QUESTIONS = [
        "Little interest or pleasure in doing things",
        "Feeling down, depressed, or hopeless",
        "Trouble falling or staying asleep, or sleeping too much",
        "Feeling tired or having little energy",
        "Poor appetite or overeating",
        "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
        "Trouble concentrating on things, such as reading the newspaper or watching television",
        "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
        "Thoughts that you would be better off dead, or of hurting yourself in some way"
    ];

    const GAD_QUESTIONS = [
        "Feeling nervous, anxious, or on edge",
        "Not being able to stop or control worrying",
        "Worrying too much about different things",
        "Trouble relaxing",
        "Being so restless that it is hard to sit still",
        "Becoming easily annoyed or irritable",
        "Feeling afraid, as if something awful might happen"
    ];

    const OPTIONS = [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 }
    ];

    const questions = tab === "PHQ-9" ? PHQ_QUESTIONS : GAD_QUESTIONS;

    const handleAnswer = (val: number) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = val;
        setAnswers(newAnswers);

        if (questionIndex < questions.length - 1) {
            setTimeout(() => setQuestionIndex(q => q + 1), 400); // fluid auto-advance
        } else {
            setTimeout(() => calculateResult(newAnswers), 400);
        }
    };

    const calculateResult = async (finalAnswers: number[]) => {
        const score = finalAnswers.reduce((a, b) => a + b, 0);
        const interpretation = await interpretScore(tab, score);

        // Determine severity
        let severity = "Minimal";
        if (score >= 20) severity = "Severe";
        else if (score >= 15) severity = "Moderately Severe";
        else if (score >= 10) severity = "Moderate";
        else if (score >= 5) severity = "Mild";

        const newResult = { type: tab, score, severity, date: new Date().toISOString(), interpretation };
        setResult(newResult);

        // Save
        const history = JSON.parse(localStorage.getItem("calmpulse-assessments") || "[]");
        localStorage.setItem("calmpulse-assessments", JSON.stringify([newResult, ...history]));
    };

    if (result) {
        const ranges = ["Minimal", "Mild", "Moderate", "Severe"];
        const sIndex = ranges.findIndex(r => result.severity.includes(r));

        return (
            <div className="page-enter" style={{ padding: "8px 16px 24px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <BackButton label="Assessment" onBack={() => { setResult(null); setInTest(false); }} />

                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h2 className="font-mono" style={{ fontSize: "var(--text-3xl)", color: "var(--accent)" }}>{result.score}</h2>
                    <p className="font-display" style={{ fontSize: "var(--text-xl)" }}>{result.severity}</p>
                </div>

                {/* Severity Band */}
                <div style={{ display: "flex", width: "100%", height: "8px", borderRadius: "4px", backgroundColor: "var(--border)", marginBottom: "8px", overflow: "hidden" }}>
                    {ranges.map((r, i) => (
                        <div key={r} style={{
                            flex: 1, height: "100%", borderRight: "1px solid var(--bg)",
                            backgroundColor: i <= sIndex ? (i > 2 ? "var(--danger)" : i > 1 ? "var(--warning)" : "var(--accent)") : "transparent",
                            opacity: i === sIndex ? 1 : 0.4
                        }} />
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-muted)", marginBottom: "32px", padding: "0 4px" }}>
                    <span className="font-mono">0</span>
                    <span className="font-mono">5</span>
                    <span className="font-mono">10</span>
                    <span className="font-mono">15</span>
                    <span className="font-mono">{tab === "PHQ-9" ? 27 : 21}</span>
                </div>

                <div className="card-base" style={{ marginBottom: "40px", position: "relative" }}>
                    <span style={{ position: "absolute", top: "16px", left: "16px", color: "var(--accent)" }}>✨</span>
                    <p style={{ paddingLeft: "24px", fontSize: "var(--text-base)", lineHeight: 1.6 }}>
                        {result.interpretation.message}
                    </p>
                </div>

                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <button className="btn-primary" onClick={() => navigate("/app/coping")}>Go to Coping Hub</button>
                    <button className="btn-outlined" onClick={() => { setResult(null); setInTest(false); navigate("/app/home"); }}>Save & exit</button>

                    <label style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>
                        <input type="checkbox" style={{ accentColor: "var(--accent)" }} />
                        Remind me to retake in 2 weeks
                    </label>
                </div>
            </div>
        );
    }

    if (inTest) {
        const progress = ((questionIndex + 1) / questions.length) * 100;

        return (
            <div className="page-enter" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: "var(--bg)", display: "flex", flexDirection: "column", maxWidth: "390px", margin: "auto" }}>
                {/* Progress bar */}
                <div style={{ width: "100%", height: "3px", backgroundColor: "var(--border)" }}>
                    <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "var(--accent)", transition: "width 0.3s var(--ease-out)" }} />
                </div>

                <div style={{ padding: "8px 16px 0" }}>
                    <BackButton label="Assessment" onBack={() => setInTest(false)} />
                    <p className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "8px" }}>Question {questionIndex + 1} of {questions.length}</p>
                </div>

                <div style={{ flex: 1, padding: "24px 16px", display: "flex", flexDirection: "column" }}>
                    <h2 className="font-display" style={{ fontSize: "var(--text-xl)", textAlign: "center", marginBottom: "40px", marginTop: "10vh", lineHeight: 1.4 }}>
                        {questions[questionIndex]}
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "auto", marginBottom: "32px" }}>
                        {OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleAnswer(opt.value)}
                                style={{
                                    width: "100%", height: "56px", borderRadius: "12px", padding: "0 16px",
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    backgroundColor: answers[questionIndex] === opt.value ? "var(--accent-dim)" : "var(--card)",
                                    border: `1px solid ${answers[questionIndex] === opt.value ? "var(--accent)" : "var(--border)"}`,
                                    transform: answers[questionIndex] === opt.value ? "scale(1.02)" : "scale(1)",
                                    transition: "all var(--duration-fast) var(--ease-out)"
                                }}
                            >
                                <span style={{ fontWeight: 500, fontSize: "var(--text-base)", color: "var(--text)" }}>{opt.label}</span>
                                <div style={{
                                    width: "20px", height: "20px", borderRadius: "50%",
                                    border: answers[questionIndex] === opt.value ? "none" : "1.5px solid var(--border)",
                                    backgroundColor: answers[questionIndex] === opt.value ? "var(--accent)" : "transparent",
                                    display: "flex", justifyContent: "center", alignItems: "center"
                                }}>
                                    {answers[questionIndex] === opt.value && <span style={{ color: "#000", fontSize: "12px", fontWeight: "bold" }}>✓</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Dashboard view
    return (
        <div className="page-enter" style={{ padding: "8px 16px 24px" }}>
            <BackButton label={previousScreenName} />
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                <h1 className="font-display" style={{ fontSize: "var(--text-md)" }}>Assessment</h1>
                <button style={{ color: "var(--text-muted)" }}>ℹ️</button>
            </header>

            {/* Switcher */}
            <div style={{ display: "flex", backgroundColor: "var(--card)", borderRadius: "24px", padding: "4px", marginBottom: "32px", border: "1px solid var(--border)" }}>
                {["PHQ-9", "GAD-7"].map(t => (
                    <button
                        key={t} onClick={() => setTab(t)}
                        style={{
                            flex: 1, padding: "8px 0", borderRadius: "20px", fontWeight: "bold", fontSize: "var(--text-sm)",
                            backgroundColor: tab === t ? "var(--accent)" : "transparent",
                            color: tab === t ? "#000" : "var(--text-muted)",
                            transition: "all var(--duration-fast)"
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="card-base" style={{ textAlign: "center", padding: "32px 16px" }}>
                <h2 className="font-display" style={{ fontSize: "var(--text-lg)", marginBottom: "8px" }}>
                    {tab === "PHQ-9" ? "Depression Screener" : "Anxiety Screener"}
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "24px" }}>
                    Takes about 2 minutes. Used by clinicians worldwide.
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "32px" }}>
                    {/* Mock sparkline */}
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--border)" }} />
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--border)" }} />
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--border)" }} />
                </div>

                <button
                    className="btn-outlined"
                    onClick={() => {
                        setAnswers([]);
                        setQuestionIndex(0);
                        setInTest(true);
                    }}
                    style={{ width: "auto", padding: "0 32px", margin: "0 auto", color: "var(--accent)" }}
                >
                    Start assessment
                </button>
            </div>
        </div>
    );
}
