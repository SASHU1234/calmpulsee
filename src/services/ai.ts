export const analyzeEntry = async (journalText: string) => {
    return { distressLevel: "low", autoTags: ["general"] };
};

export const interpretScore = async (type: string, score: number) => {
    return { message: "Keep checking in. Every entry helps.", copingPriorities: ["breathing"] };
};

export const getCopingRecs = async (moodScore: number, tags: string[]) => {
    return { recommendations: ["breathing", "grounding"] };
};

export const detectPattern = async (logs: any[]) => {
    return { insight: "Keep logging to unlock insights." };
};

export const matchPeers = async (tags: string[]) => {
    return { matches: [] };
};

export const moderateMessage = async (messageText: string) => {
    return { flagged: false, reason: null };
};
