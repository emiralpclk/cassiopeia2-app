import { useEffect, useRef, useState } from 'react';
import { calculateNatalChart, calculateAspects } from '../utils/astrologyEngine';
import { ASTRO_DICTIONARY, PLANET_DESCRIPTIONS, HOUSE_DESCRIPTIONS } from '../utils/astrologyDictionary';

// ═══════════════════════════════════════════════════════════════
//  ZODIAC METADATA
// ═══════════════════════════════════════════════════════════════

const ZODIAC_META = [
  { name: 'Koç',      sym: '♈\uFE0E', el: 'fire'  },
  { name: 'Boğa',     sym: '♉\uFE0E', el: 'earth' },
  { name: 'İkizler',  sym: '♊\uFE0E', el: 'air'   },
  { name: 'Yengeç',   sym: '♋\uFE0E', el: 'water' },
  { name: 'Aslan',    sym: '♌\uFE0E', el: 'fire'  },
  { name: 'Başak',    sym: '♍\uFE0E', el: 'earth' },
  { name: 'Terazi',   sym: '♎\uFE0E', el: 'air'   },
  { name: 'Akrep',    sym: '♏\uFE0E', el: 'water' },
  { name: 'Yay',      sym: '♐\uFE0E', el: 'fire'  },
  { name: 'Oğlak',    sym: '♑\uFE0E', el: 'earth' },
  { name: 'Kova',     sym: '♒\uFE0E', el: 'air'   },
  { name: 'Balık',    sym: '♓\uFE0E', el: 'water' },
];

const EL_COLOR = { fire: '#ff6b35', earth: '#6bcb77', air: '#c8a9fa', water: '#74d7ff' };
const EL_GLOW  = { fire: 'rgba(255,107,53,0.4)', earth: 'rgba(107,203,119,0.4)', air: 'rgba(200,169,250,0.4)', water: 'rgba(116,215,255,0.4)' };

const PLANET_COLORS = {
  sun:     { color: '#FFD700', glow: 'rgba(255,215,0,0.45)' },
  moon:    { color: '#E8E8FF', glow: 'rgba(200,200,255,0.4)' },
  mercury: { color: '#A0B0FF', glow: 'rgba(160,176,255,0.4)' },
  venus:   { color: '#FF85C2', glow: 'rgba(255,133,194,0.4)' },
  mars:    { color: '#FF5555', glow: 'rgba(255,85,85,0.4)' },
  jupiter: { color: '#F6A500', glow: 'rgba(246,165,0,0.45)' },
  saturn:  { color: '#8888FF', glow: 'rgba(136,136,255,0.4)' },
  uranus:  { color: '#00E5CC', glow: 'rgba(0,229,204,0.4)' },
  neptune: { color: '#7B68EE', glow: 'rgba(123,104,238,0.4)' },
  pluto:   { color: '#CC6677', glow: 'rgba(204,102,119,0.4)' },
  northNode: { color: '#B0B0B0', glow: 'rgba(176,176,176,0.35)' },
};

const PLANET_KEYS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'northNode'];

// ═══════════════════════════════════════════════════════════════
//  GEOMETRY HELPERS
// ═══════════════════════════════════════════════════════════════

const DEG2RAD = Math.PI / 180;

function toAngle(lon) {
  // Aries (0°) at left, counterclockwise — standard astro chart orientation
  // ASC is at the left (9 o'clock position)
  return (-lon + 180 + 360) % 360;
}

function toAngleFromASC(lon, ascDeg) {
  // Place ASC at the left (180° in SVG = 9 o'clock)
  return (-lon + ascDeg + 180 + 360) % 360;
}

function polar(angleDeg, r) {
  const rad = angleDeg * DEG2RAD;
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const s = startDeg * DEG2RAD;
  const e = endDeg * DEG2RAD;
  const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
  const sweep = (endDeg - startDeg + 360) % 360;
  const large = sweep > 180 ? 1 : 0;
  return `M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function NatalChartWheel({ profile }) {
  const [chart, setChart]           = useState(null);
  const [mounted, setMounted]       = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState('sun');
  const [selectedHouse, setSelectedHouse]   = useState(null);
  const [calcError, setCalcError]   = useState(false);
  const [aspects, setAspects]       = useState([]);

  useEffect(() => {
    if (!profile?.birthDate) return;

    try {
      const result = calculateNatalChart(
        profile.birthDate,
        profile.birthTime || null,
        profile.birthPlace || null,
        profile.birthDistrict || null
      );
      if (result) {
        setChart(result);
        setCalcError(false);
        const asp = calculateAspects(result);
        setAspects(asp || []);
      } else {
        setCalcError(true);
      }
    } catch (e) {
      console.error('NatalChartWheel calculation error:', e);
      setCalcError(true);
    }

    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [profile]);

  // ── Layout constants ──
  const S   = 410;
  const CX  = S / 2;
  const CY  = S / 2;
  const R_OUTER = 190;   // Outermost ring
  const R_ZODIAC_IN = 160; // Zodiac band inner
  const R_HOUSE_IN = 132;  // House number zone inner / planet zone outer
  const R_PLANET = 104;    // Planet ring radius  
  const R_CORE  = 48;      // Inner core

  const hasHouses = chart?.hasBirthTime && chart?.houses;
  const ascDeg = chart?.ascendant?.absoluteDegree || 0;

  // Use ASC-oriented angles if houses available, otherwise standard
  const getVisualAngle = (lon) => {
    return hasHouses ? toAngleFromASC(lon, ascDeg) : toAngle(lon);
  };

  // ── Build planet display data ──
  const planets = chart
    ? PLANET_KEYS.map(key => {
        const info = chart[key];
        if (!info) return null;
        const zIdx = ZODIAC_META.findIndex(z => z.name === info.name);
        if (zIdx < 0) return null;
        const angle = getVisualAngle(info.absoluteDegree);
        const pos = polar(angle, R_PLANET);
        const colors = PLANET_COLORS[key] || { color: '#fff', glow: 'rgba(255,255,255,0.3)' };
        return {
          key,
          angle,
          cx: CX + pos.x,
          cy: CY + pos.y,
          zodiacName: info.name,
          degree: info.degree,
          absoluteDegree: info.absoluteDegree,
          house: info.house || null,
          retrograde: info.retrograde || false,
          glyph: info.glyph,
          label: info.label,
          el: ZODIAC_META[zIdx]?.el || 'fire',
          ...colors,
        };
      }).filter(Boolean)
    : [];

  // ── Nudge collision-close planets apart ──
  const placed = [...planets];
  for (let i = 0; i < placed.length; i++) {
    for (let j = 0; j < i; j++) {
      const dx = placed[i].cx - placed[j].cx;
      const dy = placed[i].cy - placed[j].cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 18) {
        const nudge = 14;
        const newAngle = placed[i].angle + nudge;
        const np = polar(newAngle, R_PLANET);
        placed[i] = { ...placed[i], cx: CX + np.x, cy: CY + np.y };
      }
    }
  }

  const sel = selectedPlanet ? placed.find(p => p.key === selectedPlanet) : null;

  // ── Handle selections ──
  const handlePlanetTap = (key) => {
    setSelectedHouse(null);
    setSelectedPlanet(prev => prev === key ? null : key);
  };

  const handleHouseTap = (houseNum) => {
    if (!hasHouses) return;
    setSelectedPlanet(null);
    setSelectedHouse(prev => prev === houseNum ? null : houseNum);
  };

  // ── Aspect lines for SVG ──
  const aspectLines = aspects.map(asp => {
    const p1 = placed.find(p => p.key === asp.planet1Key);
    const p2 = placed.find(p => p.key === asp.planet2Key);
    if (!p1 || !p2) return null;
    return { ...asp, x1: p1.cx, y1: p1.cy, x2: p2.cx, y2: p2.cy };
  }).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, width: '100%' }}>

      {/* ─ SVG WHEEL ─── */}
      <div
        style={{
          width: 'calc(100% + 40px)',
          marginLeft: '-20px',
          marginRight: '-20px',
          marginTop: '10px',
          marginBottom: '10px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'scale(1)' : 'scale(0.82)',
          transition: 'opacity 1s ease, transform 1.2s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <svg width="100%" viewBox={`0 0 ${S} ${S}`} style={{ overflow: 'visible', maxWidth: 460, margin: '0 auto', display: 'block' }}>
          <defs>
            <radialGradient id="ncw-core2" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(200,220,255,0.12)" />
              <stop offset="60%"  stopColor="rgba(80,100,180,0.06)"  />
              <stop offset="100%" stopColor="rgba(0,0,0,0)"          />
            </radialGradient>
            <filter id="ncw-glow2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="ncw-soft2" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── Outer decorative rings ── */}
          {[R_OUTER + 4, R_OUTER + 9, R_OUTER + 14].map((r, i) => (
            <circle key={r} cx={CX} cy={CY} r={r}
              fill="none" stroke={`rgba(226,232,240,${0.06 - i*0.015})`} strokeWidth="0.4"
            />
          ))}

          {/* ── 1° Fine tick marks (outer ring - pro look) ── */}
          {Array.from({length: 360}, (_, i) => {
            const a = getVisualAngle(i);
            const rad = a * DEG2RAD;
            const is30 = i % 30 === 0;
            const is10 = i % 10 === 0;
            const is5 = i % 5 === 0;
            if (is30) return null;
            const outerR = R_OUTER;
            const len = is10 ? 7 : is5 ? 5 : 2.5;
            const opacity = is10 ? 0.25 : is5 ? 0.15 : 0.06;
            return (
              <line key={`ft-${i}`}
                x1={CX + (outerR - len) * Math.cos(rad)} y1={CY + (outerR - len) * Math.sin(rad)}
                x2={CX + outerR * Math.cos(rad)}        y2={CY + outerR * Math.sin(rad)}
                stroke={`rgba(255,255,255,${opacity})`}
                strokeWidth={is10 ? 0.7 : 0.4}
              />
            );
          })}

          {/* ── 12 ZODIAC SEGMENTS (outer band) ── */}
          {ZODIAC_META.map((z, i) => {
            const rawStart = i * 30;
            const a1 = getVisualAngle(rawStart);
            const a2 = getVisualAngle(rawStart + 30);
            
            // Use sorted angles for arc drawing
            const startA = Math.min(a1, a2);
            const endA = Math.max(a1, a2);

            const amid = getVisualAngle(rawStart + 15);
            const elColor = EL_COLOR[z.el];
            const hasPlanet = placed.some(p => p.zodiacName === z.name);
            const isSun = z.name === chart?.sun?.name;

            // Draw segment as arc wedge
            const outer = R_OUTER;
            const inner = R_ZODIAC_IN;
            
            const x1o = CX + outer * Math.cos(a1 * DEG2RAD);
            const y1o = CY + outer * Math.sin(a1 * DEG2RAD);
            const x2o = CX + outer * Math.cos(a2 * DEG2RAD);
            const y2o = CY + outer * Math.sin(a2 * DEG2RAD);
            const x1i = CX + inner * Math.cos(a1 * DEG2RAD);
            const y1i = CY + inner * Math.sin(a1 * DEG2RAD);
            const x2i = CX + inner * Math.cos(a2 * DEG2RAD);
            const y2i = CY + inner * Math.sin(a2 * DEG2RAD);
            
            const d = `M${x1o} ${y1o} A${outer} ${outer} 0 0 1 ${x2o} ${y2o} L${x2i} ${y2i} A${inner} ${inner} 0 0 0 ${x1i} ${y1i} Z`;

            return (
              <g key={z.name}>
                <path d={d}
                  fill={isSun ? `${elColor}22` : hasPlanet ? `${elColor}10` : 'rgba(226,232,240,0.02)'}
                  stroke={isSun ? `${elColor}44` : 'rgba(255,255,255,0.06)'}
                  strokeWidth={isSun ? 1 : 0.5}
                />
                {/* Zodiac symbol */}
                <text
                  x={CX + ((outer + inner) / 2) * Math.cos(amid * DEG2RAD)}
                  y={CY + ((outer + inner) / 2) * Math.sin(amid * DEG2RAD)}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={isSun ? 18 : 14} fontFamily="serif"
                  fill={hasPlanet || isSun ? elColor : 'rgba(255,255,255,0.25)'}
                  style={{ pointerEvents: 'none' }}
                >{z.sym}</text>
              </g>
            );
          })}

          {/* ── 12 divider spokes (zodiac) ── */}
          {Array.from({length: 12}, (_, i) => {
            const angle = getVisualAngle(i * 30);
            const rad = angle * DEG2RAD;
            return (
              <line key={`zs-${i}`}
                x1={CX + R_ZODIAC_IN * Math.cos(rad)} y1={CY + R_ZODIAC_IN * Math.sin(rad)}
                x2={CX + R_OUTER * Math.cos(rad)}     y2={CY + R_OUTER * Math.sin(rad)}
                stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"
              />
            );
          })}

          {/* ── Zodiac inner ring ── */}
          <circle cx={CX} cy={CY} r={R_ZODIAC_IN} fill="none" stroke="rgba(226,232,240,0.12)" strokeWidth="0.8" />

          {/* ── Planet degree pointers on zodiac band ── */}
          {placed.map(p => {
            const rawAngle = getVisualAngle(p.absoluteDegree);
            const rad = rawAngle * DEG2RAD;
            return (
              <line key={`ptr-${p.key}`}
                x1={CX + R_ZODIAC_IN * Math.cos(rad)} y1={CY + R_ZODIAC_IN * Math.sin(rad)}
                x2={CX + (R_ZODIAC_IN + 6) * Math.cos(rad)} y2={CY + (R_ZODIAC_IN + 6) * Math.sin(rad)}
                stroke={p.color} strokeWidth="1.5" strokeOpacity="0.6"
              />
            );
          })}

          {/* ── HOUSE System (only if birth time known) ── */}
          {hasHouses && chart.houses.map((h, i) => {
            const nextI = (i + 1) % 12;
            const a1 = getVisualAngle(h.cusp);
            const a2 = getVisualAngle(chart.houses[nextI].cusp);
            const amid = (a1 + a2) / 2;
            
            // House divider lines
            const rad = a1 * DEG2RAD;
            const isAxis = i === 0 || i === 3 || i === 6 || i === 9;
            
            return (
              <g key={`house-${i}`}>
                {/* House divider line */}
                <line
                  x1={CX + R_CORE * Math.cos(rad)} y1={CY + R_CORE * Math.sin(rad)}
                  x2={CX + R_ZODIAC_IN * Math.cos(rad)} y2={CY + R_ZODIAC_IN * Math.sin(rad)}
                  stroke={isAxis ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.07)'}
                  strokeWidth={isAxis ? 1.2 : 0.5}
                  strokeDasharray={isAxis ? 'none' : '3 4'}
                />
                {/* House number */}
                <text
                  x={CX + ((R_ZODIAC_IN + R_HOUSE_IN) / 2) * Math.cos(amid * DEG2RAD)}
                  y={CY + ((R_ZODIAC_IN + R_HOUSE_IN) / 2) * Math.sin(amid * DEG2RAD)}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={7.5}
                  fill={selectedHouse === i + 1 ? '#FFD700' : 'rgba(255,255,255,0.2)'}
                  fontFamily="var(--font-body)"
                  style={{ cursor: 'pointer', letterSpacing: '0.05em' }}
                  onClick={() => handleHouseTap(i + 1)}
                  onTouchStart={(e) => { e.stopPropagation(); handleHouseTap(i + 1); }}
                >{i + 1}</text>
              </g>
            );
          })}

          {/* ── House inner ring ── */}
          {hasHouses && (
            <circle cx={CX} cy={CY} r={R_HOUSE_IN} fill="none" stroke="rgba(226,232,240,0.06)" strokeWidth="0.5" />
          )}

          {/* ── ASC / DC / MC / IC Labels ── */}
          {hasHouses && chart.ascendant && (() => {
            const ascAngle = getVisualAngle(chart.ascendant.absoluteDegree);
            const dcAngle  = getVisualAngle(chart.dc.absoluteDegree);
            const mcAngle  = getVisualAngle(chart.mc.absoluteDegree);
            const icAngle  = getVisualAngle(chart.ic.absoluteDegree);
            
            const labels = [
              { label: 'ASC', angle: ascAngle, color: '#FFD700' },
              { label: 'DC',  angle: dcAngle,  color: 'rgba(255,255,255,0.35)' },
              { label: 'MC',  angle: mcAngle,  color: '#FFD700' },
              { label: 'IC',  angle: icAngle,  color: 'rgba(255,255,255,0.35)' },
            ];
            
            return labels.map(l => {
              const r = R_OUTER + 10;
              const rad = l.angle * DEG2RAD;
              return (
                <text key={l.label}
                  x={CX + r * Math.cos(rad)}
                  y={CY + r * Math.sin(rad)}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={8} fontWeight="bold" fontFamily="var(--font-body)"
                  fill={l.color} letterSpacing="0.1em"
                  style={{ pointerEvents: 'none' }}
                >{l.label}</text>
              );
            });
          })()}

          {/* ── Degree ticks (inner zodiac edge) ── */}
          {Array.from({length: 72}, (_, i) => {
            const rawDeg = i * 5;
            const a = getVisualAngle(rawDeg);
            const rad = a * DEG2RAD;
            const big = i % 6 === 0;
            return (
              <line key={`tick-${i}`}
                x1={CX + (R_ZODIAC_IN - (big ? 8 : 4)) * Math.cos(rad)}
                y1={CY + (R_ZODIAC_IN - (big ? 8 : 4)) * Math.sin(rad)}
                x2={CX + R_ZODIAC_IN * Math.cos(rad)}
                y2={CY + R_ZODIAC_IN * Math.sin(rad)}
                stroke={`rgba(255,255,255,${big ? 0.15 : 0.06})`}
                strokeWidth={big ? 0.7 : 0.4}
              />
            );
          })}

          {/* ── Aspect lines ── */}
          {aspectLines.map((asp, i) => (
            <line key={`asp-${i}`}
              x1={asp.x1} y1={asp.y1} x2={asp.x2} y2={asp.y2}
              stroke={asp.color}
              strokeWidth={asp.strength > 0.7 ? 1.8 : 1.1}
              strokeOpacity={asp.strength > 0.5 ? 0.7 : 0.4}
              strokeDasharray={asp.lineStyle === 'dashed' ? '4 3' : 'none'}
            />
          ))}

          {/* ── Inner sacred geometry pattern ── */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const a1 = (deg + (hasHouses ? getVisualAngle(0) : 0)) * DEG2RAD;
            const a2 = (deg + 180 + (hasHouses ? getVisualAngle(0) : 0)) * DEG2RAD;
            return (
              <line key={`geo-${i}`}
                x1={CX + (R_CORE + 4) * Math.cos(a1)} y1={CY + (R_CORE + 4) * Math.sin(a1)}
                x2={CX + (R_CORE + 4) * Math.cos(a2)} y2={CY + (R_CORE + 4) * Math.sin(a2)}
                stroke="rgba(200,220,255,0.04)" strokeWidth="0.4"
              />
            );
          })}

          {/* ── Additional subtle inner ring ── */}
          <circle cx={CX} cy={CY} r={R_CORE + 15} fill="none" stroke="rgba(226,232,240,0.04)" strokeWidth="0.3" />
          <circle cx={CX} cy={CY} r={(R_HOUSE_IN + R_PLANET) / 2} fill="none" stroke="rgba(226,232,240,0.03)" strokeWidth="0.3" strokeDasharray="2 4" />

          {/* ── Core fill ── */}
          <circle cx={CX} cy={CY} r={R_CORE} fill="url(#ncw-core2)" stroke="rgba(226,232,240,0.12)" strokeWidth="0.7" />

          {/* ── Pulsing center ring ── */}
          <circle cx={CX} cy={CY} r={22} fill="rgba(226,232,240,0.03)" stroke="rgba(226,232,240,0.2)" strokeWidth="0.5">
            <animate attributeName="r"       values="20;24;20" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="5s" repeatCount="indefinite" />
          </circle>

          {/* ── Center label ── */}
          <text x={CX} y={CY - 3} textAnchor="middle" fontSize="12" fill="rgba(226,232,240,0.4)" fontFamily="serif"
            style={{ pointerEvents: 'none' }}>✦</text>
          <text x={CX} y={CY + 9} textAnchor="middle" fontSize="5.5" fill="rgba(226,232,240,0.2)"
            fontFamily="var(--font-body)" letterSpacing="0.2em" style={{ pointerEvents: 'none' }}>NATAL</text>

          {/* ── Planets ── */}
          {placed.map(p => {
            const isSelected = selectedPlanet === p.key;
            return (
              <g key={p.key}
                filter="url(#ncw-glow2)"
                onClick={() => handlePlanetTap(p.key)}
                onTouchStart={(e) => { e.stopPropagation(); handlePlanetTap(p.key); }}
                style={{ cursor: 'pointer' }}
              >
                {/* Halo */}
                <circle cx={p.cx} cy={p.cy} r={isSelected ? 22 : 16} fill={p.glow}>
                  {!isSelected && <animate attributeName="opacity" values="0.35;0.75;0.35" dur={`${2.5+Math.random()*1.5}s`} repeatCount="indefinite" />}
                </circle>
                {/* Body */}
                <circle cx={p.cx} cy={p.cy} r={isSelected ? 14 : 10.5}
                  fill={p.color}
                  stroke={isSelected ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)'}
                  strokeWidth={isSelected ? 1.5 : 0.6}
                />
                {/* Glyph */}
                <text x={p.cx} y={p.cy} textAnchor="middle" dominantBaseline="central"
                  fontSize={isSelected ? 16 : 12.5} fontFamily="serif" fill="rgba(255,255,255,0.95)"
                  style={{ pointerEvents: 'none' }}
                >{p.glyph}</text>
                {/* Degree label */}
                {!isSelected && (
                  <text 
                    x={p.cx} y={p.cy + 17}
                    textAnchor="middle" dominantBaseline="central"
                    fontSize="5.5" fontFamily="var(--font-body)"
                    fill={`${p.color}`} fillOpacity="0.7"
                    style={{ pointerEvents: 'none' }}
                  >{Math.floor(p.degree)}°</text>
                )}
                {/* Retrograde indicator */}
                {p.retrograde && (
                  <text x={p.cx + 8} y={p.cy - 6} textAnchor="middle" fontSize="6"
                    fill={p.color} fontFamily="serif" style={{ pointerEvents: 'none' }}
                  >℞</text>
                )}
              </g>
            );
          })}

          {/* ── No-data overlay ── */}
          {calcError && (
            <text x={CX} y={CY+10} textAnchor="middle" fontSize="9"
              fill="rgba(226,232,240,0.3)" fontFamily="var(--font-body)" letterSpacing="0.1em"
            >Hesaplanıyor...</text>
          )}
        </svg>
      </div>

      {/* ─ INSTRUCTION TEXT ── */}
      {!selectedPlanet && !selectedHouse && placed.length > 0 && (
        <p style={{ 
          fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', 
          textTransform: 'uppercase', textAlign: 'center', marginTop: -2, marginBottom: 8
        }}>
          {hasHouses ? 'Gezegene veya eve dokun' : 'Gezegene dokun'}
        </p>
      )}

      {/* ─ PLANET DETAIL PANEL (inline) ── */}
      {sel && (() => {
        const dictEntry = ASTRO_DICTIONARY[sel.key]?.[sel.zodiacName];
        const planetDesc = PLANET_DESCRIPTIONS[sel.key];
        const houseDesc = sel.house ? HOUSE_DESCRIPTIONS[sel.house] : null;
        
        return (
          <div 
            key={sel.key}
            style={{
              width: '100%',
              padding: '18px 16px',
              borderRadius: 18,
              background: 'rgba(8,8,18,0.85)',
              border: `1px solid ${sel.color}33`,
              boxShadow: `0 8px 32px ${sel.glow}`,
              animation: 'fade-in 0.25s ease',
              marginTop: 4,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ fontFamily: 'serif', fontSize: 28, color: sel.color }}>{sel.glyph}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: sel.color, letterSpacing: '0.04em' }}>{sel.label}</span>
                  {sel.retrograde && (
                    <span style={{ fontSize: 10, color: '#ff9500', background: 'rgba(255,149,0,0.12)', padding: '2px 6px', borderRadius: 6, fontWeight: 600 }}>℞ Retrograde</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                  {sel.zodiacName} {ZODIAC_META.find(z => z.name === sel.zodiacName)?.sym} · {sel.degree.toFixed(1)}°
                  {sel.house && <span style={{ color: 'rgba(255,255,255,0.4)' }}> · {sel.house}. Ev</span>}
                </div>
              </div>
            </div>

            {/* Planet Core Description */}
            {planetDesc && (
              <div style={{ 
                padding: '10px 12px', borderRadius: 12, marginBottom: 10,
                background: `linear-gradient(135deg, ${sel.color}08, transparent)`,
                borderLeft: `3px solid ${sel.color}44`,
              }}>
                <div style={{ fontSize: 10, color: sel.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 600 }}>
                  {planetDesc.title}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  {planetDesc.desc}
                </div>
              </div>
            )}

            {/* Sign Interpretation */}
            {dictEntry && (
              <div style={{ 
                padding: '10px 12px', borderRadius: 12, marginBottom: 10,
                background: 'rgba(255,255,255,0.03)',
              }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 600 }}>
                  {sel.zodiacName}'da {sel.label}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  {dictEntry}
                </div>
              </div>
            )}

            {/* House Info */}
            {houseDesc && (
              <div style={{ 
                padding: '10px 12px', borderRadius: 12,
                background: 'rgba(255,215,0,0.03)',
                border: '1px solid rgba(255,215,0,0.08)',
              }}>
                <div style={{ fontSize: 10, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 600 }}>
                  ⌂ {sel.house}. Ev — {houseDesc.title}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                  {houseDesc.desc}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ─ HOUSE DETAIL PANEL ── */}
      {selectedHouse && !selectedPlanet && (() => {
        const houseDesc = HOUSE_DESCRIPTIONS[selectedHouse];
        const houseCusp = chart?.houses?.[selectedHouse - 1];
        const planetsInHouse = placed.filter(p => p.house === selectedHouse);
        
        if (!houseDesc) return null;
        
        return (
          <div 
            key={`house-${selectedHouse}`}
            style={{
              width: '100%',
              padding: '18px 16px',
              borderRadius: 18,
              background: 'rgba(8,8,18,0.85)',
              border: '1px solid rgba(255,215,0,0.2)',
              boxShadow: '0 8px 32px rgba(255,215,0,0.08)',
              animation: 'fade-in 0.25s ease',
              marginTop: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ 
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 'bold', color: '#FFD700'
              }}>{selectedHouse}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#FFD700' }}>{houseDesc.title}</div>
                {houseCusp && (
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    {houseCusp.name} {houseCusp.icon} · {houseCusp.degree.toFixed(1)}°
                  </div>
                )}
              </div>
            </div>

            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 10 }}>
              {houseDesc.desc}
            </p>

            {/* Keywords */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: planetsInHouse.length > 0 ? 12 : 0 }}>
              {houseDesc.keywords.map(kw => (
                <span key={kw} style={{ 
                  fontSize: 10, padding: '3px 8px', borderRadius: 8,
                  background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.1)',
                  color: 'rgba(255,255,255,0.5)'
                }}>{kw}</span>
              ))}
            </div>

            {/* Planets in this house */}
            {planetsInHouse.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                  Bu Evdeki Gezegenler
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {planetsInHouse.map(p => (
                    <div key={p.key} 
                      onClick={() => handlePlanetTap(p.key)}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '5px 10px', borderRadius: 10,
                        background: `${p.color}12`, border: `1px solid ${p.color}33`,
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontFamily: 'serif', fontSize: 13, color: p.color }}>{p.glyph}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ─ PLANET CHIPS ── */}
      {placed.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center',
          maxWidth: 340, marginTop: 6,
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.8s ease 1s',
        }}>
          {placed.map(p => {
            const isActive = selectedPlanet === p.key;
            return (
              <div key={p.key}
                onClick={() => handlePlanetTap(p.key)}
                onTouchStart={(e) => { e.stopPropagation(); handlePlanetTap(p.key); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 9px', borderRadius: 16,
                  background: isActive ? `${p.color}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? p.color + '55' : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer', transition: 'all 0.22s ease',
                  boxShadow: isActive ? `0 0 8px ${p.glow}` : 'none',
                }}
              >
                <span style={{ fontFamily: 'serif', fontSize: 11, color: p.color }}>{p.glyph}</span>
                <span style={{ fontSize: 9.5, color: isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)' }}>{p.label}</span>
                <span style={{ fontSize: 9, color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)' }}>
                  {p.zodiacName} <span style={{ fontSize: 13, display: 'inline-block', transform: 'translateY(1px)', marginLeft: 2 }}>{ZODIAC_META.find(z => z.name === p.zodiacName)?.sym}</span>
                </span>
                {p.retrograde && <span style={{ fontSize: 8, color: '#ff9500' }}>℞</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* ─ ASPECT LEGEND ── */}
      {aspects.length > 0 && !selectedPlanet && !selectedHouse && (
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 14, marginTop: 10,
          opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease 1.2s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 14, height: 2, background: '#00d2ff', borderRadius: 2, boxShadow: '0 0 6px rgba(0,210,255,0.4)' }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>Uyumlu</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 14, height: 2, background: '#ff5555', borderRadius: 2, boxShadow: '0 0 6px rgba(255,85,85,0.4)' }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>Gerilim</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 14, height: 2, background: '#FFD700', borderRadius: 2, boxShadow: '0 0 6px rgba(255,215,0,0.4)' }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>Kavuşum</span>
          </div>
        </div>
      )}
    </div>
  );
}
