import { useEffect, useState } from "react";
import {
  BrowserRouter, Routes, Route, useLocation, Navigate
} from "react-router-dom";

import Landing from "./pages/Landing";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import MoodLog from "./pages/MoodLog";
import Assessment from "./pages/Assessment";
import CopingHub from "./pages/CopingHub";
import CopingDetail from "./pages/CopingDetail";
import Trends from "./pages/Trends";
import PeerConnect from "./pages/PeerConnect";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";

import CrisisSheet from "./components/CrisisSheet";
import BottomNav from "./components/BottomNav";
import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";
import { NavigationProvider } from "./components/NavigationProvider";
import DevPreview from "./components/DevPreview";

// ─── App Layout (the /app/* shell) ──────────────────────────────
function AppLayout({ theme, onThemeToggle }: { theme: string; onThemeToggle: () => void }) {
  const location = useLocation();
  const path = location.pathname;

  // Paths where chrome (nav, sidebar) is hidden
  const hideChrome = (
    path === "/app/onboarding" ||
    path === "/app/log" ||
    path.startsWith("/app/chat/")
  );

  return (
    <div id="app-layout" style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      {/* Sidebar — hidden on mobile, shown tablet+ */}
      {!hideChrome && (
        <Sidebar theme={theme} onThemeToggle={onThemeToggle} />
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <NavigationProvider>
          <main className="main-content">
            <Routes>
              {/* /app root → home */}
              <Route path="" element={<Navigate to="home" replace />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="home" element={<Home />} />
              <Route path="log" element={<MoodLog />} />
              <Route path="assessment" element={<Assessment />} />
              <Route path="coping" element={<CopingHub />} />
              <Route path="coping/:id" element={<CopingDetail />} />
              <Route path="trends" element={<Trends />} />
              <Route path="connect" element={<PeerConnect />} />
              <Route path="chat/:id" element={<Chat />} />
              <Route path="you" element={<Profile />} />
            </Routes>
          </main>

          {/* Bottom nav — mobile only */}
          {!hideChrome && (
            <div style={{ display: "block" }}>
              <BottomNav />
            </div>
          )}

          {/* Crisis sheet — always */}
          {!hideChrome && <CrisisSheet />}
        </NavigationProvider>
      </div>

      {/* Right panel — 1280px+ */}
      {!hideChrome && (
        <div style={{ padding: "32px 24px 32px 0" }}>
          <RightPanel />
        </div>
      )}
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────
function Root() {
  const [theme, setTheme] = useState(
    localStorage.getItem("calmpulse-theme") || "dark"
  );

  useEffect(() => {
    if (theme === "light") document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");
  }, [theme]);

  useEffect(() => {
    const scale = localStorage.getItem("calmpulse-font-scale") || "1";
    document.documentElement.style.setProperty("--font-scale", scale);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("calmpulse-theme", next);
    if (next === "light") document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");
  };

  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Landing />} />

      {/* Splash / legacy entry */}
      <Route path="/splash" element={<Splash />} />

      {/* The app shell — all /app/* routes */}
      <Route path="/app/*" element={
        <AppLayout theme={theme} onThemeToggle={toggleTheme} />
      } />

      {/* Redirect old paths that didn't have /app prefix */}
      <Route path="/home" element={<Navigate to="/app/home" replace />} />
      <Route path="/log" element={<Navigate to="/app/log" replace />} />
      <Route path="/assessment" element={<Navigate to="/app/assessment" replace />} />
      <Route path="/coping" element={<Navigate to="/app/coping" replace />} />
      <Route path="/trends" element={<Navigate to="/app/trends" replace />} />
      <Route path="/connect" element={<Navigate to="/app/connect" replace />} />
      <Route path="/you" element={<Navigate to="/app/you" replace />} />
      <Route path="/onboarding" element={<Navigate to="/app/onboarding" replace />} />
      <Route path="/chat/:id" element={<Navigate to="/app/chat/:id" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Root />
      {/* Dev preview panel — only renders in development */}
      {import.meta.env.DEV && <DevPreview />}
    </BrowserRouter>
  );
}
