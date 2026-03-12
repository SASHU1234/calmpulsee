import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface BackButtonProps {
    label?: string;
    home?: boolean;
    absolute?: boolean;
    fallback?: string;
    onBack?: () => void;
}

export default function BackButton({ label = "Back", home = false, absolute = false, fallback = "/", onBack }: BackButtonProps) {
    const navigate = useNavigate();
    const [pressed, setPressed] = useState(false);
    const [homePressed, setHomePressed] = useState(false);

    // Swipe back gesture
    useEffect(() => {
        let startX = 0;
        let startY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (startX > 20) return; // Only from left edge (20px zone)

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = endX - startX;
            const diffY = Math.abs(endY - startY);

            if (diffX > 60 && diffY < 50) { // 60px horizontal, ignore if scrolling vertically
                handleBack();
            }
        };

        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate(fallback);
        }
    };

    const containerStyle: React.CSSProperties = absolute ? {
        position: "absolute",
        top: "env(safe-area-inset-top, 16px)",
        left: "16px",
        right: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 100,
    } : {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        minHeight: "44px"
    };

    return (
        <div style={containerStyle}>
            <button
                onClick={handleBack}
                onPointerDown={() => setPressed(true)}
                onPointerUp={() => setPressed(false)}
                onPointerLeave={() => setPressed(false)}
                style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    minWidth: "44px", minHeight: "44px",
                    backgroundColor: "transparent", border: "none", boxShadow: "none",
                    padding: 0, margin: 0,
                    color: pressed ? "var(--text)" : "var(--text-muted)",
                    transform: pressed ? "scale(0.95)" : "scale(1)",
                    transition: "all var(--duration-fast)",
                    cursor: "pointer",
                    fontFamily: "'Epilogue', sans-serif",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500
                }}
            >
                <span style={{ fontSize: "20px", marginBottom: "2px" }}>←</span>
                {label && <span>{label}</span>}
            </button>

            {home && (
                <button
                    onClick={() => navigate("/app/home")}
                    onPointerDown={() => setHomePressed(true)}
                    onPointerUp={() => setHomePressed(false)}
                    onPointerLeave={() => setHomePressed(false)}
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: "44px", height: "44px",
                        backgroundColor: "transparent", border: "none", boxShadow: "none",
                        padding: 0, margin: 0,
                        color: homePressed ? "var(--text)" : "var(--text-muted)",
                        transform: homePressed ? "scale(0.95)" : "scale(1)",
                        transition: "all var(--duration-fast)",
                        cursor: "pointer",
                        fontSize: "20px"
                    }}
                >
                    🏠
                </button>
            )}
        </div>
    );
}
