import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TABS } from "./BottomNav";
import { useAuth } from "./AuthProvider";

interface SidebarProps {
    theme: string;
    onThemeToggle: () => void;
}

export default function Sidebar({ }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, session } = useAuth();
    const [showAccountMenu, setShowAccountMenu] = useState(false);

    return (
        <aside className="sidebar">
            {/* Logo — desktop only */}
            <Link to="/" style={{ textDecoration: "none" }}>
                <div className="sidebar-logo">CalmPulse</div>
            </Link>

            {/* Nav items */}
            <nav className="sidebar-nav">
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
                        <a
                            key={t.path}
                            href={t.path}
                            onClick={handleClick}
                            className={`sidebar-item ${active ? "active" : ""}`}
                        >
                            <span className="sidebar-icon">{t.icon}</span>
                            <span className="sidebar-label">{t.label}</span>
                            {t.badge && !active && <span className="sidebar-badge" />}
                        </a>
                    );
                })}
            </nav>

            {/* Bottom — help + account */}
            <div className="sidebar-bottom">
                <button
                    className="sidebar-help"
                    onClick={() => navigate("/app/connect")}
                >
                    <span>💚</span>
                    <span className="sidebar-label">Need Help?</span>
                </button>

                <div style={{ position: "relative" }}>
                    {showAccountMenu && (
                        <>
                            <div 
                                style={{ position: "fixed", inset: 0, zIndex: 9 }}
                                onClick={() => setShowAccountMenu(false)}
                            />
                            <div style={{
                                position: "absolute",
                                bottom: "100%",
                                left: 0,
                                marginBottom: "8px",
                                backgroundColor: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                padding: "4px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                zIndex: 10,
                                minWidth: "140px"
                            }}>
                                <div style={{ 
                                    padding: "8px 12px", 
                                    borderBottom: "1px solid var(--border)",
                                    marginBottom: "4px"
                                }}>
                                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Logged in as</div>
                                    <div className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {session?.authMethod === "anon" ? "Anonymous" : session?.displayName || session?.email || "User"}
                                    </div>
                                </div>
                                <button
                                    className="sidebar-item"
                                    onClick={async () => {
                                        setShowAccountMenu(false);
                                        await logout();
                                        navigate("/");
                                    }}
                                    style={{
                                        width: "100%",
                                        color: "var(--danger)",
                                        justifyContent: "flex-start",
                                        padding: "8px 12px",
                                        height: "auto",
                                        marginTop: "4px"
                                    }}
                                >
                                    Log out
                                </button>
                            </div>
                        </>
                    )}
                    <button
                        onClick={() => setShowAccountMenu(!showAccountMenu)}
                        style={{
                            color: "var(--text-muted)",
                            fontSize: "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "36px",
                            width: "36px",
                            borderRadius: "8px",
                            transition: "all var(--duration-fast)",
                            backgroundColor: showAccountMenu ? "var(--surface)" : "transparent"
                        }}
                        title="Account"
                    >
                        <span>👤</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
