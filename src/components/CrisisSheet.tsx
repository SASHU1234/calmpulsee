import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function CrisisSheet() {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Close on route change
        setOpen(false);
    }, [location]);

    return (
        <>
            <button
                className="crisis-pill"
                onClick={() => setOpen(true)}
                style={{
                    position: "fixed", bottom: "80px", right: "16px", zIndex: 90,
                    backgroundColor: "var(--surface)", border: "1px solid var(--border)",
                    color: "var(--text)", padding: "10px 16px", borderRadius: "24px",
                    display: "flex", alignItems: "center", gap: "8px",
                    fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transition: "transform 0.2s"
                }}
            >
                <div style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    backgroundColor: "var(--danger)",
                    animation: "pulse-danger 3s infinite ease-in-out"
                }} />
                Help
            </button>

            <style>{`
        @keyframes pulse-danger {
          0% { box-shadow: 0 0 0 0 rgba(224, 112, 112, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(224, 112, 112, 0); }
          100% { box-shadow: 0 0 0 0 rgba(224, 112, 112, 0); }
        }
      `}</style>

            {/* Backdrop */}
            <div
                onClick={() => setOpen(false)}
                style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000,
                    opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
                    transition: "opacity 300ms var(--ease-out)"
                }}
            />

            {/* Sheet */}
            <div style={{
                position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
                width: "100%", maxWidth: "390px", height: "70vh", zIndex: 1001,
                backgroundColor: "var(--surface)", borderTopLeftRadius: "20px", borderTopRightRadius: "20px",
                padding: "24px 24px 40px", display: "flex", flexDirection: "column",
                transformOrigin: "bottom center",
                translate: open ? "0 0" : "0 100%",
                transition: "translate 300ms var(--ease-out)"
            }}>
                <div style={{
                    position: "absolute", top: "12px", left: "50%", transform: "translateX(-50%)",
                    width: "32px", height: "4px", backgroundColor: "var(--border)", borderRadius: "2px"
                }} />

                <h1 className="font-display" style={{ fontSize: "var(--text-xl)", marginBottom: "4px", marginTop: "16px" }}>You matter.</h1>
                <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "32px" }}>
                    Help is available right now.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflowY: "auto" }}>
                    <div className="card-base" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--danger)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>🇮🇳</div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: "var(--text-md)", fontWeight: 500 }}>iCall India</h3>
                            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Free phone & email support</p>
                        </div>
                        <a href="tel:9152987821" style={{ backgroundColor: "var(--accent)", color: "#000", padding: "6px 12px", borderRadius: "16px", fontWeight: "bold", fontSize: "14px" }} className="font-mono">Call</a>
                    </div>

                    <div className="card-base" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--warning)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>📞</div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: "var(--text-md)", fontWeight: 500 }}>Vandrevala Found.</h3>
                            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>24x7 Suicide Prevention</p>
                        </div>
                        <a href="tel:18602662345" style={{ backgroundColor: "var(--accent)", color: "#000", padding: "6px 12px", borderRadius: "16px", fontWeight: "bold", fontSize: "14px" }} className="font-mono">Call</a>
                    </div>

                    <div className="card-base" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#5A8A00", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>🏥</div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: "var(--text-md)", fontWeight: 500 }}>NIMHANS</h3>
                            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>National Helpline</p>
                        </div>
                        <a href="tel:08046110007" style={{ backgroundColor: "var(--accent)", color: "#000", padding: "6px 12px", borderRadius: "16px", fontWeight: "bold", fontSize: "14px" }} className="font-mono">Call</a>
                    </div>
                </div>

                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
                    {localStorage.getItem("calmpulse-safety-plan") ? (
                        <div style={{ marginBottom: "16px" }}>
                            <Link to="/crisis-plan" className="btn-text">My safety plan →</Link>
                        </div>
                    ) : (
                        <div style={{ marginBottom: "16px" }}>
                            <span className="btn-text" style={{ color: "var(--text-muted)", cursor: "pointer" }}>Create a safety plan →</span>
                        </div>
                    )}

                    <button
                        onClick={() => setOpen(false)}
                        style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", padding: "8px" }}
                    >
                        I'm okay, close
                    </button>
                </div>
            </div>
        </>
    );
}
