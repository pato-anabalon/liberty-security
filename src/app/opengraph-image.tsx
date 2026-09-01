import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

export const alt = "Liberty Security — People protecting people";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

async function loadImage(relativePath: string, mime: string) {
  const buffer = await readFile(path.join(process.cwd(), "public", relativePath));
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export default async function OpenGraphImage() {
  const [logoSrc, eventSrc] = await Promise.all([
    loadImage("brand/liberty-security-logo.jpeg", "image/jpeg"),
    loadImage("services/event-security.png", "image/png"),
  ]);

  const png = await new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          background: "#000",
        }}
      >
        <div
          style={{
            width: 520,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <img
            src={logoSrc}
            alt=""
            width={440}
            height={440}
            style={{ width: 440, height: 440, objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            width: 680,
            height: 630,
            display: "flex",
            position: "relative",
          }}
        >
          <img
            src={eventSrc}
            alt=""
            width={680}
            height={630}
            style={{
              width: 680,
              height: 630,
              objectFit: "cover",
              objectPosition: "54% center",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 680,
              height: 630,
              display: "flex",
              backgroundImage:
                "linear-gradient(to right, #000 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0) 100%)",
            }}
          />
        </div>
      </div>
    ),
    size,
  ).arrayBuffer();

  const jpeg = await sharp(Buffer.from(png))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
