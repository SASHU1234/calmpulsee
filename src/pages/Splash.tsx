import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
    const navigate = useNavigate();
    const [showText, setShowText] = useState(false);
    const [showDot, setShowDot] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        let id = localStorage.getItem("calmpulse-id");
        if (!id) {
            // Generate ID like "A1BC-9X2F"
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            id = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join("") +
                "-" +
                Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
            localStorage.setItem("calmpulse-id", id);
        }

        // Sequence
        setTimeout(() => setShowText(true), 200);
        setTimeout(() => setShowDot(true), 600);

        setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                if (localStorage.getItem("calmpulse-onboarded")) navigate("/app/home");
                else navigate("/app/onboarding");
            }, 400); // Wait for fade out
        }, 1800);
    }, [navigate]);

    return (
        <div style={{
            height: "100vh", width: "100%", display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center",
            backgroundColor: "var(--bg)", color: "var(--text)",
            opacity: fadeOut ? 0 : 1, transition: "opacity 400ms var(--ease-out)"
        }}>
            <h1 className="font-display" style={{
                fontSize: "var(--text-3xl)",
                opacity: showText ? 1 : 0,
                transform: showText ? "translateY(0)" : "translateY(12px)",
                transition: "all 400ms var(--ease-out)"
            }}>
                CalmPulse
            </h1>

            <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                backgroundColor: "var(--accent)", marginTop: "16px",
                opacity: showDot ? 1 : 0, transition: "opacity 600ms",
                animation: showDot ? "pulse 3s infinite ease-in-out" : "none"
            }} />

            <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
        </div>
    );
}
