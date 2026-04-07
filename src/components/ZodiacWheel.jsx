/**
 * ZodiacWheel — Antik astroloji çarkı
 * Referans: Klasik natal chart stili, ince çizgiler, monokrom
 * - 3 halka: dış (isimler), orta (semboller), iç (süsleme)
 * - Sadece SVG stroke, fill yok
 * - Semboller Unicode text modunda render edilir (emoji değil)
 * - Kullanıcının burcu altın renkli segment ile vurgulanır
 */

// Burç sırası ve verileri
const ZODIAC_ORDER = [
  { id: 'aries',       symbol: '\u2648', name: 'KO\u00c7',     abbr: 'Ko\u00e7'    },
  { id: 'taurus',      symbol: '\u2649', name: 'BO\u011eA',    abbr: 'Bo\u011fa'   },
  { id: 'gemini',      symbol: '\u264a', name: '\u0130K\u0130ZLER', abbr: '\u0130kiz'  },
  { id: 'cancer',      symbol: '\u264b', name: 'YENGE\u00c7',  abbr: 'Yeng.'   },
  { id: 'leo',         symbol: '\u264c', name: 'ASLAN',    abbr: 'Aslan'   },
  { id: 'virgo',       symbol: '\u264d', name: 'BA\u015eAK',   abbr: 'Ba\u015fak'  },
  { id: 'libra',       symbol: '\u264e', name: 'TERAR\u0130',  abbr: 'Ter.'    },
  { id: 'scorpio',     symbol: '\u264f', name: 'AKREP',    abbr: 'Akrep'   },
  { id: 'sagittarius', symbol: '\u2650', name: 'YAY',      abbr: 'Yay'     },
  { id: 'capricorn',   symbol: '\u2651', name: 'O\u011eLAK',   abbr: 'O\u011flak'  },
  { id: 'aquarius',    symbol: '\u2652', name: 'KOVA',     abbr: 'Kova'    },
  { id: 'pisces',      symbol: '\u2653', name: 'BALIK',    abbr: 'Bal\u0131k'  },
];

// Açı → koordinat dönüşümü (saatten ters, 0° = üst)
function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Pasta segment path (pie slice arc)
function arcPath(cx, cy, r, startDeg, endDeg) {
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M${cx},${cy} L${s.x},${s.y} A${r},${r} 0 ${large},1 ${e.x},${e.y} Z`;
}

export default function ZodiacWheel({ highlightSign = 'scorpio' }) {
  const SIZE  = 280;
  const CX    = SIZE / 2;
  const CY    = SIZE / 2;

  // Halka yarıçapları
  const R_OUTER  = 125; // dış sınır
  const R_NAME   = 112; // isim konumu
  const R_MID    = 96;  // orta halka (ayrıcı çizgi)
  const R_SYMBOL = 78;  // sembol konumu
  const R_INNER  = 58;  // iç dekoratif halka
  const R_CORE   = 32;  // merkez

  const DIM   = 'rgba(255,255,255,0.18)';
  const FAINT = 'rgba(255,255,255,0.07)';
  const GOLD  = 'rgba(210,180,80,1)';
  const SILVER = 'rgba(255,255,255,0.55)';
  const NAVY  = '#283593'; // Koyu lacivert parıltı

  return (
    <div className="zodiac-wheel-container">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="zodiac-wheel-svg"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif", overflow: 'visible' }}
      >
        <defs>
          <filter id="nebula-blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <radialGradient
            id="nebula-grad"
            cx={CX}
            cy={CY}
            r={R_OUTER + 80}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={`${(R_MID / (R_OUTER + 80)) * 100}%`} stopColor={NAVY} stopOpacity="0" />
            <stop offset={`${(R_OUTER / (R_OUTER + 80)) * 100}%`} stopColor={NAVY} stopOpacity="0.9" />
            <stop offset="100%" stopColor={NAVY} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Highlight segment (aktif burç) ── */}
        {ZODIAC_ORDER.map((z, i) => {
          if (z.id !== highlightSign) return null;
          const startDeg = i * 30;
          const endDeg   = startDeg + 30;
          return (
            <g key="highlight">
              {/* Dışarı Taşan Akıcı Hüzme (Nebula Streak) */}
              <g filter="url(#nebula-blur)" opacity="0.9">
                <path
                  d={arcPath(CX, CY, R_OUTER + 80, startDeg - 2, endDeg + 2)}
                  fill="url(#nebula-grad)"
                />
              </g>

              {/* Lacivert highlight slice */}
              <path
                d={arcPath(CX, CY, R_MID, startDeg, endDeg)}
                fill={NAVY}
                opacity="0.25"
              />
              <path
                d={arcPath(CX, CY, R_OUTER, startDeg, endDeg)}
                fill={NAVY}
                opacity="0.15"
              />
              {/* Dış kenar ark vurgusu (koyu lacivert parıltılı) */}
              {(() => {
                const s = polar(CX, CY, R_OUTER, startDeg);
                const e = polar(CX, CY, R_OUTER, endDeg);
                return (
                  <path
                    d={`M${s.x},${s.y} A${R_OUTER},${R_OUTER} 0 0,1 ${e.x},${e.y}`}
                    fill="none"
                    stroke={NAVY}
                    strokeWidth="2"
                    opacity="1"
                    filter="drop-shadow(0 0 4px rgba(40,53,147,0.5))"
                  />
                );
              })()}
            </g>
          );
        })}

        {/* ── Dış daire ── */}
        <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke={DIM} strokeWidth="1" />

        {/* ── Orta daire ── */}
        <circle cx={CX} cy={CY} r={R_MID}   fill="none" stroke={DIM} strokeWidth="0.6" />

        {/* ── İç dekoratif daire ── */}
        <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke={FAINT} strokeWidth="0.5" />

        {/* ── Merkez daire ── */}
        <circle cx={CX} cy={CY} r={R_CORE}  fill="rgba(0,0,0,0.2)" stroke={DIM} strokeWidth="0.8" />

        {/* ── 12 bölme çizgisi ── */}
        {ZODIAC_ORDER.map((_, i) => {
          const pt_outer = polar(CX, CY, R_OUTER, i * 30);
          const pt_core  = polar(CX, CY, R_CORE,  i * 30);
          const isMajor  = i % 3 === 0; // her 90°'de ana çizgi
          return (
            <line
              key={`divider-${i}`}
              x1={pt_core.x}  y1={pt_core.y}
              x2={pt_outer.x} y2={pt_outer.y}
              stroke={isMajor ? DIM : FAINT}
              strokeWidth={isMajor ? 0.8 : 0.4}
            />
          );
        })}

        {/* ── İç süsleme noktaları (R_INNER üzerinde bölmelerde) ── */}
        {ZODIAC_ORDER.map((_, i) => {
          const mid = polar(CX, CY, R_INNER, i * 30 + 15);
          return (
            <circle key={`dot-${i}`} cx={mid.x} cy={mid.y} r="1" fill={FAINT} />
          );
        })}

        {/* ── Zodiac sembolleri ── */}
        {ZODIAC_ORDER.map((z, i) => {
          const angleDeg = i * 30 + 15; // segment ortası
          const pt = polar(CX, CY, R_SYMBOL, angleDeg);
          const isActive = z.id === highlightSign;

          return (
            <text
              key={`sym-${z.id}`}
              x={pt.x}
              y={pt.y + 6}
              textAnchor="middle"
              fontSize={isActive ? 18 : 14}
              fontFamily="'Noto Sans Symbols 2', 'Segoe UI Symbol', 'Apple Symbols', serif"
              fill={isActive ? GOLD : SILVER}
              style={{
                fontVariantEmoji: 'text',
                filter: isActive ? `drop-shadow(0 0 5px ${GOLD})` : 'none',
              }}
            >
              {/* \uFE0E = text variation selector, emoji olarak render edilmemesi için */}
              {z.symbol}{'\uFE0E'}
            </text>
          );
        })}

        {/* ── Burç kısaltma isimleri (dış halkada, küçük) ── */}
        {ZODIAC_ORDER.map((z, i) => {
          const angleDeg = i * 30 + 15;
          const pt = polar(CX, CY, R_NAME, angleDeg);
          const isActive = z.id === highlightSign;

          // Metni radyal yönde döndür
          const rotation = angleDeg > 90 && angleDeg < 270 ? angleDeg + 180 : angleDeg;

          return (
            <text
              key={`name-${z.id}`}
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7"
              fontFamily="'Georgia', serif"
              letterSpacing="0.8"
              fill={isActive ? GOLD : 'rgba(255,255,255,0.3)'}
              transform={`rotate(${rotation}, ${pt.x}, ${pt.y})`}
            >
              {z.abbr.toUpperCase()}
            </text>
          );
        })}

        {/* ── Merkez sembolü ── */}
        <text
          x={CX} y={CY + 9}
          textAnchor="middle"
          fontSize="24"
          fontFamily="'Georgia', serif"
          fill="rgba(210,180,80,0.6)"
          style={{ fontVariantEmoji: 'text' }}
        >
          {/* Güneş sembolü text modu */}
          {'\u2609'}
        </text>

        {/* ── 4 ana nokta işareti (12, 3, 6, 9 saat) ── */}
        {[0, 90, 180, 270].map((deg) => {
          const pt = polar(CX, CY, R_OUTER + 6, deg);
          return (
            <circle
              key={`cardinal-${deg}`}
              cx={pt.x} cy={pt.y}
              r="1.5"
              fill={DIM}
            />
          );
        })}
      </svg>
    </div>
  );
}
