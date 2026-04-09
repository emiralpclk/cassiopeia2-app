import { useState, useRef, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { TAROT_DECK, TAROT_SLOTS } from '../../utils/constants';
import CassiopeiaLogo from '../../components/CassiopeiaLogo';

export default function TarotSelection({ step }) {
  const { currentFortune } = useAppState();
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [holdingSlot, setHoldingSlot] = useState(null);
  const [slotProgress, setSlotProgress] = useState({});
  const [shakingCard, setShakingCard] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const holdTimer = useRef(null);
  const slotHoldTimer = useRef(null);

  // Ritual Logic: Optimized interval handling
  useEffect(() => {
    if (isHolding) {
      holdTimer.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(holdTimer.current);
            return 100;
          }
          return prev + 0.5; // ~4 saniye sürecek (20ms * 200 adım)
        });
      }, 20);
    } else {
      clearInterval(holdTimer.current);
      if (progress < 100) setProgress(0);
    }
    return () => clearInterval(holdTimer.current);
  }, [isHolding]);

  // Handle transition when progress hits 100
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        dispatch({ type: 'SET_TAROT_STEP', payload: 'selection' });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, dispatch]);

  const handleCardSelect = (card) => {
    if (selectedCards.length >= 3) return;
    if (selectedCards.find(c => c.id === card.id)) return;
    
    if (navigator.vibrate) navigator.vibrate(20);
    
    const newSelected = [...selectedCards, { ...card, slot: TAROT_SLOTS[selectedCards.length].id }];
    setSelectedCards(newSelected);
  };

  // Kart basılı tutma mekaniği (1.5 sn)
  useEffect(() => {
    if (holdingSlot) {
      if (navigator.vibrate) navigator.vibrate(20);
      setShakingCard(holdingSlot);
      
      let stepCount = 0;
      slotHoldTimer.current = setInterval(() => {
        stepCount++;
        if (navigator.vibrate && stepCount % 5 === 0) navigator.vibrate(10);
        
        setSlotProgress(prev => {
          const current = prev[holdingSlot] || 0;
          if (current >= 100) {
            clearInterval(slotHoldTimer.current);
            setHoldingSlot(null);
            setShakingCard(null);
            if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
            return { ...prev, [holdingSlot]: 100 };
          }
          // 1.5 sn = 1500ms -> step = 30ms -> 50 adım -> adım başına 2
          return { ...prev, [holdingSlot]: Math.min(current + 2, 100) };
        });
      }, 30);
    } else {
      clearInterval(slotHoldTimer.current);
      setShakingCard(null);
      setSlotProgress(prev => {
        const newProgress = { ...prev };
        let changed = false;
        Object.keys(newProgress).forEach(id => {
          if (newProgress[id] > 0 && newProgress[id] < 100) {
            newProgress[id] = 0;
            changed = true;
          }
        });
        return changed ? newProgress : prev;
      });
    }
    return () => clearInterval(slotHoldTimer.current);
  }, [holdingSlot]);

  // Sonuç ekranına geçiş kontrolü
  useEffect(() => {
    if (selectedCards.length === 3) {
      const allRevealedCount = selectedCards.filter(c => (slotProgress[c.id] || 0) >= 100).length;
      if (allRevealedCount === 3 && !isTransitioning) {
        const t1 = setTimeout(() => {
          setIsTransitioning(true);
        }, 4000);
        return () => clearTimeout(t1);
      }
    }
  }, [slotProgress, selectedCards, isTransitioning]);

  useEffect(() => {
    if (isTransitioning) {
      const t2 = setTimeout(() => {
        dispatch({ type: 'SET_TAROT_CARDS', payload: selectedCards });
        dispatch({ type: 'SET_TAROT_STEP', payload: 'results' });
      }, 10000);
      return () => clearTimeout(t2);
    }
  }, [isTransitioning, selectedCards, dispatch]);

  const renderRitual = () => (
    <div className="page tarot-ritual-page fade-in" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', paddingTop: '60px' }}>
      <button 
        onClick={() => dispatch({ type: 'RESET_FORTUNE' })}
        style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '14px', zIndex: 100 }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
        Masadan Ayrıl
      </button>

      {/* Top Visual — Cassiopeia Logo */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ filter: 'drop-shadow(0 0 18px var(--accent-glow))' }}>
          <CassiopeiaLogo size={100} color="var(--accent)" isLoading={false} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '26px', marginBottom: '8px', fontWeight: 'bold', letterSpacing: '-0.02em', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Desteni Kar</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '280px', margin: '0 auto', lineHeight: '1.6' }}>
          Ortadaki mühüre basılı tutarak desteni kar ve niyetine odaklan...
        </p>
      </div>

      {/* Center Interaction Button with Ring */}
      <div style={{ position: 'relative', width: '120px', height: '120px', margin: '20px auto 40px' }}>
        {/* Aesthetic Circular Progress */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', transform: 'rotate(-90deg)' }}>
          <circle cx="60" cy="60" r="56" fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle 
            cx="60" cy="60" r="56" 
            fill="none" 
            stroke="var(--accent)" 
            strokeWidth="4" 
            strokeDasharray={`${progress * 3.51}, 1000`} 
            strokeLinecap="round" 
            style={{ transition: 'stroke-dasharray 0.1s linear', filter: 'drop-shadow(0 0 4px var(--accent))' }} 
          />
        </svg>

        {/* Hold Button */}
        <div 
          className={isHolding ? 'ritual-active' : ''}
          onMouseDown={() => setIsHolding(true)}
          onMouseUp={() => setIsHolding(false)}
          onMouseLeave={() => setIsHolding(false)}
          onTouchStart={() => setIsHolding(true)}
          onTouchEnd={() => setIsHolding(false)}
          style={{ 
            position: 'absolute', 
            top: '10px', 
            left: '10px', 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'var(--bg-elevated)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer', 
            transform: isHolding ? undefined : 'scale(1)', 
            transition: 'all 0.2s', 
            boxShadow: isHolding ? undefined : 'none',
            border: `1px solid ${isHolding ? 'var(--accent)' : 'var(--border)'}`,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
        >
          <span className="material-symbols-outlined" style={{ 
            fontSize: '40px', 
            color: isHolding ? 'var(--accent)' : 'var(--text-muted)', 
            transition: 'color 0.2s',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}>fingerprint</span>
        </div>
      </div>

      {/* Bottom Shuffling Deck */}
      <div className="tarot-shuffling-deck" style={{ marginTop: '40px', marginBottom: '40px' }}>
        {/* Left Card */}
        <div className={`tarot-card-modern ${isHolding ? 'ritual-card-fast-1' : ''}`} style={{
          position: 'absolute',
          width: '80px', height: '130px',
          transform: isHolding ? undefined : 'rotate(-12deg) translateX(-35px)',
          transition: 'transform 0.4s ease'
        }}>
          <div className="tarot-card-shimmer"></div>
        </div>
        
        {/* Center Card */}
        <div className={`tarot-card-modern ${isHolding ? 'ritual-card-fast-2' : ''}`} style={{
          position: 'absolute',
          width: '80px', height: '130px',
          transform: isHolding ? undefined : 'rotate(0deg)',
          zIndex: 2,
          transition: 'transform 0.4s ease',
        }}>
          <div className="tarot-card-shimmer"></div>
        </div>

        {/* Right Card */}
        <div className={`tarot-card-modern ${isHolding ? 'ritual-card-fast-3' : ''}`} style={{
          position: 'absolute',
          width: '80px', height: '130px',
          transform: isHolding ? undefined : 'rotate(12deg) translateX(35px)',
          transition: 'transform 0.4s ease'
        }}>
          <div className="tarot-card-shimmer"></div>
        </div>
      </div>
    </div>
  );

  if (isTransitioning) {
    return (
      <div className="page fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '28px',
        background: 'radial-gradient(ellipse at center, rgba(80,200,120,0.08) 0%, transparent 70%)'
      }}>
        <style>{`
          @keyframes emerald-pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.08); }
          }
          @keyframes dot-blink {
            0%, 20% { opacity: 0; }
            50% { opacity: 1; }
            80%, 100% { opacity: 0; }
          }
          .reading-dot-1 { animation: dot-blink 1.2s 0s infinite; }
          .reading-dot-2 { animation: dot-blink 1.2s 0.3s infinite; }
          .reading-dot-3 { animation: dot-blink 1.2s 0.6s infinite; }
        `}</style>

        {/* Cassiopeia Logo */}
        <div style={{
          filter: 'drop-shadow(0 0 20px rgba(80,200,120,0.6))',
          animation: 'emerald-pulse 2s ease-in-out infinite'
        }}>
          <CassiopeiaLogo size={110} color="#50c878" isLoading={true} />
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '18px',
            fontWeight: '600',
            letterSpacing: '0.06em',
            color: 'var(--accent)',
            marginBottom: '8px',
            textShadow: '0 0 20px rgba(80,200,120,0.6)'
          }}>
            Zümrüt Mührü Okunuyor
            <span className="reading-dot-1">.</span>
            <span className="reading-dot-2">.</span>
            <span className="reading-dot-3">.</span>
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
            Evrenin sesleri yorumlanıyor
          </p>
        </div>

        {/* Cards preview row */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          {selectedCards.map((card, i) => (
            <div key={i} style={{
              width: '70px',
              height: '110px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(80,200,120,0.4)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              animation: `emerald-pulse 2s ${i * 0.3}s ease-in-out infinite`
            }}>
              <img src={card.img} alt={card.nameTr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderSelection = () => (
    <div className="page tarot-selection-page fade-in" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <style>{`
        @keyframes custom-shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          20% { transform: translate(-2px, -1px) rotate(-1deg); }
          40% { transform: translate(1px, -2px) rotate(1deg); }
          60% { transform: translate(-2px, 2px) rotate(0deg); }
          80% { transform: translate(2px, 1px) rotate(-1deg); }
          100% { transform: translate(-1px, -1px) rotate(0deg); }
        }
        .tap-glowing {
          box-shadow: 0 0 15px rgba(80, 200, 120, 0.4), 0 0 30px rgba(80, 200, 120, 0.2) !important;
        }
        .tap-glowing-more {
          box-shadow: 0 0 25px rgba(80, 200, 120, 0.6), 0 0 50px rgba(80, 200, 120, 0.4) !important;
        }
      `}</style>
      <button 
        onClick={() => dispatch({ type: 'RESET_FORTUNE' })}
        style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '14px', zIndex: 100 }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
        Masadan Ayrıl
      </button>
      <div className="page-header" style={{ textAlign: 'center', flexShrink: 0, padding: '20px 0 10px' }}>
        <h2 style={{ fontSize: '20px' }}>Zümrüt Destesi</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {selectedCards.length < 3 ? "Mührü açmak için sırasıyla 3 kart seç" : "Mühürleri kırmak için kartlara 1.5 saniye basılı tut"}
        </p>
      </div>

      <div className="card-fan" style={{ 
        position: 'relative', 
        height: '240px', // Reduced height for the fan
        display: 'flex',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {/* Simplified Fan for 3-card spread */}
        {TAROT_DECK.map((card, index) => {
          const selectedIndex = selectedCards.findIndex(c => c.id === card.id);
          const isSelected = selectedIndex !== -1;
          const xMove = selectedIndex === 0 ? -120 : selectedIndex === 2 ? 120 : 0;
          const angle = (index - 10.5) * 6; // Fan out 22 cards tighter

          return (
            <div 
              key={card.id}
              className="tarot-card-modern"
              onClick={() => handleCardSelect(card)}
              style={{
                position: 'absolute',
                width: '60px', 
                height: '95px',
                cursor: isSelected ? 'default' : 'pointer',
                transformOrigin: '50% 280px', 
                transform: `translateX(calc(-50% + ${isSelected ? xMove : 0}px)) rotate(${isSelected ? 0 : angle}deg) ${isSelected ? 'translateY(400px) scale(0)' : ''}`, 
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isSelected ? 0 : 1,
                zIndex: 22 - index,
                left: '50%',
                top: '20px',
                pointerEvents: isSelected ? 'none' : 'auto',
              }}
            >
              <div className="tarot-card-shimmer"></div>
            </div>
          );
        })}
      </div>

      {/* BIG BOTTOM SLOTS */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px', 
        marginTop: 'auto',
        paddingBottom: '20px',
        flexGrow: 1,
        alignItems: 'center'
      }}>
        {TAROT_SLOTS.map((slot, idx) => {
          const card = selectedCards[idx];
          const prog = card ? (slotProgress[card.id] || 0) : 0;
          const isRevealed = prog >= 100;
          const isHoldingThis = holdingSlot === card?.id;
          let containerClass = "";
          if (card && !isRevealed) containerClass = "tarot-card-modern fade-in";
          if (!card) containerClass = "cosmic-slot-empty fade-in";

          return (
            <div key={slot.id} style={{ 
              width: '100px', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              {/* Card Container */}
              <div 
                className={containerClass} 
                onMouseDown={() => card && !isRevealed && setHoldingSlot(card.id)}
                onMouseUp={() => setHoldingSlot(null)}
                onMouseLeave={() => setHoldingSlot(null)}
                onTouchStart={() => card && !isRevealed && setHoldingSlot(card.id)}
                onTouchEnd={() => setHoldingSlot(null)}
                style={{
                width: '100px',
                height: '160px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: (card && !isRevealed && prog > 0) 
                  ? `0 0 ${15 + prog * 0.3}px rgba(80, 200, 120, ${0.2 + prog * 0.006})`
                  : isRevealed 
                  ? '0 8px 24px rgba(0,0,0,0.3)' 
                  : 'none',
                transition: isHoldingThis ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                border: card ? '1px solid var(--accent)' : '1px dashed rgba(255,255,255,0.15)',
                animation: shakingCard === card?.id ? `custom-shake ${0.25 - prog * 0.0015}s linear infinite` : 'none',
                cursor: card && !isRevealed ? 'grab' : 'default',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
                background: !card ? '#020205' : undefined
              }}>
                {card && !isRevealed && <div className="tarot-card-shimmer"></div>}
                
                {card && isRevealed ? (
                  <img src={card.img} alt={card.nameTr} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} className="fade-in" />
                ) : card && !isRevealed ? (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `rgba(80, 200, 120, ${prog * 0.005})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: isHoldingThis ? 'none' : 'all 0.4s'
                  }}>
                    {/* Progress Indicator Ring (Subtle) */}
                    {prog > 0 && (
                      <svg style={{ position: 'absolute', width: '60px', height: '60px', transform: 'rotate(-90deg)', pointerEvents: 'none' }}>
                        <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(80, 200, 120, 0.2)" strokeWidth="3" />
                        <circle 
                          cx="30" cy="30" r="26" 
                          fill="none" 
                          stroke="var(--accent)" 
                          strokeWidth="3" 
                          strokeDasharray={`${prog * 1.63}, 1000`} 
                          strokeLinecap="round" 
                          style={{ filter: 'drop-shadow(0 0 4px var(--accent))' }} 
                        />
                      </svg>
                    )}
                    {/* Removed icon during hold state as requested */}
                  </div>
                ) : null}
              </div>
              
              {/* Card Label */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)' }}>
                  {slot.nameTr}
                </span>
                {card && isRevealed && (
                  <div className="fade-in" style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>
                    {card.nameTr}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper Text */}
      <div style={{ 
        textAlign: 'center', 
        paddingBottom: '40px',
        opacity: selectedCards.length === 3 ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        pointerEvents: 'none'
      }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
          Kartları görmek için basılı tutun
        </p>
      </div>
    </div>
  );

  return step === 'ritual' ? renderRitual() : renderSelection();
}
