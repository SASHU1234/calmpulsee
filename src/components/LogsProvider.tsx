import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { getUserLogs } from "../services/db";
import { calculateStreak, getCurrentWeeklyStatus } from "../utils/streak";

interface LogsContextValue {
    logs: any[];
    streak: number;
    weeklyStatus: boolean[];
    lastEntry: any | null;
    isLoading: boolean;
    refreshLogs: () => Promise<void>;
}

const LogsContext = createContext<LogsContextValue>({
    logs: [],
    streak: 0,
    weeklyStatus: [false, false, false, false, false, false, false],
    lastEntry: null,
    isLoading: true,
    refreshLogs: async () => {},
});

export const useLogs = () => useContext(LogsContext);

export function LogsProvider({ children }: { children: ReactNode }) {
    const { session } = useAuth();
    const [logs, setLogs] = useState<any[]>([]);
    const [streak, setStreak] = useState(0);
    const [weeklyStatus, setWeeklyStatus] = useState<boolean[]>([false, false, false, false, false, false, false]);
    const [lastEntry, setLastEntry] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = async () => {
        // Strict state clearing when logged out or no user session to prevent data leakage
        if (!session?.userId) {
            setLogs([]);
            setStreak(0);
            setWeeklyStatus([false, false, false, false, false, false, false]);
            setLastEntry(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const userLogs = await getUserLogs(session.userId);
            
            setLogs(userLogs);
            if (userLogs.length > 0) {
                setLastEntry(userLogs[0]);
            } else {
                setLastEntry(null);
            }
            
            setStreak(calculateStreak(userLogs));
            setWeeklyStatus(getCurrentWeeklyStatus(userLogs));
        } catch (error) {
            console.error("Failed to fetch logs within context", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [session?.userId]);

    return (
        <LogsContext.Provider value={{
            logs,
            streak,
            weeklyStatus,
            lastEntry,
            isLoading,
            refreshLogs: fetchLogs
        }}>
            {children}
        </LogsContext.Provider>
    );
}
