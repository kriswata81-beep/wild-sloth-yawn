"use client";
import { useState, useEffect, useRef } from "react";

const RED = "#e05c5c";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const GREEN_DIM = "rgba(63,185,80,0.5)";

function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed || "makoa")}`;
}

// Mock nearby brothers for 911
const MOCK_BROTHERS_911 = [
  { handle: "KaiMakoa", zip: "96707", distance: "0.4 mi", skill: "First Aid Certified", tier: "nakoa" },
  { handle: "AlohaKoa", zip: "96707", distance: "0.8 mi", skill: "EMT", tier: "mana" },
  { handle: "WestOahu7", zip: "96706", distance: "1.2 mi", skill: "Mechanic", tier: "nakoa" },
  { handle: "MaluBrother", zip: "96707", distance: "1.5 mi", skill: "Security", tier: "nakoa" },
  { handle: "KapoleiXI", zip: "96707", distance: "2.1 mi", skill: "Medic", tier: "alii" },
];

// Mock matched brothers for 411
const MOCK_BROTHERS_411: Record<string, Array<{ handle: string; skill: string; tier: string; response: string }>> = {
  default: [
    { handle: "BuilderKoa", skill: "Business Strategy", tier: "mana", response: "I can help with that. DM me on Telegram." },
    { handle: "AlohaKoa", skill: "Operations", tier: "mana", response: "Been through this. Let's connect Wednesday." },
    { handle: "KapoleiXI", skill: "Leadership", tier: "alii", response: "Bring this to the War Room. I'll address it." },
  ],
  trade: [
    { handle: "TradeKoa808", skill: "Plumbing & HVAC", tier: "mana", response: "I run a crew. Can help you price this out." },
    { handle: "BuilderKoa", skill: "Construction", tier: "mana", response: "Got contacts. Let's talk after Wednesday training." },
    { handle: "WestOahu7", skill: "Electrical", tier: "nakoa", response: "On the service route. I can take this job." },
  ],
  business: [
    { handle: "KapoleiXI", skill: "B2B Sales", tier: "alii", response: "This is a War Room topic. I'll add it to the agenda." },
    { handle: "MaluBrother", skill: "Marketing", tier: "mana", response: "I've scaled this exact problem. DM me." },
    { handle: "AlohaKoa", skill: "Finance", tier: "mana", response: "Let's run the numbers together. Wednesday school." },
  ],
  personal: [
    { handle: "KaiMakoa", skill: "Mentorship", tier: "nakoa", response: "Brother, I've been there. Reach out anytime." },
    { handle: "MaluBrother", skill: "Accountability", tier: "mana", response: "This is what the order is for. Let's talk." },
    { handle: "KapoleiXI", skill: "Guidance", tier: "alii", response: "Come to the next full moon gathering. We'll address this." },
  ],
};

type Channel911State = "idle" | "searching" | "found" | "escalating";
type Channel411State = "idle" | "input" | "routing" | "matched";

interface EmergencyChannelProps {
  memberHandle?: string;
  memberZip?: string;
}

export default function EmergencyChannel({ memberHandle = "Brother", memberZip = "96707" }: EmergencyChannelProps) {
  // 911 state
  const [state911, setState911] = useState<Channel911State>("idle");
  const [nearbyBrothers, setNearbyBrothers] = useState<typeof MOCK_BROTHERS_911>([]);
  const [escalateTimer, setEscalateTimer] = useState(180); // 3 minutes
  const escalateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 411 state
  const [state411, setState411] = useState<Channel411State>("idle");
  const [question, setQuestion] = useState("");
  const [matchedBrothers, setMatchedBrothers] = useState<typeof MOCK_BROTHERS_411.default>([]);
  const [routed, setRouted] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (escalateRef.current) clearInterval(escalateRef.current);
    };
  }, []);

  function activate911() {
    setState911("searching");
    setNearbyBrothers([]);

    // Simulate searching for 3 seconds
    setTimeout(() => {
      setState911("found");
      setNearbyBrothers(MOCK_BROTHERS_911);

      // Start escalation countdown
      setEscalateTimer(180);
      escalateRef.current = setInterval(() => {
        setEscalateTimer(prev => {
          if (prev <= 1) {
            clearInterval(escalateRef.current!);
            setState911("escalating");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 3000);
  }

  function deactivate911() {
    setState911("idle");
    setNearbyBrothers([]);
    setEscalateTimer(180);
    if (escalateRef.current) clearInterval(escalateRef.current);
  }

  function formatTimer(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function activate411() {
    setState411("input");
    setQuestion("");
    setMatchedBrothers([]);
    setRouted(false);
  }

  function submitQuestion() {
    if (!question.trim()) return;
    setState411("routing");

    setTimeout(() => {
      // Categorize question
      const q = question.toLowerCase();
      let category = "default";
      if (q.includes("trade") || q.includes("job") || q.includes("plumb") || q.includes("electric") || q.includes("build") || q.includes("fix")) category = "trade";
      else if (q.includes("business") || q.includes("client") || q.includes("money") || q.includes("sales") || q.includes("market")) category = "business";
      else if (q.includes("family") || q.includes("personal") || q.includes("help") || q.includes("struggle") || q.includes("hard")) category = "personal";

      setMatchedBrothers(MOCK_BROTHERS_411[category] || MOCK_BROTHERS_411.default);
      setState411("matched");
    }, 2000);
  }

  function deactivate411() {
    setState411("idle");
    setQuestion("");
    setMatchedBrothers([]);
    setRouted(false);
  }

  const tierColors: Record<string, string> = { alii: "#b08e50", mana: BLUE, nakoa: GREEN };

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      <style>{`
        @keyframes pulse911 { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.15); } }
        @keyframes redGlow { 0%, 100% { box-shadow: 0 0 0px 0px rgba(224,92,92,0); } 50% { box-shadow: 0 0 20px 6px rgba(224,92,92,0.2); } }
        @keyframes blueGlow { 0%, 100% { box-shadow: 0 0 0px 0px rgba(88,166,255,0); } 50% { box-shadow: 0 0 16px 4px rgba(88,166,255,0.15); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes brotherIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* ─── 808-911 EMERGENCY ─── */}
      <div style={{
        background: state911 !== "idle" ? "rgba(224,92,92,0.07)" : "rgba(0,0,0,0.3)",
        border: `1px solid ${state911 !== "idle" ? "rgba(224,92,92,0.45)" : "rgba(224,92,92,0.2)"}`,
        borderRadius: "12px",
        padding: "20px",
        animation: state911 === "found" || state911 === "escalating" ? "redGlow 2s ease-in-out infinite" : "none",
        transition: "all 0.4s",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
          <div style={{
            width: "46px", height: "46px", borderRadius: "50%",
            background: "rgba(224,92,92,0.12)",
            border: `1px solid rgba(224,92,92,0.4)`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{
              fontSize: "1.3rem",
              animation: state911 === "searching" || state911 === "found" ? "pulse911 1.2s ease-in-out infinite" : "none",
            }}>🚨</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: RED, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em" }}>808-911</p>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.45rem" }}>Emergency peer response</p>
          </div>
          {state911 !== "idle" && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: RED, animation: "pulse911 0.8s ease-in-out infinite" }} />
              <span style={{ color: RED, fontSize: "0.42rem", letterSpacing: "0.1em" }}>
                {state911 === "searching" ? "SEARCHING" : state911 === "escalating" ? "ESCALATED" : "LIVE"}
              </span>
            </div>
          )}
        </div>

        <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.5rem", lineHeight: 1.7, marginBottom: "14px" }}>
          Car broke down, medical, safety concern — activate 911 and the nearest Nā Koa responds within minutes.
        </p>

        {/* IDLE state */}
        {state911 === "idle" && (
          <button
            onClick={activate911}
            style={{
              width: "100%",
              background: "transparent",
              border: `1px solid ${RED}`,
              color: RED,
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              padding: "13px",
              cursor: "pointer",
              borderRadius: "8px",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.2s",
            }}
          >
            ACTIVATE 911
          </button>
        )}

        {/* SEARCHING state */}
        {state911 === "searching" && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "18px", height: "18px", border: `2px solid ${RED}`, borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              <p style={{ color: RED, fontSize: "0.52rem", letterSpacing: "0.15em" }}>Searching for nearest brothers...</p>
            </div>
            <p style={{ color: "rgba(224,92,92,0.4)", fontSize: "0.42rem" }}>Scanning {memberZip} and surrounding ZIP codes</p>
          </div>
        )}

        {/* FOUND state */}
        {(state911 === "found" || state911 === "escalating") && (
          <div>
            <div style={{
              background: "rgba(224,92,92,0.08)", border: "1px solid rgba(224,92,92,0.25)",
              borderRadius: "8px", padding: "12px 14px", marginBottom: "14px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <p style={{ color: RED, fontSize: "0.52rem", fontWeight: 700 }}>
                  🚨 Alert sent to {nearbyBrothers.length} brothers
                </p>
                <p style={{ color: "rgba(224,92,92,0.6)", fontSize: "0.42rem", marginTop: "2px" }}>
                  XI and nearest brothers notified. Stay put.
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: state911 === "escalating" ? "#f0883e" : RED, fontSize: "0.65rem", fontWeight: 700 }}>
                  {state911 === "escalating" ? "ESCALATED" : formatTimer(escalateTimer)}
                </p>
                <p style={{ color: "rgba(224,92,92,0.4)", fontSize: "0.38rem" }}>
                  {state911 === "escalating" ? "XI alerted" : "until XI escalation"}
                </p>
              </div>
            </div>

            {state911 === "escalating" && (
              <div style={{
                background: "rgba(240,136,62,0.08)", border: "1px solid rgba(240,136,62,0.3)",
                borderRadius: "6px", padding: "10px 14px", marginBottom: "12px",
              }}>
                <p style={{ color: "#f0883e", fontSize: "0.5rem", lineHeight: 1.6 }}>
                  ⚠ No response in 3 minutes. XI has been escalated. Emergency protocol active.
                </p>
              </div>
            )}

            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "10px" }}>
              NEAREST BROTHERS
            </p>
            <div style={{ display: "grid", gap: "8px", marginBottom: "14px" }}>
              {nearbyBrothers.map((b, i) => (
                <div key={b.handle} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(224,92,92,0.12)",
                  borderRadius: "8px",
                  animation: `brotherIn 0.4s ease ${i * 0.1}s both`,
                }}>
                  <img src={dicebearUrl(b.handle)} alt={b.handle} style={{ width: "30px", height: "30px", borderRadius: "50%", border: `1px solid ${tierColors[b.tier]}40`, background: "#0a0d12", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#e8e0d0", fontSize: "0.52rem" }}>{b.handle}</p>
                    <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.4rem" }}>{b.skill}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: RED, fontSize: "0.45rem" }}>{b.distance}</p>
                    <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.38rem" }}>ZIP {b.zip}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={deactivate911}
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(232,224,208,0.3)",
                fontSize: "0.45rem",
                letterSpacing: "0.15em",
                padding: "10px",
                cursor: "pointer",
                borderRadius: "6px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              STAND DOWN — I AM SAFE
            </button>
          </div>
        )}
      </div>

      {/* ─── 808-411 KNOWLEDGE ─── */}
      <div style={{
        background: state411 !== "idle" ? "rgba(88,166,255,0.06)" : "rgba(0,0,0,0.3)",
        border: `1px solid ${state411 !== "idle" ? "rgba(88,166,255,0.4)" : "rgba(88,166,255,0.15)"}`,
        borderRadius: "12px",
        padding: "20px",
        animation: state411 === "matched" ? "blueGlow 3s ease-in-out infinite" : "none",
        transition: "all 0.4s",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
          <div style={{
            width: "46px", height: "46px", borderRadius: "50%",
            background: "rgba(88,166,255,0.08)",
            border: `1px solid rgba(88,166,255,0.3)`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontSize: "1.3rem" }}>📚</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: BLUE, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em" }}>808-411</p>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.45rem" }}>Knowledge peer channel</p>
          </div>
          {state411 !== "idle" && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: BLUE, animation: "pulse911 1.5s ease-in-out infinite" }} />
              <span style={{ color: BLUE, fontSize: "0.42rem", letterSpacing: "0.1em" }}>
                {state411 === "routing" ? "ROUTING" : state411 === "matched" ? "MATCHED" : "OPEN"}
              </span>
            </div>
          )}
        </div>

        <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.5rem", lineHeight: 1.7, marginBottom: "14px" }}>
          Need advice, a referral, or a second opinion? Post to 411 and the order answers.
        </p>

        {/* IDLE state */}
        {state411 === "idle" && (
          <button
            onClick={activate411}
            style={{
              width: "100%",
              background: "transparent",
              border: `1px solid ${BLUE}`,
              color: BLUE,
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              padding: "13px",
              cursor: "pointer",
              borderRadius: "8px",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.2s",
            }}
          >
            ASK THE ORDER
          </button>
        )}

        {/* INPUT state */}
        {state411 === "input" && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
            <p style={{ color: "rgba(88,166,255,0.6)", fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "8px" }}>
              YOUR QUESTION
            </p>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="What do you need from the order? Trade help, business advice, personal guidance..."
              rows={3}
              style={{
                width: "100%",
                background: "rgba(0,0,0,0.4)",
                border: `1px solid rgba(88,166,255,0.25)`,
                borderRadius: "6px",
                color: "#e8e0d0",
                fontSize: "0.52rem",
                padding: "12px",
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none",
                resize: "none",
                lineHeight: 1.7,
                marginBottom: "12px",
              }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={submitQuestion}
                disabled={!question.trim()}
                style={{
                  flex: 1,
                  background: question.trim() ? BLUE : "transparent",
                  border: `1px solid ${BLUE}`,
                  color: question.trim() ? "#000" : "rgba(88,166,255,0.4)",
                  fontSize: "0.48rem",
                  letterSpacing: "0.2em",
                  padding: "11px",
                  cursor: question.trim() ? "pointer" : "not-allowed",
                  borderRadius: "6px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: question.trim() ? 700 : 400,
                  transition: "all 0.2s",
                }}
              >
                ROUTE TO PEERS
              </button>
              <button
                onClick={deactivate411}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(232,224,208,0.3)",
                  fontSize: "0.45rem",
                  padding: "11px 14px",
                  cursor: "pointer",
                  borderRadius: "6px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* ROUTING state */}
        {state411 === "routing" && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "18px", height: "18px", border: `2px solid ${BLUE}`, borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              <p style={{ color: BLUE, fontSize: "0.52rem", letterSpacing: "0.15em" }}>Routing to peer board...</p>
            </div>
            <p style={{ color: "rgba(88,166,255,0.4)", fontSize: "0.42rem" }}>Matching your question to brothers with relevant skills</p>
          </div>
        )}

        {/* MATCHED state */}
        {state411 === "matched" && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
            {/* Question recap */}
            <div style={{
              background: "rgba(88,166,255,0.06)", border: "1px solid rgba(88,166,255,0.2)",
              borderRadius: "6px", padding: "10px 14px", marginBottom: "14px",
            }}>
              <p style={{ color: "rgba(88,166,255,0.5)", fontSize: "0.4rem", letterSpacing: "0.15em", marginBottom: "4px" }}>YOUR QUESTION</p>
              <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.5rem", lineHeight: 1.6 }}>{question}</p>
            </div>

            {/* Confirmation */}
            <div style={{
              background: "rgba(63,185,80,0.06)", border: "1px solid rgba(63,185,80,0.25)",
              borderRadius: "6px", padding: "10px 14px", marginBottom: "14px",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span style={{ color: GREEN, fontSize: "0.7rem" }}>✓</span>
              <div>
                <p style={{ color: GREEN, fontSize: "0.5rem" }}>Routed to peer board</p>
                <p style={{ color: GREEN_DIM, fontSize: "0.42rem" }}>{matchedBrothers.length} brothers matched to your question</p>
              </div>
            </div>

            {/* Matched brothers */}
            <p style={{ color: "rgba(88,166,255,0.5)", fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "10px" }}>
              MATCHED BROTHERS
            </p>
            <div style={{ display: "grid", gap: "10px", marginBottom: "14px" }}>
              {matchedBrothers.map((b, i) => (
                <div key={b.handle} style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(88,166,255,0.12)",
                  borderRadius: "8px",
                  padding: "12px",
                  animation: `brotherIn 0.4s ease ${i * 0.12}s both`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <img src={dicebearUrl(b.handle)} alt={b.handle} style={{ width: "28px", height: "28px", borderRadius: "50%", border: `1px solid ${tierColors[b.tier]}40`, background: "#0a0d12", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#e8e0d0", fontSize: "0.52rem" }}>{b.handle}</p>
                      <p style={{ color: tierColors[b.tier], fontSize: "0.4rem", letterSpacing: "0.08em" }}>{b.skill}</p>
                    </div>
                    <span style={{ color: tierColors[b.tier], fontSize: "0.38rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{b.tier}</span>
                  </div>
                  <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.48rem", lineHeight: 1.6, fontStyle: "italic", paddingLeft: "38px" }}>
                    &ldquo;{b.response}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            {/* Curriculum note */}
            {!routed && (
              <div style={{
                background: "rgba(176,142,80,0.05)", border: "1px solid rgba(176,142,80,0.15)",
                borderRadius: "6px", padding: "10px 14px", marginBottom: "12px",
              }}>
                <p style={{ color: "rgba(176,142,80,0.6)", fontSize: "0.45rem", lineHeight: 1.6 }}>
                  📋 Unfulfilled requests are added to Wednesday school curriculum. XI reviews all 411 posts weekly.
                </p>
              </div>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => { setRouted(true); }}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: `1px solid ${BLUE}40`,
                  color: BLUE,
                  fontSize: "0.45rem",
                  letterSpacing: "0.15em",
                  padding: "10px",
                  cursor: "pointer",
                  borderRadius: "6px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                MARK RESOLVED
              </button>
              <button
                onClick={deactivate411}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(232,224,208,0.3)",
                  fontSize: "0.45rem",
                  padding: "10px 14px",
                  cursor: "pointer",
                  borderRadius: "6px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                CLOSE
              </button>
            </div>

            {routed && (
              <p style={{ color: GREEN, fontSize: "0.45rem", textAlign: "center", marginTop: "10px", letterSpacing: "0.1em" }}>
                ✓ Marked resolved. The order holds.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
