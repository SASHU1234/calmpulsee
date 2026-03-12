import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ─── Route definitions ───────────────────────────────────────────
const SECTIONS = [
    {
        id: "website",
        label: "Website",
        screens: [
            { name: "Landing Page", path: "/" },
        ]
    },
    {
        id: "app",
        label: "Mobile App",
        groups: [
            {
                label: "Home",
                screens: [
                    { name: "Home (with entries)", path: "/app/home" },
                    { name: "Home (empty state)", path: "/app/home?state=empty" },
                    { name: "Home (first login)", path: "/app/home?state=new" },
                ]
            },
            {
                label: "Onboarding",
                screens: [
                    { name: "Consent screen", path: "/app/onboarding?step=0" },
                    { name: "Welcome", path: "/app/onboarding?step=1" },
                    { name: "Mood check", path: "/app/onboarding?step=2" },
                    { name: "Needs selection", path: "/app/onboarding?step=3" },
                ]
            },
            {
                label: "Mood Log",
                screens: [
                    { name: "Log (blank)", path: "/app/log" },
                    { name: "Log (pre-filled)", path: "/app/log?state=filled" },
                    { name: "Entry confirmation", path: "/app/log?state=confirmed" },
                ]
            },
            {
                label: "Assessment",
                screens: [
                    { name: "Assessment home", path: "/app/assessment" },
                    { name: "PHQ-9 in progress (Q4)", path: "/app/assessment?quiz=phq9&q=4" },
                    { name: "GAD-7 in progress (Q3)", path: "/app/assessment?quiz=gad7&q=3" },
                    { name: "Results (minimal)", path: "/app/assessment?results=1&score=3&type=PHQ-9" },
                    { name: "Results (moderate)", path: "/app/assessment?results=1&score=12&type=PHQ-9" },
                    { name: "Results (severe)", path: "/app/assessment?results=1&score=22&type=PHQ-9" },
                    { name: "Assessment history", path: "/app/assessment?view=history" },
                ]
            },
            {
                label: "Coping Hub",
                screens: [
                    { name: "Coping (default)", path: "/app/coping" },
                    { name: "Coping (saved filter)", path: "/app/coping?filter=saved" },
                    { name: "Exercise detail", path: "/app/coping/1" },
                    { name: "Exercise (timer running)", path: "/app/coping/1?state=timer" },
                ]
            },
            {
                label: "Trends",
                screens: [
                    { name: "Trends (7 days)", path: "/app/trends?range=7" },
                    { name: "Trends (30 days)", path: "/app/trends?range=30" },
                    { name: "Trends (empty state)", path: "/app/trends?state=empty" },
                ]
            },
            {
                label: "Peer Connect",
                screens: [
                    { name: "Not opted in", path: "/app/connect?state=off" },
                    { name: "Tag selection", path: "/app/connect?state=setup" },
                    { name: "Matched list", path: "/app/connect?state=matched" },
                    { name: "Chat screen", path: "/app/chat/A3F1" },
                    { name: "Chat (flagged message)", path: "/app/chat/A3F1?state=flagged" },
                ]
            },
            {
                label: "Crisis & Safety",
                screens: [
                    { name: "Crisis sheet (open)", path: "/app/home?crisis=open" },
                    { name: "Safety plan builder", path: "/app/you" },
                ]
            },
            {
                label: "Profile",
                screens: [
                    { name: "Profile (default)", path: "/app/you" },
                    { name: "Milestones", path: "/app/you?tab=milestones" },
                    { name: "Notification settings", path: "/app/you?tab=reminders" },
                    { name: "Clear data confirm", path: "/app/you?modal=clear" },
                ]
            },
        ]
    }
];

// ─── Viewport sizes for desktop switcher ────────────────────────
const VIEWPORTS = [
    { id: "mobile", label: "Mobile", icon: "📱", width: 390 },
    { id: "tablet", label: "Tablet", icon: "📟", width: 768 },
    { id: "desktop", label: "Desktop", icon: "🖥", width: 1280 },
] as const;

type ViewportId = typeof VIEWPORTS[number]["id"];

// ─── Context for other components to consume viewport + state ────
let _viewport: ViewportId = "desktop";
let _previewMode = false;
export const getPreviewViewport = () => _viewport;
export const isPreviewMode = () => _previewMode;

// ─── Main DevPreview component ───────────────────────────────────
export default function DevPreview() {
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [viewport, setViewport] = useState<ViewportId>("desktop");
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    // Update desktop detection on resize
    useEffect(() => {
        const handler = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    // Sync exports
    useEffect(() => {
        _viewport = viewport;
        _previewMode = open;
    }, [viewport, open]);

    const toggleGroup = (label: string) => {
        setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        if (!isDesktop) setOpen(false);
    };

    const currentPath = location.pathname + location.search;

    // ── Pill trigger ─────────────────────────────────────────────
    const Pill = () => (
        <button
            onClick={() => setOpen(o => !o)}
            className="font-mono"
            style={{
                position: "fixed",
                bottom: isDesktop ? "24px" : "80px",
                right: "16px",
                zIndex: 9998,
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "var(--text-xs)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "all var(--duration-fast)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-muted)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            }}
        >
            <span style={{ fontSize: "10px" }}>◉</span>
            Dev Preview
        </button>
    );

    // ── Panel content ────────────────────────────────────────────
    const PanelContent = () => (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: "var(--surface)",
        }}>
            {/* Header */}
            <div style={{
                padding: "20px 20px 16px",
                borderBottom: "1px solid var(--border)",
                flexShrink: 0,
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <div className="font-mono" style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--accent)",
                            marginBottom: "2px"
                        }}>
                            Preview Mode
                        </div>
                        <div className="font-mono" style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--text-muted)"
                        }}>
                            Tap any screen to jump there
                        </div>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        style={{
                            width: "28px", height: "28px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: "6px",
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            color: "var(--text-muted)",
                            fontSize: "14px",
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Viewport switcher — desktop only */}
                {isDesktop && (
                    <div style={{
                        display: "flex",
                        gap: "6px",
                        marginTop: "16px",
                        padding: "4px",
                        backgroundColor: "var(--card)",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                    }}>
                        {VIEWPORTS.map(vp => (
                            <button
                                key={vp.id}
                                onClick={() => setViewport(vp.id)}
                                className="font-mono"
                                style={{
                                    flex: 1,
                                    height: "28px",
                                    borderRadius: "7px",
                                    fontSize: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "4px",
                                    cursor: "pointer",
                                    transition: "all var(--duration-fast)",
                                    backgroundColor: viewport === vp.id ? "var(--surface)" : "transparent",
                                    border: viewport === vp.id ? "1px solid var(--border)" : "1px solid transparent",
                                    color: viewport === vp.id ? "var(--text)" : "var(--text-muted)",
                                }}
                            >
                                <span style={{ fontSize: "10px" }}>{vp.icon}</span>
                                <span>{vp.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Route list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }} className="hide-scrollbar">
                {SECTIONS.map(section => (
                    <div key={section.id}>
                        {/* Section label */}
                        <div className="font-mono" style={{
                            fontSize: "10px",
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            padding: "8px 20px 4px",
                            opacity: 0.6,
                        }}>
                            {section.label}
                        </div>

                        {/* Website section — flat list */}
                        {"screens" in section && Array.isArray(section.screens) && (section.screens as { name: string; path: string }[]).map(screen => (
                            <RouteRow
                                key={screen.path}
                                name={screen.name}
                                path={screen.path}
                                isActive={currentPath === screen.path}
                                onClick={() => handleNavigate(screen.path)}
                            />
                        ))}

                        {/* App section — grouped */}
                        {"groups" in section && section.groups?.map(group => (
                            <div key={group.label}>
                                {/* Group header */}
                                <button
                                    onClick={() => toggleGroup(group.label)}
                                    className="font-mono"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "6px 20px",
                                        fontSize: "10px",
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        cursor: "pointer",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        textAlign: "left",
                                    }}
                                >
                                    {group.label}
                                    <span style={{
                                        transform: collapsed[group.label] ? "rotate(-90deg)" : "rotate(0deg)",
                                        transition: "transform var(--duration-fast)",
                                        display: "inline-block",
                                        fontSize: "8px"
                                    }}>▼</span>
                                </button>

                                {/* Group routes */}
                                {!collapsed[group.label] && group.screens.map(screen => (
                                    <RouteRow
                                        key={screen.path}
                                        name={screen.name}
                                        path={screen.path}
                                        isActive={currentPath.startsWith(screen.path.split("?")[0]) && screen.path.includes("?")
                                            ? currentPath === screen.path
                                            : currentPath === screen.path}
                                        onClick={() => handleNavigate(screen.path)}
                                        indent
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{
                padding: "12px 20px 16px",
                borderTop: "1px solid var(--border)",
                flexShrink: 0,
            }}>
                <div className="font-mono" style={{
                    fontSize: "10px",
                    color: "var(--text-muted)",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                }}>
                    <span style={{
                        display: "inline-block",
                        width: "6px", height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "var(--accent)"
                    }} />
                    Only renders in DEV mode
                </div>
                <button
                    className="font-mono"
                    onClick={() => {
                        // Remove only dev-injected preview keys, not real data
                        const keys = Object.keys(localStorage).filter(k => k.startsWith("dev-preview-"));
                        keys.forEach(k => localStorage.removeItem(k));
                        alert("Dev mock data cleared.");
                    }}
                    style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--danger)",
                        textDecoration: "none",
                        cursor: "pointer",
                        backgroundColor: "transparent",
                        border: "none",
                        padding: 0,
                    }}
                >
                    Reset all mock data
                </button>
            </div>
        </div>
    );

    // ── Panel overlays ───────────────────────────────────────────
    const MobilePanel = () => (
        <>
            {/* Backdrop */}
            <div
                onClick={() => setOpen(false)}
                style={{
                    position: "fixed", inset: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 9999,
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none",
                    transition: "opacity var(--duration-base)",
                }}
            />
            {/* Sheet */}
            <div style={{
                position: "fixed",
                bottom: 0, left: 0, right: 0,
                height: "85vh",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
                overflow: "hidden",
                zIndex: 10000,
                transform: open ? "translateY(0)" : "translateY(100%)",
                transition: "transform var(--duration-base) var(--ease-out)",
                boxShadow: "0 -8px 40px rgba(0,0,0,0.3)",
            }}>
                {/* Drag handle */}
                <div style={{
                    position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)",
                    width: "32px", height: "4px",
                    backgroundColor: "var(--border)",
                    borderRadius: "2px",
                    zIndex: 1,
                }} />
                <PanelContent />
            </div>
        </>
    );

    const DesktopPanel = () => (
        <>
            {/* Backdrop */}
            <div
                onClick={() => setOpen(false)}
                style={{
                    position: "fixed", inset: 0,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    zIndex: 9999,
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none",
                    transition: "opacity var(--duration-base)",
                }}
            />
            {/* Drawer */}
            <div style={{
                position: "fixed",
                top: 0, right: 0, bottom: 0,
                width: "320px",
                zIndex: 10000,
                transform: open ? "translateX(0)" : "translateX(100%)",
                transition: "transform var(--duration-base) var(--ease-out)",
                boxShadow: "-8px 0 40px rgba(0,0,0,0.25)",
                borderLeft: "1px solid var(--border)",
                overflow: "hidden",
            }}>
                <PanelContent />
            </div>
        </>
    );

    return (
        <>
            <Pill />
            {isDesktop ? <DesktopPanel /> : <MobilePanel />}
        </>
    );
}

// ─── Route row ––––––––––––––––––––––––––––––––––––––––––––––────
function RouteRow({
    name,
    path,
    isActive,
    onClick,
    indent = false,
}: {
    name: string;
    path: string;
    isActive: boolean;
    onClick: () => void;
    indent?: boolean;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: "100%",
                textAlign: "left",
                padding: `8px 20px 8px ${indent ? "28px" : "20px"}`,
                backgroundColor: hovered ? "var(--card)" : "transparent",
                borderLeft: isActive ? "3px solid var(--accent)" : "3px solid transparent",
                border: "none",
                cursor: "pointer",
                transition: "all var(--duration-fast)",
                display: "block",
            }}
        >
            <div style={{
                fontSize: "var(--text-sm)",
                fontFamily: "'Epilogue', sans-serif",
                color: isActive ? "var(--accent)" : "var(--text)",
                marginBottom: "2px",
                lineHeight: 1.3,
            }}>
                {name}
            </div>
            <div className="font-mono" style={{
                fontSize: "10px",
                color: "var(--text-muted)",
                letterSpacing: "0.02em",
            }}>
                {path}
            </div>
        </button>
    );
}
