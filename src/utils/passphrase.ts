// Wordlist for generating passphrases
const WORDS = [
    "amber", "basin", "bloom", "brook", "cabin", "cedar", "cloud", "coral",
    "creek", "crest", "dunes", "emmer", "ember", "fable", "field", "fjord",
    "flint", "flora", "flume", "forge", "frost", "glade", "glyph", "grain",
    "grove", "haven", "heath", "hollow", "heron", "inlet", "ivory", "kelp",
    "knoll", "lagoon", "larch", "layered", "lemon", "light", "linen", "lotus",
    "lunar", "maple", "marsh", "matte", "mellow", "mesa", "mist", "mocha",
    "moon", "mossy", "mound", "naive", "nimbus", "north", "ochre", "olive",
    "onyx", "open", "orbit", "owl", "parch", "pasture", "petal", "pine",
    "plain", "plume", "pool", "poppy", "porch", "quiet", "quill", "rain",
    "range", "rapid", "reed", "ridge", "river", "rock", "rowan", "rust",
    "sage", "salt", "sand", "seam", "sedge", "shade", "shale", "shore",
    "silk", "silver", "slate", "slope", "snow", "soil", "solace", "south",
    "spell", "spire", "still", "stone", "storm", "straw", "stream", "tide",
    "timber", "trace", "trail", "vale", "vast", "vault", "veil", "vine",
    "violet", "wade", "wane", "wave", "weld", "west", "wild", "wind",
    "winter", "wisp", "wood", "wool", "wren", "yarn"
];

export function generatePassphrase(): string {
    const pool = [...WORDS].sort(() => Math.random() - 0.5);
    return pool.slice(0, 4).join("-");
}

export function savePassphrase(passphrase: string): void {
    localStorage.setItem("calmpulse-passphrase", passphrase);
}

export function getPassphrase(): string | null {
    return localStorage.getItem("calmpulse-passphrase");
}

// ─── Passphrase-namespaced data helpers ───────────────────────────

const PASSPHRASE_REGISTRY = "calmpulse-passphrases";

/** Check if a passphrase has been registered */
export function passphraseExists(passphrase: string): boolean {
    const registry: string[] = JSON.parse(localStorage.getItem(PASSPHRASE_REGISTRY) || "[]");
    return registry.includes(passphrase.trim().toLowerCase());
}

/** Create an empty data profile for a new passphrase */
export function createUserProfile(passphrase: string): void {
    const dataKey = `calmpulse-data-${passphrase}`;
    if (!localStorage.getItem(dataKey)) {
        localStorage.setItem(dataKey, JSON.stringify({
            logs: [],
            createdAt: new Date().toISOString(),
        }));
    }
}

/** Get the full user profile for a passphrase, or null if not found */
export function getUserProfile(passphrase: string): Record<string, any> | null {
    const dataKey = `calmpulse-data-${passphrase}`;
    const raw = localStorage.getItem(dataKey);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

/** Save a specific piece of data under a passphrase namespace */
export function saveUserData(passphrase: string, key: string, data: any): void {
    const profile = getUserProfile(passphrase) || { logs: [], createdAt: new Date().toISOString() };
    profile[key] = data;
    const dataKey = `calmpulse-data-${passphrase}`;
    localStorage.setItem(dataKey, JSON.stringify(profile));
}

/** Read a specific piece of data from a passphrase namespace */
export function getUserData(passphrase: string, key: string): any {
    const profile = getUserProfile(passphrase);
    if (!profile) return null;
    return profile[key] ?? null;
}
