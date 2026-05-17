import { ImageResponse } from "next/og";
import { adminDb } from "@/lib/firebase-admin";
import { calculateScore } from "@/utils/calculateScore";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ uid: string }>;
};

function getScoreTheme(score: number) {
  if (score <= 74) {
    return { accent: "#34d399", label: "GREEN SHIELD" };
  }
  if (score <= 85) {
    return { accent: "#38bdf8", label: "BLUE SHIELD" };
  }
  if (score <= 92) {
    return { accent: "#fbbf24", label: "GOLD SHIELD" };
  }
  return { accent: "#fb923c", label: "PREMIUM SHIELD" };
}

export async function GET(_req: Request, { params }: Params) {
  const { uid } = await params;
  const snap = await adminDb.collection("valid_profiles").doc(uid).get();

  if (!snap.exists) {
    return new Response("Profile not found", { status: 404 });
  }

  const profile = snap.data() || {};
  const username = profile.displayName || "creator";
  const score = calculateScore(profile);
  const badgeId = profile.badgeNumber || "VALID";
  const displayName = `@${username}`;
  const badgeLabel = `FV-${badgeId}`;
  const status =
    profile.subscriptionStatus === "active"
      ? "VERIFIED CREATOR"
      : "CREATOR CREDENTIAL";
  const photoURL = profile.photoURL || "";
  const theme = getScoreTheme(score);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top left, rgba(139,92,246,0.34), transparent 360px), radial-gradient(circle at bottom right, rgba(251,146,60,0.28), transparent 360px), #050509",
          color: "white",
          fontFamily: "Arial",
          padding: "54px",
        }}
      >
        <div
          style={{
            width: "1092px",
            height: "522px",
            display: "flex",
            borderRadius: "36px",
            border: "2px solid rgba(251,146,60,0.55)",
            boxShadow: "0 0 80px rgba(139,92,246,0.45)",
            background: "rgba(8,8,15,0.92)",
            overflow: "hidden",
            padding: "36px",
            gap: "38px",
          }}
        >
          <div
            style={{
              width: "330px",
              height: "450px",
              borderRadius: "28px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "#11111b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {photoURL ? (
              <img
                src={photoURL}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  fontSize: "86px",
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.16)",
                }}
              >
                FV
              </div>
            )}
            <div
              style={{
                position: "absolute",
                display: "flex",
                left: "22px",
                bottom: "22px",
                borderRadius: "999px",
                background: "rgba(0,0,0,0.58)",
                border: "1px solid rgba(255,255,255,0.16)",
                padding: "10px 18px",
                fontSize: "18px",
                letterSpacing: "0.16em",
              }}
            >
              FEATRRR VALID
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minWidth: 0,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: "22px",
                    letterSpacing: "0.18em",
                    color: "#a1a1aa",
                    fontWeight: 700,
                  }}
                >
                  {status}
                </div>
                <div
                  style={{
                    marginTop: "34px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontSize: "62px",
                      lineHeight: 1,
                      fontWeight: 900,
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {displayName}
                  </div>
                  <div
                    style={{
                      width: "58px",
                      height: "58px",
                      borderRadius: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        score >= 93
                          ? "linear-gradient(135deg,#8b5cf6,#fb923c)"
                          : "rgba(255,255,255,0.06)",
                      border: `2px solid ${theme.accent}`,
                      color: score >= 93 ? "white" : theme.accent,
                      fontWeight: 900,
                      fontSize: "18px",
                    }}
                  >
                    FV
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ display: "flex", fontSize: "18px", letterSpacing: "0.2em", color: "#a1a1aa" }}>
                  BADGE ID
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: "12px",
                    fontSize: "28px",
                    color: "#c4b5fd",
                    fontWeight: 800,
                  }}
                >
                  {badgeLabel}
                </div>
              </div>
            </div>

            <div
              style={{
                borderRadius: "30px",
                background: "rgba(255,255,255,0.055)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", fontSize: "18px", letterSpacing: "0.18em", color: "#a1a1aa", fontWeight: 800 }}>
                    SCS SOCIAL CREDIBILITY SCORE
                  </div>
                  <div style={{ marginTop: "12px", display: "flex", alignItems: "flex-end" }}>
                    <span style={{ fontSize: "96px", lineHeight: 0.9, fontWeight: 900, color: theme.accent }}>
                      {score}
                    </span>
                    <span style={{ marginLeft: "10px", marginBottom: "10px", fontSize: "34px", color: "#71717a" }}>
                      /100
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", color: theme.accent, fontSize: "24px", fontWeight: 900 }}>
                    {theme.label}
                  </div>
                  <div style={{ display: "flex", marginTop: "8px", color: "#a1a1aa", fontSize: "18px" }}>
                    Transparency. Trust. Growth.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  marginTop: "24px",
                  height: "18px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: `${score}%`,
                    height: "100%",
                    borderRadius: "999px",
                    background:
                      score >= 93
                        ? "linear-gradient(90deg,#8b5cf6,#f472b6,#fb923c)"
                        : theme.accent,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
