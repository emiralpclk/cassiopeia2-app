import { AstroTime, Body, Equator, Ecliptic, Observer, SiderealTime, GeoMoon } from 'astronomy-engine';
import { getCoordinates } from './cityCoordinates';

// ═══════════════════════════════════════════════════════════════
//  ZODIAC & ELEMENT/MODALITY DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const ZODIAC_SIGNS = [
  { name: 'Koç',      element: 'Ateş',   modality: 'Kardinal', icon: '♈\uFE0E', polarity: 'Aktif'  },
  { name: 'Boğa',     element: 'Toprak', modality: 'Sabit',    icon: '♉\uFE0E', polarity: 'Pasif'  },
  { name: 'İkizler',  element: 'Hava',   modality: 'Değişken', icon: '♊\uFE0E', polarity: 'Aktif'  },
  { name: 'Yengeç',   element: 'Su',     modality: 'Kardinal', icon: '♋\uFE0E', polarity: 'Pasif'  },
  { name: 'Aslan',    element: 'Ateş',   modality: 'Sabit',    icon: '♌\uFE0E', polarity: 'Aktif'  },
  { name: 'Başak',    element: 'Toprak', modality: 'Değişken', icon: '♍\uFE0E', polarity: 'Pasif'  },
  { name: 'Terazi',   element: 'Hava',   modality: 'Kardinal', icon: '♎\uFE0E', polarity: 'Aktif'  },
  { name: 'Akrep',    element: 'Su',     modality: 'Sabit',    icon: '♏\uFE0E', polarity: 'Pasif'  },
  { name: 'Yay',      element: 'Ateş',   modality: 'Değişken', icon: '♐\uFE0E', polarity: 'Aktif'  },
  { name: 'Oğlak',    element: 'Toprak', modality: 'Kardinal', icon: '♑\uFE0E', polarity: 'Pasif'  },
  { name: 'Kova',     element: 'Hava',   modality: 'Sabit',    icon: '♒\uFE0E', polarity: 'Aktif'  },
  { name: 'Balık',    element: 'Su',     modality: 'Değişken', icon: '♓\uFE0E', polarity: 'Pasif'  }
];

function getZodiacInfo(longitude) {
  const normalized = (longitude % 360 + 360) % 360;
  const index = Math.floor(normalized / 30);
  const degree = (normalized % 30).toFixed(2);
  
  return {
    ...ZODIAC_SIGNS[index],
    degree: parseFloat(degree),
    absoluteDegree: normalized,
    formatted: `${degree}° ${ZODIAC_SIGNS[index].icon}`
  };
}

// ═══════════════════════════════════════════════════════════════
//  PLANET DEFINITIONS (10 Planets + North Node)
// ═══════════════════════════════════════════════════════════════

const PLANET_BODIES = [
  { key: 'sun',     body: Body.Sun,     label: 'Güneş',   glyph: '☉', weight: 2 },
  { key: 'moon',    body: Body.Moon,    label: 'Ay',      glyph: '☽', weight: 2 },
  { key: 'mercury', body: Body.Mercury, label: 'Merkür',  glyph: '☿', weight: 1 },
  { key: 'venus',   body: Body.Venus,   label: 'Venüs',   glyph: '♀', weight: 1 },
  { key: 'mars',    body: Body.Mars,    label: 'Mars',    glyph: '♂', weight: 1 },
  { key: 'jupiter', body: Body.Jupiter, label: 'Jüpiter', glyph: '♃', weight: 1 },
  { key: 'saturn',  body: Body.Saturn,  label: 'Satürn',  glyph: '♄', weight: 1 },
  { key: 'uranus',  body: Body.Uranus,  label: 'Uranüs',  glyph: '♅', weight: 0.5 },
  { key: 'neptune', body: Body.Neptune, label: 'Neptün',  glyph: '♆', weight: 0.5 },
  { key: 'pluto',   body: Body.Pluto,   label: 'Plüton',  glyph: '♇', weight: 0.5 },
];

// ═══════════════════════════════════════════════════════════════
//  RETROGRADE DETECTION
// ═══════════════════════════════════════════════════════════════

function isRetrograde(body, time) {
  // Güneş ve Ay asla retrograde olmaz
  if (body === Body.Sun || body === Body.Moon) return false;
  
  const ob = new Observer(0, 0, 0);
  const dayOffset = 0.5; // Yarım gün
  
  const timeBefore = new AstroTime(new Date(time.date.getTime() - dayOffset * 86400000));
  const timeAfter  = new AstroTime(new Date(time.date.getTime() + dayOffset * 86400000));
  
  const getElon = (b, t) => {
    const eq = Equator(b, t, ob, true, true);
    return Ecliptic(eq.vec).elon;
  };
  
  const lonBefore = getElon(body, timeBefore);
  const lonAfter  = getElon(body, timeAfter);
  
  // Normalize the difference (handle 0°/360° crossing)
  let diff = lonAfter - lonBefore;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  
  return diff < 0; // Negatif hareket = retrograde
}

// ═══════════════════════════════════════════════════════════════
//  MEAN NORTH NODE (Ortalama Kuzey Ay Düğümü)
// ═══════════════════════════════════════════════════════════════

function calculateNorthNode(time) {
  // Meeus algorithm for Mean North Node
  // T = Julian centuries from J2000.0
  const JD = 2451545.0 + time.ut; // approximate
  const T = (JD - 2451545.0) / 36525.0;
  
  // Mean longitude of the ascending node (degrees)
  let omega = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441.0;
  
  // Normalize to 0-360
  omega = ((omega % 360) + 360) % 360;
  
  return getZodiacInfo(omega);
}

// ═══════════════════════════════════════════════════════════════
//  ASCENDANT & MC CALCULATION
// ═══════════════════════════════════════════════════════════════

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * Obliquity of the ecliptic (simplified Meeus formula)
 */
function getObliquity(time) {
  const JD = 2451545.0 + time.ut;
  const T = (JD - 2451545.0) / 36525.0;
  return 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
}

/**
 * Calculate Ascendant from Local Sidereal Time and geographic latitude
 */
function calculateAscendant(lst, latDeg, obliquity) {
  const ramcRad = (lst * 15 % 360 + 360) % 360 * DEG2RAD; // RAMC in radians
  const latRad = latDeg * DEG2RAD;
  const oblRad = obliquity * DEG2RAD;
  
  // Correct horizon-based ASC formula
  // ASC = atan2(cos(RAMC), -(sin(RAMC)*cos(ε) + tan(φ)*sin(ε)))
  let asc = Math.atan2(
    Math.cos(ramcRad),
    -(Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad))
  ) * RAD2DEG;
  
  asc = ((asc % 360) + 360) % 360;
  
  return asc;
}

/**
 * Calculate MC (Medium Coeli / Midheaven)
 */
function calculateMC(lst, obliquity) {
  const lstRad = lst * 15 * DEG2RAD;
  const oblRad = obliquity * DEG2RAD;
  
  // RAMC (Right Ascension of MC) = LST converted to degrees
  const ramcDeg = (lst * 15 + 360) % 360;
  
  // MC longitude from RAMC
  let mc = Math.atan2(Math.sin(ramcDeg * DEG2RAD), Math.cos(ramcDeg * DEG2RAD) * Math.cos(oblRad)) * RAD2DEG;
  mc = ((mc % 360) + 360) % 360;
  
  // Quadrant correction: MC should be in the same hemisphere as RAMC
  // If RAMC is 0-180 (upper), MC should also be 0-180
  // If RAMC is 180-360, MC should be 180-360
  if (ramcDeg >= 0 && ramcDeg < 180 && mc >= 180) mc -= 180;
  if (ramcDeg >= 180 && ramcDeg < 360 && mc < 180) mc += 180;
  
  mc = ((mc % 360) + 360) % 360;
  
  return mc;
}

// ═══════════════════════════════════════════════════════════════
//  HOUSE CUSPS (Equal House System from ASC)
// ═══════════════════════════════════════════════════════════════

/**
 * Equal House System — En güvenilir ve basit.
 * Her ev ASC'den itibaren eşit 30° dilimler.
 * Not: Placidus daha yaygın ama yüksek enlemlerde sorunlu ve matematik çok karmaşık.
 * Equal house, mobile app için en ideali.
 */
function calculateHouseCusps(ascDeg) {
  const cusps = [];
  for (let i = 0; i < 12; i++) {
    const cusp = (ascDeg + i * 30) % 360;
    cusps.push({
      house: i + 1,
      cusp: cusp,
      ...getZodiacInfo(cusp)
    });
  }
  return cusps;
}

/**
 * Bir gezegenin hangi evde olduğunu belirle
 */
function getHouseForPlanet(planetDeg, cusps) {
  for (let i = 0; i < 12; i++) {
    const thisHouse = cusps[i].cusp;
    const nextHouse = cusps[(i + 1) % 12].cusp;
    
    if (nextHouse > thisHouse) {
      // Normal durum
      if (planetDeg >= thisHouse && planetDeg < nextHouse) {
        return i + 1;
      }
    } else {
      // 360°/0° sınırını geçen dilim
      if (planetDeg >= thisHouse || planetDeg < nextHouse) {
        return i + 1;
      }
    }
  }
  return 1; // fallback
}

// ═══════════════════════════════════════════════════════════════
//  MAIN CALCULATION: calculateNatalChart
// ═══════════════════════════════════════════════════════════════

export function calculateNatalChart(birthDateInput, birthTimeStr, birthPlace, birthDistrict) {
  try {
    // ── 1. Parse date ──
    let dateStr;
    if (typeof birthDateInput === 'string') {
      dateStr = birthDateInput;
    } else if (birthDateInput && typeof birthDateInput === 'object') {
      const { day, month, year } = birthDateInput;
      dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } else {
      console.error('AstroEngine: Invalid birthDate input', birthDateInput);
      return null;
    }

    // ── 2. Parse time ──
    const hasBirthTime = birthTimeStr && birthTimeStr !== '' && birthTimeStr !== null;
    const timeToUse = hasBirthTime ? birthTimeStr : '12:00';
    const dateObj = new Date(`${dateStr}T${timeToUse}:00`);
    
    if (isNaN(dateObj.getTime())) {
      console.error('AstroEngine: Invalid date produced', dateStr, timeToUse);
      return null;
    }

    const time = new AstroTime(dateObj);
    
    // ── 3. Get coordinates ──
    const coords = getCoordinates(birthPlace, birthDistrict);
    const ob = new Observer(coords.lat, coords.lng, 0);

    // ── 4. Calculate planetary positions ──
    const getElon = (body) => {
      const eq = Equator(body, time, ob, true, true);
      return Ecliptic(eq.vec).elon;
    };

    const chart = {};
    
    // 10 ana gezegen
    for (const planet of PLANET_BODIES) {
      const lon = getElon(planet.body);
      const info = getZodiacInfo(lon);
      const retro = isRetrograde(planet.body, time);
      
      chart[planet.key] = {
        ...info,
        label: planet.label,
        glyph: planet.glyph,
        key: planet.key,
        retrograde: retro,
        weight: planet.weight
      };
    }
    
    // Kuzey Düğüm
    const northNode = calculateNorthNode(time);
    chart.northNode = {
      ...northNode,
      label: 'Kuzey Düğüm',
      glyph: '☊',
      key: 'northNode',
      retrograde: false, // Node'lar genellikle retrograde kabul edilir ama gösterime gerek yok
      weight: 0.5
    };

    // ── 5. Ascendant, MC & Houses (sadece doğum saati varsa) ──
    chart.hasBirthTime = hasBirthTime;
    
    if (hasBirthTime) {
      const gst = SiderealTime(time); // Greenwich Sidereal Time (hours)
      const lst = gst + (coords.lng / 15); // Local Sidereal Time
      const obliquity = getObliquity(time);
      
      const ascDeg = calculateAscendant(lst, coords.lat, obliquity);
      const mcDeg  = calculateMC(lst, obliquity);
      const icDeg  = (mcDeg + 180) % 360;
      const dcDeg  = (ascDeg + 180) % 360;
      
      chart.ascendant = {
        ...getZodiacInfo(ascDeg),
        label: 'Yükselen',
        glyph: 'ASC',
        absoluteDegree: ascDeg
      };
      
      chart.mc = {
        ...getZodiacInfo(mcDeg),
        label: 'Gökyüzü Ortası',
        glyph: 'MC',
        absoluteDegree: mcDeg
      };
      
      chart.ic = {
        ...getZodiacInfo(icDeg),
        label: 'Kök',
        glyph: 'IC',
        absoluteDegree: icDeg
      };
      
      chart.dc = {
        ...getZodiacInfo(dcDeg),
        label: 'Alçalan',
        glyph: 'DC',
        absoluteDegree: dcDeg
      };
      
      // House cusps
      const cusps = calculateHouseCusps(ascDeg);
      chart.houses = cusps;
      
      // Her gezegene ev bilgisi ekle
      for (const planet of [...PLANET_BODIES, { key: 'northNode' }]) {
        if (chart[planet.key]) {
          chart[planet.key].house = getHouseForPlanet(chart[planet.key].absoluteDegree, cusps);
        }
      }
    } else {
      chart.ascendant = null;
      chart.mc = null;
      chart.ic = null;
      chart.dc = null;
      chart.houses = null;
    }

    return chart;
  } catch (err) {
    console.error('AstroMath Hatası:', err);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
//  DAILY TRANSITS
// ═══════════════════════════════════════════════════════════════

export function calculateDailyTransits() {
  const time = new AstroTime(new Date());
  const ob = new Observer(0, 0, 0);
  
  const getElon = (body) => {
    const eq = Equator(body, time, ob, true, true);
    return Ecliptic(eq.vec).elon;
  };
  
  return {
    sun: getZodiacInfo(getElon(Body.Sun)),
    moon: getZodiacInfo(getElon(Body.Moon)),
    mercury: getZodiacInfo(getElon(Body.Mercury)),
    venus: getZodiacInfo(getElon(Body.Venus)),
    mars: getZodiacInfo(getElon(Body.Mars)),
  };
}

// ═══════════════════════════════════════════════════════════════
//  ELEMENTS, MODALITY & POLARITY BALANCE
// ═══════════════════════════════════════════════════════════════

export function calculateElements(chart) {
  if (!chart || !chart.sun) return [];
  
  const planetKeys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const counts = { 'Ateş': 0, 'Toprak': 0, 'Hava': 0, 'Su': 0 };
  
  planetKeys.forEach(pKey => {
    const p = chart[pKey];
    if (p?.element && counts[p.element] !== undefined) {
      counts[p.element] += p.weight || 1;
    }
  });

  const totalPoints = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const percentages = Object.keys(counts).map(el => ({
    name: el,
    percentage: Math.round((counts[el] / totalPoints) * 100),
    points: counts[el]
  }));

  return percentages.sort((a, b) => b.percentage - a.percentage);
}

export function calculateModality(chart) {
  if (!chart || !chart.sun) return [];
  
  const planetKeys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const counts = { 'Kardinal': 0, 'Sabit': 0, 'Değişken': 0 };
  
  planetKeys.forEach(pKey => {
    const p = chart[pKey];
    if (p?.modality && counts[p.modality] !== undefined) {
      counts[p.modality] += p.weight || 1;
    }
  });

  const totalPoints = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return Object.keys(counts).map(m => ({
    name: m,
    percentage: Math.round((counts[m] / totalPoints) * 100),
    points: counts[m]
  })).sort((a, b) => b.percentage - a.percentage);
}

export function calculatePolarity(chart) {
  if (!chart || !chart.sun) return [];
  
  const planetKeys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const counts = { 'Aktif': 0, 'Pasif': 0 };
  
  planetKeys.forEach(pKey => {
    const p = chart[pKey];
    if (p?.polarity && counts[p.polarity] !== undefined) {
      counts[p.polarity] += p.weight || 1;
    }
  });

  const totalPoints = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return Object.keys(counts).map(p => ({
    name: p,
    percentage: Math.round((counts[p] / totalPoints) * 100),
    points: counts[p]
  })).sort((a, b) => b.percentage - a.percentage);
}

// ═══════════════════════════════════════════════════════════════
//  ASPECTS (Top 6 tightest major aspects)
// ═══════════════════════════════════════════════════════════════

export function calculateAspects(chart) {
  if (!chart || !chart.sun) return [];
  
  const bodies = [
    { key: 'sun',     label: 'Güneş',   glyph: '☉' },
    { key: 'moon',    label: 'Ay',      glyph: '☽' },
    { key: 'mercury', label: 'Merkür',  glyph: '☿' },
    { key: 'venus',   label: 'Venüs',   glyph: '♀' },
    { key: 'mars',    label: 'Mars',    glyph: '♂' },
    { key: 'jupiter', label: 'Jüpiter', glyph: '♃' },
    { key: 'saturn',  label: 'Satürn',  glyph: '♄' },
    { key: 'uranus',  label: 'Uranüs',  glyph: '♅' },
    { key: 'neptune', label: 'Neptün',  glyph: '♆' },
    { key: 'pluto',   label: 'Plüton',  glyph: '♇' },
  ];

  const aspectTypes = [
    { type: 'Kavuşum',   angle: 0,   orb: 8, color: '#6bcb77', lineStyle: 'solid',  harmony: 'nötr',    icon: '☌' },
    { type: 'Altmışlık', angle: 60,  orb: 5, color: '#74d7ff', lineStyle: 'dashed', harmony: 'uyumlu',  icon: '⚹' },
    { type: 'Kare',      angle: 90,  orb: 7, color: '#ff5555', lineStyle: 'solid',  harmony: 'gerilim', icon: '□' },
    { type: 'Üçgen',     angle: 120, orb: 7, color: '#00d2ff', lineStyle: 'solid',  harmony: 'uyumlu',  icon: '△' },
    { type: 'Karşıt',    angle: 180, orb: 8, color: '#ff9500', lineStyle: 'solid',  harmony: 'gerilim', icon: '☍' },
  ];

  const aspects = [];

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const b1 = bodies[i];
      const b2 = bodies[j];
      const d1 = chart[b1.key]?.absoluteDegree;
      const d2 = chart[b2.key]?.absoluteDegree;

      if (d1 === undefined || d2 === undefined) continue;

      let diff = Math.abs(d1 - d2);
      if (diff > 180) diff = 360 - diff;

      for (const aspect of aspectTypes) {
        const orbValue = Math.abs(diff - aspect.angle);
        if (orbValue <= aspect.orb) {
          aspects.push({
            planet1: b1.label,
            planet1Key: b1.key,
            planet1Glyph: b1.glyph,
            planet2: b2.label,
            planet2Key: b2.key,
            planet2Glyph: b2.glyph,
            type: aspect.type,
            angle: aspect.angle,
            orbValue: orbValue,
            orbStr: orbValue.toFixed(1),
            color: aspect.color,
            lineStyle: aspect.lineStyle,
            harmony: aspect.harmony,
            icon: aspect.icon,
            description: getAspectDescription(b1.label, b2.label, aspect.type),
            // For drawing lines on chart
            deg1: d1,
            deg2: d2,
            // Tightness score (lower orb = stronger)
            strength: 1 - (orbValue / aspect.orb)
          });
        }
      }
    }
  }

  // Return top 6 tightest (most significant) aspects
  return aspects
    .sort((a, b) => a.orbValue - b.orbValue)
    .slice(0, 6);
}

function getAspectDescription(p1, p2, type) {
  if (type === 'Kavuşum') {
    return `${p1} ve ${p2} güçlerini birleştirmiş; bu bölgede büyük bir enerji potansiyelin var. İki gücün tek bir noktada buluşması, seni bu alanda özel kılıyor.`;
  }
  if (type === 'Üçgen') {
    return `${p1} ile ${p2} arasında doğal bir uyum ve akış var. Bu yetenek sana doğuştan verilmiş; zorlanmadan, neredeyse farkında olmadan kullanıyorsun.`;
  }
  if (type === 'Altmışlık') {
    return `${p1} ve ${p2} birbirini destekleyen bir açıda. Bu fırsat enerjisini bilinçli kullandığında, beklemediğin kapılar açılabilir.`;
  }
  if (type === 'Kare') {
    return `${p1} ve ${p2} arasında güçlü bir gerilim var. Bu sürtüşme seni zorlasa da, en büyük dönüşümlerini ve büyümeni bu alandan yaşarsın.`;
  }
  if (type === 'Karşıt') {
    return `${p1} ve ${p2} birbirine tam karşı — bir tahterevalli gibi. Bu zıtlığı dengelemeyi öğrendiğinde, her iki gücün de efendisi olursun.`;
  }
  return `${p1} ve ${p2} arasında anlamlı bir kozmik bağlantı var.`;
}
