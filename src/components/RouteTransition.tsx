import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function RouteTransition({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);
    const [direction, setDirection] = useState("forward");

    const pathHistory = useRef<string[]>([location.pathname]);

    useEffect(() => {
        if (location.pathname !== displayLocation.pathname) {
            // Determine direction
            let isBack = false;
            if (pathHistory.current.length > 1 && pathHistory.current[pathHistory.current.length - 2] === location.pathname) {
                isBack = true;
                pathHistory.current.pop(); // Revert
            } else {
                pathHistory.current.push(location.pathname);
            }

            setDirection(isBack ? "backward" : "forward");

            // Set timeout for animation duration
            const timer = setTimeout(() => {
                setDisplayLocation(location);
            }, 0); // Quick unmount logic can be modified, but actually we need both on screen if we want simultaneously sliding.

            return () => clearTimeout(timer);
        }
    }, [location, displayLocation]);

    // Actual simultaneous sliding requires keeping both children rendered. This gets extremely complex.
    // Instead, since the user said "No fade - pure horizontal slide", we can use CSS animation on the `.page-enter` class based on direction.

    return (
        <div key={location.pathname} className={`slide-page ${direction === "backward" ? "slide-backward" : "slide-forward"}`}>
            {children}
        </div>
    );
}
