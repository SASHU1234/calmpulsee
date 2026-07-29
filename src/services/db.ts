import { db } from "../lib/firebase";
import { collection, query, where, getDocs, addDoc, orderBy, Timestamp, doc, getDoc, setDoc } from "firebase/firestore";

// ─── Passphrase Registration (Firestore-backed) ──────────────────

/**
 * Registers a passphrase → userId mapping in Firestore so it can
 * be looked up from any browser / device.
 */
export async function registerPassphrase(passphrase: string, userId: string): Promise<void> {
    if (!db) {
        console.warn("Firestore is not configured. Skipping passphrase registration.");
        return;
    }
    try {
        const docRef = doc(db, "passphrases", passphrase);
        await setDoc(docRef, { userId, createdAt: Timestamp.now() }, { merge: true });
        
        // Also update the passphrase in the database with individual user data
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
            userId,
            passphrase,
            authMethod: "anon",
            createdAt: Timestamp.now()
        }, { merge: true });
    } catch (error) {
        console.error("Error registering passphrase:", error);
    }
}

/**
 * Checks Firestore to see if a passphrase has been registered.
 * Returns the associated userId if found, or null otherwise.
 */
export async function lookupPassphrase(passphrase: string): Promise<string | null> {
    if (!db) {
        console.warn("Firestore is not configured. Skipping passphrase lookup.");
        return null;
    }
    try {
        const docRef = doc(db, "passphrases", passphrase);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            return snap.data().userId as string;
        }
        return null;
    } catch (error) {
        console.error("Error looking up passphrase:", error);
        return null;
    }
}

// ─── Logs ─────────────────────────────────────────────────────────

/**
 * Saves a mood log to Firestore for a specific user ID.
 */
export async function saveLog(userId: string, logData: any): Promise<boolean> {
    // 1. Always save locally first for immediate UI updates and offline support
    try {
        const localKey = `calmpulse-logs-${userId}`;
        const existingRaw = localStorage.getItem(localKey);
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const localEntry = {
            ...logData,
            userId,
            createdAt: new Date().toISOString(),
            id: logData.id || Date.now().toString()
        };
        existing.push(localEntry);
        localStorage.setItem(localKey, JSON.stringify(existing));
    } catch (e) {
        console.error("Local storage save failed:", e);
    }

    // 2. Try saving to Firebase
    if (!db) {
        console.warn("Firestore is not configured. Log saved locally only.");
        return true;
    }
    
    try {
        const logsRef = collection(db, "logs");
        await addDoc(logsRef, {
            ...logData,
            userId,           // Ensure isolation
            createdAt: Timestamp.now()
        });
        return true;
    } catch (error) {
        console.error("Error saving log to Firebase. Falling back to local storage:", error);
        return true; // Return true because it was saved locally
    }
}

/**
 * Fetches all logs for a specific user ID, ordered by creation date descending.
 */
export async function getUserLogs(userId: string): Promise<any[]> {
    // 1. Fetch local logs
    const localKey = `calmpulse-logs-${userId}`;
    const existingRaw = localStorage.getItem(localKey);
    let localLogs: any[] = [];
    try {
        localLogs = existingRaw ? JSON.parse(existingRaw) : [];
    } catch (e) {
        console.error("Failed to parse local logs", e);
    }

    if (!db) {
        console.warn("Firestore is not configured. Returning local logs only.");
        return sortLogs(localLogs);
    }

    // 2. Try fetching from Firebase
    try {
        const logsRef = collection(db, "logs");
        // We order by createdAt descending
        const q = query(
            logsRef, 
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        
        const firebaseLogs: any[] = [];
        snapshot.forEach((doc) => {
            firebaseLogs.push({ id: doc.id, ...doc.data() });
        });
        
        // 3. Merge local and remote logs, prioritizing Firebase data if IDs match
        const merged = new Map();
        localLogs.forEach(l => merged.set(l.id?.toString(), l));
        firebaseLogs.forEach(l => merged.set(l.id?.toString(), l));
        
        return sortLogs(Array.from(merged.values()));
    } catch (error) {
        console.error("Error fetching logs from Firebase. Returning local logs:", error);
        return sortLogs(localLogs);
    }
}

// Helper to sort merged logs
function sortLogs(logs: any[]): any[] {
    return logs.sort((a, b) => {
        const dateA = a.createdAt?.seconds ? a.createdAt.toDate().getTime() : new Date(a.createdAt || a.date || 0).getTime();
        const dateB = b.createdAt?.seconds ? b.createdAt.toDate().getTime() : new Date(b.createdAt || b.date || 0).getTime();
        return dateB - dateA;
    });
}
