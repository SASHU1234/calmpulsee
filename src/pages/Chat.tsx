import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { moderateMessage } from "../services/ai";
import BackButton from "../components/BackButton";

export default function Chat() {
    const { id } = useParams();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hey! I saw we matched.", sender: "peer", status: "read", time: "10:00 AM" }
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMsg = { id: Date.now(), text: input, sender: "me", status: "sent", time: "Just now" };
        setMessages(prev => [...prev, newMsg]);
        setInput("");

        // AI Flagging implementation
        const flagged = await moderateMessage(input);
        if (flagged.flagged) {
            setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, flagged: true } : m));
        }

        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: "delivered" } : m));
            setTyping(true);

            setTimeout(() => {
                setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: "read" } : m));
                setTyping(false);
                setMessages(prev => [...prev, { id: Date.now() + 1, text: "Yeah, totally get that. Hang in there.", sender: "peer", status: "read", time: "Just now" }]);
            }, 2500);
        }, 800);
    };

    return (
        <div className="page-enter" style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "var(--bg)" }}>
            <header style={{ padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)", minHeight: "60px" }}>
                <BackButton fallback="/connect" label="" />
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h2 className="font-mono" style={{ fontSize: "var(--text-sm)", fontWeight: "bold" }}>Student_{id}</h2>
                    <span className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>Anonymous Peer</span>
                </div>
                <button style={{ color: "var(--text-muted)", fontSize: "var(--text-lg)" }}>⋮</button>
            </header>

            <div className="hide-scrollbar" style={{ flex: 1, padding: "24px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                {messages.map((m: any) => {
                    const isMe = m.sender === "me";
                    return (
                        <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                            <div style={{
                                maxWidth: "80%", padding: "12px 16px",
                                backgroundColor: isMe ? "var(--accent-dim)" : "var(--card)",
                                color: isMe ? "var(--text)" : "var(--text)",
                                borderRadius: "16px", border: "1px solid",
                                borderColor: isMe ? "var(--accent-dim)" : "var(--border)",
                                borderBottomRightRadius: isMe ? "4px" : "16px",
                                borderBottomLeftRadius: isMe ? "16px" : "4px",
                                fontSize: "var(--text-base)", lineHeight: 1.4,
                                position: "relative"
                            }}>
                                {m.flagged ? (
                                    <span style={{ filter: "blur(4px)", cursor: "pointer", color: "var(--danger)" }} onClick={(e) => (e.target as HTMLElement).style.filter = "none"}>
                                        Sensitive content — tap to view
                                    </span>
                                ) : m.text}
                            </div>
                            <div className="font-mono" style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                                <span>{m.time}</span>
                                {isMe && (
                                    <span style={{ color: m.status === "read" ? "var(--accent)" : "inherit" }}>
                                        {m.status === "sent" ? "✓" : "✓✓"}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}

                {typing && (
                    <div className="page-enter" style={{ display: "flex", gap: "4px", alignItems: "center", padding: "12px 16px", backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", borderBottomLeftRadius: "4px", width: "fit-content" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--text-muted)", animation: "typing 1s infinite alternate" }} />
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--text-muted)", animation: "typing 1s infinite alternate 0.2s" }} />
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--text-muted)", animation: "typing 1s infinite alternate 0.4s" }} />
                    </div>
                )}
                <div ref={endRef} />
            </div>

            <style>{`
        @keyframes typing {
          0% { transform: translateY(0); opacity: 0.5; }
          100% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

            <form onSubmit={handleSend} style={{ display: "flex", padding: "12px 16px", paddingBottom: "calc(16px + env(safe-area-inset-bottom))", backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)", alignItems: "flex-end" }}>
                <textarea
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message..."
                    rows={1}
                    style={{
                        flex: 1, minHeight: "44px", maxHeight: "120px",
                        backgroundColor: "transparent", border: "none", color: "var(--text)",
                        fontFamily: "inherit", fontSize: "var(--text-base)", resize: "none", outline: "none",
                        paddingTop: "12px"
                    }}
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "var(--accent)", color: "#000", display: "flex", justifyContent: "center", alignItems: "center", opacity: input.trim() ? 1 : 0.5, transition: "transform var(--duration-fast)", flexShrink: 0 }}
                >
                    <span style={{ transform: "rotate(-45deg)", marginLeft: "4px", marginBottom: "4px" }}>➤</span>
                </button>
            </form>
        </div>
    );
}
