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
    if (!db) {
        console.warn("Firestore is not configured. Log will not be saved to cloud.");
        return false;
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
        console.error("Error saving log to Firebase:", error);
        return false;
    }
}

/**
 * Fetches all logs for a specific user ID, ordered by creation date descending.
 */
export async function getUserLogs(userId: string): Promise<any[]> {
    if (!db) {
        console.warn("Firestore is not configured. Cannot fetch cloud logs.");
        return [];
    }
    try {
        const logsRef = collection(db, "logs");
        // We order by createdAt descending
        const q = query(
            logsRef, 
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        
        const logs: any[] = [];
        snapshot.forEach((doc) => {
            logs.push({ id: doc.id, ...doc.data() });
        });
        
        return logs;
    } catch (error) {
        console.error("Error fetching logs from Firebase:", error);
        // If index errors happen because of orderBy, it'll fail gracefully.
        return [];
    }
}
