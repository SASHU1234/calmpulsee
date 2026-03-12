import { Link, useLocation, useNavigate } from "react-router-dom";
import { TABS } from "./BottomNav";

interface SidebarProps {
    theme: string;
    onThemeToggle: () => void;
}

export default function Sidebar({ theme, onThemeToggle }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();

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

            {/* Bottom — help + theme */}
            <div className="sidebar-bottom">
                <button
                    className="sidebar-help"
                    onClick={() => navigate("/app/connect")}
                >
                    <span>💚</span>
                    <span className="sidebar-label">Need Help?</span>
                </button>

                <button
                    onClick={onThemeToggle}
                    style={{
                        color: "var(--text-muted)",
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "36px",
                        width: "36px",
                        borderRadius: "8px",
                        transition: "all var(--duration-fast)"
                    }}
                    title="Toggle theme"
                >
                    {theme === "dark" ? "☀️" : "🌙"}
                </button>
            </div>
        </aside>
    );
}
