import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { registerPassphrase, lookupPassphrase } from "../services/db";

// ─── Types ────────────────────────────────────────────────────────
export type AuthMethod = "google" | "email" | "anon";

interface Session {
    authMethod: AuthMethod;
    userId: string;
    passphrase?: string;   // only for anon users
    email?: string;        // only for email/google users
    displayName?: string;  // optional display name
}

interface AuthContextValue {
    isAuthenticated: boolean;
    session: Session | null;
    loginWithGoogle: () => void;
    loginWithEmail: (email: string) => { success: boolean; error?: string };
    createAnonSession: (passphrase: string) => void;
    loginWithPassphrase: (passphrase: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    /** Get the correct localStorage key for user data */
    getDataKey: (baseKey: string) => string;
}

const AuthContext = createContext<AuthContextValue>({
    isAuthenticated: false,
    session: null,
    loginWithGoogle: () => {},
    loginWithEmail: () => ({ success: false }),
    createAnonSession: () => {},
    loginWithPassphrase: async () => ({ success: false }),
    logout: () => {},
    getDataKey: (k) => k,
});

export const useAuth = () => useContext(AuthContext);

// ─── Session persistence keys ─────────────────────────────────────
const SESSION_KEY = "calmpulse-session";
const PASSPHRASE_REGISTRY = "calmpulse-passphrases";

// ─── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [ready, setReady] = useState(false);

    // Restore session on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(SESSION_KEY);
            if (raw) {
                const parsed: Session = JSON.parse(raw);
                setSession(parsed);
            }
        } catch {
            localStorage.removeItem(SESSION_KEY);
        }
        setReady(true);
    }, []);

    // Firebase Auth State Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const s: Session = {
                    authMethod: "google",
                    userId: user.uid,
                    email: user.email || "",
                    displayName: user.displayName || "Google User",
                };
                localStorage.setItem("calmpulse-id", s.userId);
                persistSession(s);
            } else {
                // If user becomes null in Firebase, but local session says google, log them out locally
                const raw = localStorage.getItem(SESSION_KEY);
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw);
                        if (parsed.authMethod === "google") {
                            logoutLocal();
                        }
                    } catch {}
                }
            }
        });
        return () => unsubscribe();
    }, []);

    // Persist session changes
    const persistSession = (s: Session) => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(s));
        setSession(s);
    };

    // ── Google Login (Firebase) ───────────────────────────────────
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const s: Session = {
                authMethod: "google",
                userId: user.uid,
                email: user.email || "",
                displayName: user.displayName || "Google User",
            };
            localStorage.setItem("calmpulse-id", s.userId);
            persistSession(s);
        } catch (error) {
            console.error("Google Sign-In failed", error);
        }
    };

    // ── Email Login (mock) ────────────────────────────────────────
    const loginWithEmail = (email: string): { success: boolean; error?: string } => {
        if (!email || !email.includes("@")) {
            return { success: false, error: "Please enter a valid email address." };
        }
        const s: Session = {
            authMethod: "email",
            userId: "EMAIL-" + Date.now(),
            email,
            displayName: email.split("@")[0],
        };
        localStorage.setItem("calmpulse-id", s.userId);
        persistSession(s);
        return { success: true };
    };

    // ── Create Anonymous Session ──────────────────────────────────
    const createAnonSession = async (passphrase: string) => {
        const s: Session = {
            authMethod: "anon",
            userId: "ANON-" + passphrase.replace(/-/g, "").slice(0, 8).toUpperCase(),
            passphrase,
        };

        // Register in Firestore so it can be looked up from any device
        await registerPassphrase(passphrase, s.userId);

        // Also keep a localStorage copy for backward compat
        const registry: string[] = JSON.parse(localStorage.getItem(PASSPHRASE_REGISTRY) || "[]");
        if (!registry.includes(passphrase)) {
            registry.push(passphrase);
            localStorage.setItem(PASSPHRASE_REGISTRY, JSON.stringify(registry));
        }

        localStorage.setItem("calmpulse-id", s.userId);
        persistSession(s);
    };

    // ── Login with Existing Passphrase ────────────────────────────
    const loginWithPassphrase = async (passphrase: string): Promise<{ success: boolean; error?: string }> => {
        const normalized = passphrase.trim().toLowerCase();

        // First check Firestore for the passphrase
        const storedUserId = await lookupPassphrase(normalized);

        if (!storedUserId) {
            // Fallback: check localStorage registry for legacy data
            const registry: string[] = JSON.parse(localStorage.getItem(PASSPHRASE_REGISTRY) || "[]");
            if (!registry.includes(normalized)) {
                return { success: false, error: "Passphrase not found. Check your words and try again." };
            }
        }

        // Use the Firestore userId if available, otherwise derive it
        const userId = storedUserId || "ANON-" + normalized.replace(/-/g, "").slice(0, 8).toUpperCase();

        const s: Session = {
            authMethod: "anon",
            userId,
            passphrase: normalized,
        };
        localStorage.setItem("calmpulse-id", s.userId);
        persistSession(s);
        return { success: true };
    };

    // ── Logout ────────────────────────────────────────────────────
    const logoutLocal = () => {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem("calmpulse-onboarded");
        localStorage.removeItem("calmpulse-id");
        setSession(null);
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out of Firebase", error);
        }
        logoutLocal();
    };

    // ── Data Key Helper ───────────────────────────────────────────
    // For anon users, namespace their data. For google/email, use the standard key.
    const getDataKey = (baseKey: string): string => {
        if (session?.authMethod === "anon" && session.passphrase) {
            return `${baseKey}-${session.passphrase}`;
        }
        return baseKey;
    };

    // Don't render children until session is restored
    if (!ready) {
        return (
            <div style={{
                height: "100vh", display: "flex", justifyContent: "center",
                alignItems: "center", backgroundColor: "var(--bg)"
            }}>
                <div style={{
                    width: "16px", height: "16px", borderRadius: "50%",
                    backgroundColor: "var(--accent)",
                    animation: "pulse 0.8s infinite ease-in-out"
                }} />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!session,
            session,
            loginWithGoogle,
            loginWithEmail,
            createAnonSession,
            loginWithPassphrase,
            logout,
            getDataKey,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
