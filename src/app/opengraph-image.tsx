import { ImageResponse } from "next/og";

export const alt = "Hussain Phalasiya — notes, posts, and projects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(120% 100% at 15% 0%, #26201a 0%, #17140f 55%, #0f0c08 100%)",
          color: "#f3ecdf",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8a7b66",
          }}
        >
          <span style={{ color: "#e08a4a" }}>#</span>
          <span>building · writing · shipping</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 108,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              color: "#f3ecdf",
            }}
          >
            Hussain Phalasiya
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.35,
              letterSpacing: "-0.02em",
              color: "#b6a78d",
              maxWidth: 860,
              fontFamily: "sans-serif",
            }}
          >
            Notes, posts, and projects from the AI-product corner of the
            internet.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
