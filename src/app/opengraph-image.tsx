import { ImageResponse } from "next/og";

export const alt = "Liberty Security — People protecting people";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#111820", color: "#f2efe8", padding: "72px", fontFamily: "sans-serif" }}>
      <div style={{ position: "absolute", width: 580, height: 580, border: "2px solid #c8a45d", transform: "rotate(45deg)", right: -210, top: 20, opacity: 0.45 }} />
      <div style={{ position: "absolute", width: 420, height: 420, border: "1px solid #3c507d", borderRadius: "50%", right: 90, top: 100 }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", letterSpacing: "0.18em" }}><span style={{ fontSize: 32, fontWeight: 800 }}>LIBERTY</span><span style={{ color: "#c8a45d", fontSize: 14 }}>SECURITY · AUCKLAND</span></div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}><span style={{ color: "#c8a45d", fontSize: 18, textTransform: "uppercase", letterSpacing: "0.2em" }}>Genuine commitment to protecting people</span><span style={{ fontSize: 76, lineHeight: 1.03, fontWeight: 700, marginTop: 22 }}>People protecting people.</span></div>
      </div>
    </div>,
    size,
  );
}
