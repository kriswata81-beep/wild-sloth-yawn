"use client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";

interface UnderReviewPageProps {
  applicationId?: string;
  reason?: "not_eligible" | "pending" | "suspended";
}

export default function UnderReviewPage({ applicationId, reason = "pending" }: UnderReviewPageProps) {
  const messages = {
    not_eligible: {
      title: "Formation Incomplete",
      body: "Complete your formation to access this portal. Your deposit must be confirmed and membership activated before entry is granted.",
      sub: "Contact XI if you believe this is an error.",
    },
    pending: {
      title: "Under Review",
      body: "Your pledge has been received. XI is reviewing your application. Stand by — XI responds within moments.",
      sub: "Watch for a message from the Order.",
    },
    suspended: {
      title: "Access Suspended",
      body: "Your access to this portal has been suspended. Contact XI directly to resolve your standing.",
      sub: "The Order holds its line.",
    },
  };

  const msg = messages[reason];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050709",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 24px",
      textAlign: "center",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* Crest mark */}
      <div style={{
        width: "72px",
        height: "72px",
        border: "1px solid rgba(176,142,80,0.25)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "28px",
        animation: "crestReveal 1.5s ease forwards",
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: "1px solid rgba(176,142,80,0.15)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ color: GOLD_DIM, fontSize: "1.2rem" }}>◈</span>
        </div>
      </div>

      <p style={{
        color: GOLD_DIM,
        fontSize: "0.45rem",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        marginBottom: "12px",
        animation: "fadeUp 0.6s ease 0.3s both",
      }}>
        MĀKOA ORDER
      </p>

      <h1 className="font-cormorant" style={{
        color: "#e8e0d0",
        fontSize: "2rem",
        fontWeight: 300,
        marginBottom: "20px",
        animation: "fadeUp 0.6s ease 0.4s both",
      }}>
        {msg.title}
      </h1>

      <p style={{
        color: "rgba(232,224,208,0.45)",
        fontSize: "0.58rem",
        lineHeight: 1.9,
        maxWidth: "300px",
        marginBottom: "12px",
        animation: "fadeUp 0.6s ease 0.5s both",
      }}>
        {msg.body}
      </p>

      <p style={{
        color: "rgba(176,142,80,0.3)",
        fontSize: "0.48rem",
        fontStyle: "italic",
        marginBottom: "32px",
        animation: "fadeUp 0.6s ease 0.6s both",
      }}>
        {msg.sub}
      </p>

      {applicationId && (
        <div style={{
          background: "rgba(176,142,80,0.04)",
          border: "1px solid rgba(176,142,80,0.1)",
          borderRadius: "6px",
          padding: "12px 20px",
          marginBottom: "24px",
          animation: "fadeUp 0.6s ease 0.7s both",
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.45rem", letterSpacing: "0.15em", marginBottom: "4px" }}>Application ID</p>
          <p style={{ color: GOLD, fontSize: "0.65rem", letterSpacing: "0.1em" }}>{applicationId}</p>
        </div>
      )}

      <p style={{
        color: "rgba(176,142,80,0.2)",
        fontSize: "0.45rem",
        letterSpacing: "0.2em",
        animation: "fadeUp 0.6s ease 0.8s both",
      }}>
        Advancement is earned through standing, service, and repetition.
      </p>
    </div>
  );
}
