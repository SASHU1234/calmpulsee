import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
    { path: "/app/home", label: "Home", icon: "🏠" },
    { path: "/app/log", label: "Log", icon: "✏️" },
    { path: "/app/coping", label: "Coping", icon: "🧘" },
    { path: "/app/connect", label: "Connect", icon: "💬", badge: true },
    { path: "/app/you", label: "You", icon: "👤" }
];

export default function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className="bottom-nav" style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: "390px", height: "64px",
            backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)",
            display: "flex", justifyContent: "space-around", alignItems: "center",
            zIndex: 100, paddingBottom: "env(safe-area-inset-bottom)"
        }}>
            {TABS.map(t => {
                const isRoot = location.pathname === t.path;
                const active = location.pathname.startsWith(t.path);

                const handleClick = (e: React.MouseEvent) => {
                    e.preventDefault();
                    if (isRoot) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                        navigate(t.path, { replace: true });
                    }
                };

                return (
                    <a key={t.path} href={t.path} onClick={handleClick} style={{
                        position: "relative", display: "flex", flexDirection: "column",
                        alignItems: "center", width: "50px", height: "100%",
                        justifyContent: "center", textDecoration: "none"
                    }}>
                        <div style={{
                            fontSize: "20px",
                            color: active ? "var(--accent)" : "var(--text-muted)",
                            transition: "all var(--duration-fast)",
                            transform: active ? "translateY(-4px)" : "none"
                        }}>
                            {t.icon}
                        </div>

                        {active && (
                            <span className="font-mono" style={{
                                position: "absolute", bottom: "8px", fontSize: "10px",
                                color: "var(--accent)", fontWeight: "bold"
                            }}>
                                {t.label}
                            </span>
                        )}

                        {t.badge && !active && (
                            <div style={{
                                position: "absolute", top: "14px", right: "12px",
                                width: "6px", height: "6px", borderRadius: "50%",
                                backgroundColor: "var(--accent)"
                            }} />
                        )}

                        {active && (
                            <div style={{
                                position: "absolute", bottom: "2px",
                                width: "4px", height: "4px", borderRadius: "50%",
                                backgroundColor: "var(--accent)"
                            }} />
                        )}
                    </a>
                );
            })}
        </nav>
    );
}

// Shared tab config for Sidebar
export { TABS };
