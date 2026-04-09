import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch } from '../context/AppContext';
import CassiopeiaLogo from './CassiopeiaLogo';

/* ─────────────────────────────────────────────
   Yıldız Üreticileri
   ───────────────────────────────────────────── */

// Derin Uzay: sabit, yanıp sönen küçük noktalar (en arka plan, sürekli var)
function generateDeepStars(count = 70) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const sizeRoll = Math.random();
    const size = sizeRoll < 0.25 ? 2 : sizeRoll < 0.55 ? 1.2 : 0.6;
    stars.push({
      id: `deep-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size,
      baseOpacity: 0.1 + Math.random() * 0.5,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3,
      // %10 ihtimalle hafif cyan tonu
      isCyan: Math.random() < 0.1,
    });
  }
  return stars;
}

// Warp meteorları: app'teki meteor-shower stiliyle çapraz kayan
// ease-out ile kendi içlerinde yavaşlıyorlar (swap değil, deceleration)
function generateWarpMeteors(count = 24) {
  const meteors = [];
  for (let i = 0; i < count; i++) {
    const depthRoll = Math.random();
    let width, height, glowSize, opacity, speed;

    if (depthRoll < 0.2) {
      width = 2.5 + Math.random() * 1;
      height = 130 + Math.random() * 50;
      glowSize = 12;
      opacity = 0.8 + Math.random() * 0.2;
      speed = 1.0 + Math.random() * 0.4;
    } else if (depthRoll < 0.55) {
      width = 1.5 + Math.random() * 0.8;
      height = 80 + Math.random() * 50;
      glowSize = 8;
      opacity = 0.4 + Math.random() * 0.3;
      speed = 1.2 + Math.random() * 0.5;
    } else {
      width = 0.8 + Math.random() * 0.5;
      height = 40 + Math.random() * 40;
      glowSize = 4;
      opacity = 0.15 + Math.random() * 0.2;
      speed = 1.4 + Math.random() * 0.6;
    }

    const startLeft = -5 + Math.random() * 75;
    const startTop = -10 + Math.random() * 80;
    // %12 ihtimalle cyan glow
    const isCyan = Math.random() < 0.12;

    meteors.push({
      id: `warp-${i}`,
      width, height, glowSize, opacity, speed,
      startLeft, startTop, isCyan,
      delay: Math.random() * 1.0,
    });
  }
  return meteors;
}

// Asılı kalan yıldızlar: warp sonrası havada durup nefes alan noktalar
function generateHangingStars(count = 12) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const size = 1 + Math.random() * 2.5;
    stars.push({
      id: `hang-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size,
      opacity: 0.3 + Math.random() * 0.5,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      isCyan: Math.random() < 0.15,
    });
  }
  return stars;
}

// Yavaş süzülen meteorlar: app'teki normal hıza benzer (9s civarı)
function generateSlowMeteors(count = 4) {
  const meteors = [];
  for (let i = 0; i < count; i++) {
    meteors.push({
      id: `slow-${i}`,
      width: 1.5 + Math.random() * 1,
      height: 80 + Math.random() * 60,
      opacity: 0.15 + Math.random() * 0.25,
      glowSize: 6,
      startLeft: -5 + Math.random() * 75,
      startTop: -10 + Math.random() * 80,
      delay: Math.random() * 4,
      speed: 7 + Math.random() * 4,
      isCyan: Math.random() < 0.15,
    });
  }
  return meteors;
}

export default function WelcomeScreen() {
  const dispatch = useAppDispatch();
  const [phase, setPhase] = useState('warp'); // 'warp' → 'decel' → 'calm'
  const [showLogo, setShowLogo] = useState(false);

  const deepStars = useMemo(() => generateDeepStars(70), []);
  const warpMeteors = useMemo(() => generateWarpMeteors(24), []);
  const hangingStars = useMemo(() => generateHangingStars(12), []);
  const slowMeteors = useMemo(() => generateSlowMeteors(4), []);

  useEffect(() => {
    // Faz 1: Warp (0 - 1.3s) — Sadece hızlı meteorlar
    // Faz 2: Deceleration (1.3s) — Meteorlar yavaşlamaya başlıyor, logo beliriyor
    const decelTimer = setTimeout(() => {
      setPhase('decel');
      setShowLogo(true);
    }, 1300);

    // Faz 3: Calm (2.2s) — Meteorlar tamamen durdu/çok yavaş, asılı yıldızlar
    const calmTimer = setTimeout(() => {
      setPhase('calm');
    }, 2200);

    // Otomatik geçiş
    const proceedTimer = setTimeout(() => {
      dispatch({ type: 'HIDE_WELCOME' });
    }, 5500);

    return () => {
      clearTimeout(decelTimer);
      clearTimeout(calmTimer);
      clearTimeout(proceedTimer);
    };
  }, [dispatch]);

  /* Meteor gradient rengi */
  const meteorGradient = (isCyan) => isCyan
    ? 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(100,220,255,0.5) 70%, rgba(150,240,255,1) 100%)'
    : 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(200,220,255,0.5) 70%, rgba(255,255,255,1) 100%)';

  const meteorGlow = (size, isCyan) => isCyan
    ? `drop-shadow(0 0 ${size}px rgba(100, 220, 255, 0.9))`
    : `drop-shadow(0 0 ${size}px rgba(255, 255, 255, 0.9))`;

  return (
    <div className="welcome-screen" style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#030306',
    }}>
      {/* APP EKRANI — 430px sınır */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '430px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>

        {/* ═══════════════ KATMAN 1: DERİN UZAY ═══════════════ */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {deepStars.map(star => (
            <div
              key={star.id}
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                borderRadius: '50%',
                background: star.isCyan ? '#a0e8ff' : '#fff',
                opacity: star.baseOpacity,
                animation: `welcome-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite alternate`,
                boxShadow: star.size > 1.5
                  ? `0 0 ${star.size * 3}px ${star.isCyan ? 'rgba(100, 220, 255, 0.4)' : 'rgba(200, 220, 255, 0.4)'}`
                  : 'none',
              }}
            />
          ))}
        </div>

        {/* ═══════════════ KATMAN 2: WARP METEORLARI ═══════════════
            ease-out ile kendi içlerinde yavaşlıyorlar.
            'decel' fazında opacity düşüyor, 'calm' fazında kayboluyor.
        ═══════════════════════════════════════════════════════════ */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          opacity: phase === 'calm' ? 0 : phase === 'decel' ? 0.3 : 1,
          transition: phase === 'calm' ? 'opacity 0.8s ease-out' : 'opacity 0.6s ease-out',
        }}>
          {warpMeteors.map(m => (
            <div
              key={m.id}
              style={{
                position: 'absolute',
                left: `${m.startLeft}%`,
                top: `${m.startTop}%`,
                width: `${m.width}px`,
                height: `${m.height}px`,
                borderRadius: `0 0 ${m.width}px ${m.width}px`,
                background: meteorGradient(m.isCyan),
                opacity: 0,
                filter: meteorGlow(m.glowSize, m.isCyan),
                pointerEvents: 'none',
                animation: `welcome-warp-meteor ${m.speed}s cubic-bezier(0.1, 0.6, 0.3, 1) ${m.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* ═══════════════ KATMAN 3: ASILI YILDIZLAR ═══════════════
            Warp sonrası havada durup nefes alan noktalar
        ═══════════════════════════════════════════════════════════ */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          opacity: phase === 'warp' ? 0 : 1,
          transition: 'opacity 1.5s ease-in',
        }}>
          {hangingStars.map(star => (
            <div
              key={star.id}
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                borderRadius: '50%',
                background: star.isCyan ? '#a0e8ff' : '#fff',
                boxShadow: `0 0 ${star.size * 4}px ${star.isCyan ? 'rgba(100, 220, 255, 0.5)' : 'rgba(200, 220, 255, 0.5)'}`,
                animation: `welcome-hang-pulse ${star.duration}s ease-in-out ${star.delay}s infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* ═══════════════ KATMAN 4: YAVAŞ METEORLAR ═══════════════
            App'teki normal meteor hızında (~9s), calm fazda süzülür
        ═══════════════════════════════════════════════════════════ */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          opacity: phase === 'warp' ? 0 : phase === 'decel' ? 0.4 : 1,
          transition: 'opacity 1.5s ease-in',
        }}>
          {slowMeteors.map(m => (
            <div
              key={m.id}
              style={{
                position: 'absolute',
                left: `${m.startLeft}%`,
                top: `${m.startTop}%`,
                width: `${m.width}px`,
                height: `${m.height}px`,
                borderRadius: `0 0 ${m.width}px ${m.width}px`,
                background: meteorGradient(m.isCyan),
                opacity: 0,
                filter: meteorGlow(m.glowSize, m.isCyan),
                pointerEvents: 'none',
                animation: `welcome-slow-meteor ${m.speed}s linear ${m.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* ═══════════════ NEBULA AMBİYANS ═══════════════ */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(60, 40, 120, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 30%, rgba(30, 60, 120, 0.04) 0%, transparent 50%)
          `,
          opacity: phase !== 'warp' ? 1 : 0,
          transition: 'opacity 2s ease',
          pointerEvents: 'none',
        }} />

        {/* ═══════════════ LOGO ═══════════════
            Sadece warp yavaşladığında beliriyor (showLogo = true @ 1.3s)
        ═══════════════════════════════════════ */}
        <div style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          transform: showLogo ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-90deg)',
          opacity: showLogo ? 1 : 0,
          transition: 'all 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 10,
        }}>
          {/* Logo arkası halo */}
          <div style={{
            position: 'absolute',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200, 210, 255, 0.08) 0%, transparent 70%)',
            opacity: phase === 'calm' ? 1 : 0,
            transition: 'opacity 1.5s ease',
            pointerEvents: 'none',
          }} />
          <CassiopeiaLogo
            size={180}
            isLoading={true}
            color="var(--accent)"
          />
        </div>

        {/* ═══════════════ KARŞILAMA YAZISI ═══════════════
            Logo'dan 0.5s sonra beliriyor
        ═══════════════════════════════════════════════════ */}
        <div style={{
          textAlign: 'center',
          transform: showLogo ? 'translateY(0)' : 'translateY(30px)',
          opacity: showLogo ? 1 : 0,
          transition: 'all 1.2s ease 0.5s',
          zIndex: 10,
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Cassiopeia'ya Hoş Geldiniz
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            opacity: 0.8,
            letterSpacing: '0.02em',
            fontWeight: '300'
          }}>
            Fala dair her şeyiniz.
          </p>
        </div>

        {/* ═══════════════ İLERLEME ÇİZGİSİ ═══════════════ */}
        <div style={{
          position: 'absolute',
          bottom: '80px',
          width: '120px',
          height: '1px',
          background: 'rgba(255,255,255,0.1)',
          overflow: 'hidden',
          zIndex: 10,
          opacity: showLogo ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'var(--accent-gradient)',
            animation: showLogo ? 'welcome-loading-line 3.5s forwards ease-in-out' : 'none',
          }} />
        </div>

      </div>{/* /app-ekranı */}

      {/* ═══════════════════════════════════════════
          CSS ANİMASYONLARI
      ═══════════════════════════════════════════ */}
      <style>{`
        /* Derin uzay: yumuşak yanıp sönme */
        @keyframes welcome-twinkle {
          0%   { opacity: 0.08; transform: scale(0.8); }
          50%  { opacity: 1;    transform: scale(1.15); }
          100% { opacity: 0.12; transform: scale(0.9); }
        }

        /* Warp meteorları — app'teki ile aynı yön
           cubic-bezier(0.1, 0.6, 0.3, 1) = hızlı başlar, kendi kendine yavaşlar */
        @keyframes welcome-warp-meteor {
          0%   { transform: translateX(0)     translateY(0)     rotate(-70deg); opacity: 0; }
          6%   { opacity: 1; }
          85%  { opacity: 0.8; }
          100% { transform: translateX(560px) translateY(200px) rotate(-70deg); opacity: 0; }
        }

        /* Yavaş meteorlar — app'teki 9s döngüye yakın */
        @keyframes welcome-slow-meteor {
          0%   { transform: translateX(0)     translateY(0)     rotate(-70deg); opacity: 0; }
          6%   { opacity: 1; }
          45%  { transform: translateX(560px) translateY(200px) rotate(-70deg); opacity: 0; }
          100% { transform: translateX(560px) translateY(200px) rotate(-70deg); opacity: 0; }
        }

        /* Asılı yıldızlar — havada durup nefes alıyor */
        @keyframes welcome-hang-pulse {
          0%   { opacity: 0.15; transform: scale(0.7); }
          50%  { opacity: 0.9;  transform: scale(1.3); }
          100% { opacity: 0.2;  transform: scale(0.8); }
        }

        /* İlerleme çizgisi */
        @keyframes welcome-loading-line {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
