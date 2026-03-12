import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface NavContextProps {
    direction: "forward" | "backward";
    previousPath: string | null;
    previousScreenName: string;
}

const NavContext = createContext<NavContextProps>({
    direction: "forward",
    previousPath: null,
    previousScreenName: "Back"
});

export const useNavigationContext = () => useContext(NavContext);

const ROOT_TABS = [
    "/app/home", "/app/log", "/app/coping", "/app/connect", "/app/you",
    // Legacy paths (no /app prefix) — kept for safety
    "/home", "/log", "/coping", "/connect", "/you"
];

function pathToName(path: string): string {
    if (path.includes("/home")) return "Home";
    if (path.includes("/log")) return "Mood Log";
    if (path.includes("/coping")) return "Coping Hub";
    if (path.includes("/connect")) return "Peer Connect";
    if (path.includes("/you")) return "You";
    if (path.includes("/assessment")) return "Assessment";
    if (path.includes("/chat")) return "Chat";
    if (path.includes("/trends")) return "My Trends";
    if (path === "/" || path === "/app") return "Home";
    return "Back";
}

export function NavigationProvider({ children }: { children: ReactNode }) {
    const location = useLocation();
    const [historyStack, setHistoryStack] = useState<{ path: string; name: string }[]>([
        { path: location.pathname, name: pathToName(location.pathname) }
    ]);
    const [direction, setDirection] = useState<"forward" | "backward">("forward");
    const [animKey, setAnimKey] = useState(0);

    useEffect(() => {
        setHistoryStack(prev => {
            const newPath = location.pathname;

            // Going back
            if (prev.length > 1 && prev[prev.length - 2].path === newPath) {
                setDirection("backward");
                setAnimKey(k => k + 1);
                return prev.slice(0, prev.length - 1);
            }

            // Jumping to a root tab — collapse the history stack
            if (ROOT_TABS.includes(newPath) && prev.length > 1) {
                setDirection("backward");
                setAnimKey(k => k + 1);
                return [{ path: newPath, name: pathToName(newPath) }];
            }

            // Forward navigation
            setDirection("forward");
            setAnimKey(k => k + 1);
            return [...prev, { path: newPath, name: pathToName(newPath) }];
        });
    }, [location.pathname]);

    const previousEntry = historyStack.length > 1 ? historyStack[historyStack.length - 2] : null;

    return (
        <NavContext.Provider value={{
            direction,
            previousPath: previousEntry ? previousEntry.path : null,
            previousScreenName: previousEntry ? previousEntry.name : "Back"
        }}>
            <div
                key={animKey}
                className={direction === "backward" ? "slide-enter-backward" : "slide-enter-forward"}
                style={{ width: "100%", willChange: "transform" }}
            >
                {children}
            </div>
        </NavContext.Provider>
    );
}
