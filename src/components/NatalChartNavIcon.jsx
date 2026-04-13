/**
 * NatalChartNavIcon
 * Mini doğum haritası SVG ikonu — BottomNav'da Astroloji sekmesi için.
 */
export default function NatalChartNavIcon({ size = 24, color = 'currentColor', opacity = 1 }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.44;   // Zodiac dış halkası
  const midR   = size * 0.305;  // Ev halkası
  const innerR = size * 0.11;   // İç daire

  // Polar → Kartezyen
  const pt = (r, deg) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };

  // 12 ev bölümü: her 30°'de bir, midR → outerR arası çizgi
  // Ana çapraz çizgiler (0°, 90°, 180°, 270°) tam çark boyunca olduğundan atla
  const houseDividers = [];
  for (let deg = 0; deg < 360; deg += 30) {
    if (deg % 90 === 0) continue;
    const [x1, y1] = pt(midR, deg);
    const [x2, y2] = pt(outerR, deg);
    houseDividers.push({ x1, y1, x2, y2, key: deg });
  }

  // Trine aspekti (üçgen) — midR'ın %60'ı kadar içte
  const aspectR = midR * 0.62;
  const [ax, ay] = pt(aspectR, -90);   // Üst (IC/MC ekseni)
  const [bx, by] = pt(aspectR, 30);    // Sağ alt
  const [ccx, ccy] = pt(aspectR, 150); // Sol alt

  const sw = (n) => (size * n).toFixed(2); // strokeWidth helper

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      style={{ opacity }}
    >
      {/* ── Dış zodiac halkası ── */}
      <circle cx={cx} cy={cy} r={outerR} stroke={color} strokeWidth={sw(0.036)} />

      {/* ── Ev halkası ── */}
      <circle cx={cx} cy={cy} r={midR} stroke={color} strokeWidth={sw(0.025)} opacity="0.75" />

      {/* ── İç küçük daire ── */}
      <circle cx={cx} cy={cy} r={innerR} stroke={color} strokeWidth={sw(0.02)} opacity="0.5" />

      {/* ── Ana çarpı: Ufuk + Meridyen (tam çark boyunca) ── */}
      <line
        x1={cx - outerR} y1={cy}
        x2={cx + outerR} y2={cy}
        stroke={color} strokeWidth={sw(0.036)} opacity="0.9"
      />
      <line
        x1={cx} y1={cy - outerR}
        x2={cx} y2={cy + outerR}
        stroke={color} strokeWidth={sw(0.036)} opacity="0.9"
      />

      {/* ── 12 ev bölüm çizgileri ── */}
      {houseDividers.map(({ x1, y1, x2, y2, key }) => (
        <line
          key={key}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth={sw(0.018)} opacity="0.55"
        />
      ))}

      {/* ── Trine aspekt üçgeni ── */}
      <g opacity="0.55">
        <line x1={ax}  y1={ay}  x2={bx}  y2={by}  stroke={color} strokeWidth={sw(0.02)} />
        <line x1={bx}  y1={by}  x2={ccx} y2={ccy} stroke={color} strokeWidth={sw(0.02)} />
        <line x1={ccx} y1={ccy} x2={ax}  y2={ay}  stroke={color} strokeWidth={sw(0.02)} />
      </g>

      {/* ── Merkez nokta (Dünya) ── */}
      <circle cx={cx} cy={cy} r={size * 0.055} fill={color} opacity="0.8" />
    </svg>
  );
}
