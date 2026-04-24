export const analyzeEntry = async (_journalText: string) => {
    return { distressLevel: "low", autoTags: ["general"] };
};

export const interpretScore = async (_type: string, _score: number) => {
    return { message: "Keep checking in. Every entry helps.", copingPriorities: ["breathing"] };
};

export const getCopingRecs = async (_moodScore: number, _tags: string[]) => {
    return { recommendations: ["breathing", "grounding"] };
};

export const detectPattern = async (_logs: any[]) => {
    return { insight: "Keep logging to unlock insights." };
};

export const matchPeers = async (_tags: string[]) => {
    return { matches: [] };
};

export const moderateMessage = async (_messageText: string) => {
    return { flagged: false, reason: null };
};
