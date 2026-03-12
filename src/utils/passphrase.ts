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
