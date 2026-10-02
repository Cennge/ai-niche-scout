// Shared Open Graph card layout for ImageResponse (Satori): flexbox and inline styles only.

export const OG_SIZE = { width: 1200, height: 630 }

const BG = "#101814"
const INK = "#eef5f1"
const MUTED = "#9db3a8"
const ACCENT = "#6fd3a5"

function Contours() {
  // Concentric rings standing in for the site's topographic hero lines.
  const rings = [90, 150, 215, 285, 360, 440, 525]
  return (
    <div
      style={{
        position: "absolute",
        right: -160,
        top: -120,
        width: 1100,
        height: 1100,
        display: "flex",
      }}
    >
      {rings.map((r, i) => (
        <div
          key={r}
          style={{
            position: "absolute",
            left: 550 - r * 1.15,
            top: 550 - r,
            width: r * 2.3,
            height: r * 2,
            borderRadius: "50%",
            border: `${i % 3 === 2 ? 3 : 2}px solid ${ACCENT}`,
            opacity: 0.22 - i * 0.02,
          }}
        />
      ))}
    </div>
  )
}

export function OgCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: BG,
        color: INK,
        position: "relative",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      <Contours />
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 700 }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: `4px solid ${ACCENT}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: ACCENT }} />
        </div>
        AI Niche Scout
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
        <div style={{ fontSize: 30, color: MUTED }}>{eyebrow}</div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
          {title}
        </div>
        {children}
      </div>
    </div>
  )
}

export const OG_COLORS = { INK, MUTED, ACCENT }
