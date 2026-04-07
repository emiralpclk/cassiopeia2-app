import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { ZODIAC_SIGNS, TAROT_DECK, ELEMENT_DATA } from '../utils/constants';
import MysticIcon from '../components/MysticIcon';
import ZodiacWheel from '../components/ZodiacWheel';
import CassiopeiaLogo from '../components/CassiopeiaLogo';
import { callGemini } from '../services/gemini';
import { buildCombinedDailyPrompt } from '../utils/prompts';
import { getMockDailyContent } from '../services/mockData';
import ImageModal from '../components/ImageModal';
import { getDailyQuote } from '../utils/quotes';
import tarotBack from '../assets/tarot_back_mockup.png';

// Enerji renk → hex eşlemesi
const ENERGY_COLOR_MAP = {
  'Mavi': '#007AFF', 'Kırmızı': '#FF3B30', 'Yeşil': '#34C759',
  'Mor': '#AF52DE', 'Sarı': '#FFCC00', 'Turuncu': '#FF9500',
  'Pembe': '#FF2D55', 'Turkuaz': '#5AC8FA', 'Gümüş': '#8E8E93', 'Beyaz': '#FFFFFF'
};

export default function HomePage() {
  const { user, apiKey, isTestMode } = useAppState();
  const navigate = useNavigate();

  // — Data states —
  const [dailyCard, setDailyCard] = useState(null);
  const [dailyCardReading, setDailyCardReading] = useState('');
  const [horoscope, setHoroscope] = useState('');
  const [dailyEnergy, setDailyEnergy] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [dailySeed, setDailySeed] = useState(0);

  // — UI states —
  const [isFlashing, setIsFlashing] = useState(false);
  const [bloomCard, setBloomCard] = useState(null); // aurora bloom efekti için
  const [loading, setLoading] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('cassiopeia_user_profile'));
      if (!u) return true;
      const today = new Date().toDateString();
      const s = `${today}_${u.zodiac}`;
      return !(localStorage.getItem(`daily_card_reading_${s}`) &&
               localStorage.getItem(`daily_horoscope_${s}`));
    } catch { return true; }
  });

  // — Günlük Açılış (Reveal) Durumu —
  const [revealedCards, setRevealedCards] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('cassiopeia_user_profile'));
      const today = new Date().toDateString();
      const key = `revealed_cards_${today}_${u?.id || 'default'}`;
      const saved = JSON.parse(localStorage.getItem(key));
      return saved || { daily: false, horoscope: false, energy: false };
    } catch { return { daily: false, horoscope: false, energy: false }; }
  });

  // flip-done: animasyon bittikten sonra back face'i static yap
  const [flipDoneCards, setFlipDoneCards] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('cassiopeia_user_profile'));
      const today = new Date().toDateString();
      const key = `revealed_cards_${today}_${u?.id || 'default'}`;
      const saved = JSON.parse(localStorage.getItem(key));
      return saved || { daily: false, horoscope: false, energy: false };
    } catch { return { daily: false, horoscope: false, energy: false }; }
  });

  // — Flip animasyonu için —
  const [flippingCard, setFlippingCard] = useState(null);
  const [cardTaps, setCardTaps] = useState({ daily: 0, horoscope: 0, energy: 0 });
  const [shakingCard, setShakingCard] = useState(null);

  const userZodiac = user ? ZODIAC_SIGNS.find(z => z.id === user.zodiac) : null;
  const activeElement = userZodiac ? ELEMENT_DATA[userZodiac.element] : null;

  // Elementin accent rengi (ZodiacWheel için)
  const elementAccentColor = activeElement?.color || '#00b4ff';

  // Kart açma fonksiyonu
  const handleCardTap = (cardId) => {
    if (revealedCards[cardId] || flippingCard) return;

    if (navigator.vibrate) navigator.vibrate(40);

    setShakingCard(cardId);
    setTimeout(() => setShakingCard(null), 150);

    const currentTaps = cardTaps[cardId] || 0;
    const newTaps = { ...cardTaps, [cardId]: currentTaps + 1 };
    setCardTaps(newTaps);

    if (newTaps[cardId] >= 3) {
      if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
      setTimeout(() => doFlip(cardId), 100);
    }
  };

  const doFlip = (cardId) => {
    if (revealedCards[cardId] || flippingCard) return;

    setFlippingCard(cardId);
    setTimeout(() => {
      const today = new Date().toDateString();
      const key = `revealed_cards_${today}_${user?.id || 'default'}`;
      const newState = { ...revealedCards, [cardId]: true };
      setRevealedCards(newState);
      localStorage.setItem(key, JSON.stringify(newState));
      setFlippingCard(null);

      // Flip animasyonu bittikten sonra (700ms) back face'i static yap
      setTimeout(() => {
        setFlipDoneCards(prev => ({ ...prev, [cardId]: true }));
      }, 750);

      // Aurora bloom efekti
      setBloomCard(cardId);
      setTimeout(() => setBloomCard(null), 1500);
    }, 650);
  };

  const getTapText = (taps) => {
    if (taps === 0) return "Açmak için 3 kez dokun";
    if (taps === 1) return "Mühür sarsılıyor...";
    if (taps === 2) return "Son bir dokunuş...";
    return "Mühür açılıyor!";
  };

  // Profil değiştiğinde o profile ait reveal durumunu yükle
  useEffect(() => {
    if (!user?.id) return;
    const today = new Date().toDateString();
    const key = `revealed_cards_${today}_${user.id}`;
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      const state = saved || { daily: false, horoscope: false, energy: false };
      setRevealedCards(state);
      setFlipDoneCards(state);
    } catch {
      setRevealedCards({ daily: false, horoscope: false, energy: false });
      setFlipDoneCards({ daily: false, horoscope: false, energy: false });
    }
  }, [user?.id]);

  // Portal navigasyon (Fal Baktır)
  const handlePortalNavigate = (path) => {
    setIsFlashing(true);
    setTimeout(() => navigate(path), 450);
  };

  useEffect(() => {
    if (!user || !userZodiac) return;
    const controller = new AbortController();

    const today = new Date().toDateString();
    const seedString = `${today}_${user.zodiac}`;
    const seed = seedString.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    setDailySeed(seed);

    // 1. Günlük Tarot Kartı
    const cardIndex = seed % TAROT_DECK.length;
    setDailyCard(TAROT_DECK[cardIndex]);

    // 2. Günlük Enerji
    const colors = ['Mavi', 'Kırmızı', 'Yeşil', 'Mor', 'Sarı', 'Turuncu', 'Pembe', 'Turkuaz', 'Gümüş', 'Beyaz'];
    const cachedEnergy = localStorage.getItem(`daily_energy_${seedString}`);
    if (cachedEnergy) {
      const parsed = JSON.parse(cachedEnergy);
      if (!colors.includes(parsed.color)) {
        const newEnergy = { color: colors[seed % colors.length], number: ((seed * 7) % 99) + 1 };
        setDailyEnergy(newEnergy);
        localStorage.setItem(`daily_energy_${seedString}`, JSON.stringify(newEnergy));
      } else {
        setDailyEnergy(parsed);
      }
    } else {
      const roll = (seed * 13) % 100;
      const luckyNumber = roll < 60 ? ((seed * 7) % 9) + 1 : ((seed * 7) % 90) + 10;
      const newEnergy = { color: colors[seed % colors.length], number: luckyNumber };
      setDailyEnergy(newEnergy);
      localStorage.setItem(`daily_energy_${seedString}`, JSON.stringify(newEnergy));
    }

    // 3. AI içerik
    if (apiKey || isTestMode) {
      const cachedCard = localStorage.getItem(`daily_card_reading_${seedString}`);
      const cachedHoroscope = localStorage.getItem(`daily_horoscope_${seedString}`);
      if (cachedCard && cachedHoroscope && !isTestMode) {
        setDailyCardReading(cachedCard);
        setHoroscope(cachedHoroscope);
        setLoading(false);
      } else {
        loadDailyContent(TAROT_DECK[cardIndex], userZodiac, seedString, controller.signal);
      }
    } else {
      setLoading(false);
    }

    return () => controller.abort();
  }, [apiKey, user, userZodiac, isTestMode]);

  async function loadDailyContent(card, zodiac, todayString, signal) {
    if ((!apiKey && !isTestMode) || !zodiac || !card) return;
    setLoading(true);
    try {
      let data;
      if (isTestMode) {
        await new Promise(r => setTimeout(r, 800));
        data = getMockDailyContent();
      } else {
        const prompt = buildCombinedDailyPrompt(zodiac?.name || '', card?.nameTr || '', card?.meaning || '');
        const result = await callGemini(apiKey, prompt, { jsonMode: true, signal });
        data = result;
      }
      const { horoscope: h, tarot_reading: t } = data;
      setDailyCardReading(t);
      setHoroscope(h);
      if (!isTestMode) {
        localStorage.setItem(`daily_card_reading_${todayString}`, t);
        localStorage.setItem(`daily_horoscope_${todayString}`, h);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      const msg = 'Bağlantı hatası veya API sorunu.';
      if (!dailyCardReading) setDailyCardReading(msg);
      if (!horoscope) setHoroscope(msg);
    }
    setLoading(false);
  }

  const dailyQuote = getDailyQuote(dailySeed);
  const energyColor = ENERGY_COLOR_MAP[dailyEnergy?.color] || '#007AFF';

  const rawGreetingName = user?.name || userZodiac?.name || 'Gezgin';
  const displayGreetingName = rawGreetingName.length > 10 ? rawGreetingName.slice(0, 10) + '..' : rawGreetingName;

  return (
    <div className="page home-page">
      <style>{`
        @keyframes custom-shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          20% { transform: translate(-2px, -1px) rotate(-1deg); }
          40% { transform: translate(1px, -2px) rotate(1deg); }
          60% { transform: translate(-2px, 2px) rotate(0deg); }
          80% { transform: translate(2px, 1px) rotate(-1deg); }
          100% { transform: translate(-1px, -1px) rotate(0deg); }
        }
      `}</style>
      {/* Header */}
      <div className="home-header">
        <div className="home-date">
          {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
        </div>
        <div className="home-greeting">
          <div className="greeting-icon-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className={`mystic-home-glow aura-${activeElement?.id || 'water'}`}></div>
            <CassiopeiaLogo
              size={64}
              isLoading={false}
              color="var(--accent)"
              className="home-header-logo"
            />
          </div>
          <div className="zodiac-badge-group">
            <div className="greeting-title-group">
              <p className="greeting-text">Merhaba</p>
              <h1 className="greeting-zodiac">{displayGreetingName}</h1>
            </div>
            <div className="vertical-divider"></div>
            <div className="zodiac-info-tag">
              <span className="zodiac-tag-label">{userZodiac?.name || 'Gezgin'}</span>
              <span className="element-tag-label">
                {activeElement?.id ? `(${activeElement.id.charAt(0).toUpperCase() + activeElement.id.slice(1)})` : '(Yıldız)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fal Baktır */}
      <button
        className={`quick-action-btn ${isFlashing ? 'btn-pressed' : ''}`}
        onClick={() => handlePortalNavigate('/fallar/kahve')}
      >
        <MysticIcon name="coffee" color="#ffffff" size={24} className="icon-max-glow" />
        <span>Fal Baktır</span>
        <MysticIcon name="arrow" color="#ffffff" size={20} className="arrow" />
      </button>

      {/* GÜNÜN KARTI */}
      <div
        className={`home-card daily-card-section ${bloomCard === 'daily' ? 'aurora-bloom' : ''} ${flipDoneCards.daily ? 'flip-done' : ''}`}
        style={{ 
          '--aurora-1': '120, 40, 220', 
          '--aurora-2': '60, 20, 160',
          animation: shakingCard === 'daily' ? 'custom-shake 0.15s ease-in-out' : undefined,
          boxShadow: (!revealedCards.daily && cardTaps.daily > 0) ? `0 0 ${cardTaps.daily * 15}px rgba(120, 40, 220, ${cardTaps.daily * 0.2})` : undefined
        }}
        onClick={() => !revealedCards.daily && handleCardTap('daily')}
      >
        <div className="card-aurora" />

        <div className={`flip-inner ${revealedCards.daily ? 'revealed' : ''} ${flippingCard === 'daily' ? 'flipping' : ''} ${flipDoneCards.daily ? 'flip-done' : ''}`}>
          {/* KAPALI HAL */}
          <div className="flip-front">
            <div className="card-closed-state">
              <div className="card-back-pattern">
                <img 
                  src={tarotBack} 
                  alt="Günün Kartı" 
                  className="tarot-back-img"
                />
              </div>
              <p className="card-mystery-text">Günün kartı seni bekliyor...</p>
              <p className="card-mystery-sub">{getTapText(cardTaps.daily || 0)}</p>
            </div>
          </div>

          {/* AÇIK HAL */}
          <div className="flip-back">
            <div className="card-header">
              <MysticIcon name="tarot" color="#fff" size={20} />
              <h3>Günün Kartı</h3>
            </div>
            {dailyCard ? (
              <div className="daily-card-content">
                <div className="daily-card-image" onClick={(e) => { e.stopPropagation(); setZoomedImage(dailyCard?.img); }}>
                  <img src={dailyCard?.img} alt={dailyCard?.nameTr} />
                </div>
                <div className="daily-card-info">
                  <h4 className="daily-card-name">{dailyCard?.nameTr}</h4>
                  <p className="daily-card-meaning">{dailyCard?.meaning}</p>
                  {loading ? (
                    <p className="daily-card-reading shimmer">Yükleniyor...</p>
                  ) : (
                    <p className="daily-card-reading">{dailyCardReading || 'Yorum hazır değil.'}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="shimmer">Kart seçiliyor...</p>
            )}
          </div>
        </div>
      </div>

      {/* GÜNLÜK BURÇ YORUMU */}
      <div
        className={`home-card horoscope-section ${bloomCard === 'horoscope' ? 'aurora-bloom' : ''} ${flipDoneCards.horoscope ? 'flip-done' : ''}`}
        style={{ 
          '--aurora-1': '200, 130, 10', 
          '--aurora-2': '160, 70, 20',
          animation: shakingCard === 'horoscope' ? 'custom-shake 0.15s ease-in-out' : undefined,
          boxShadow: (!revealedCards.horoscope && cardTaps.horoscope > 0) ? `0 0 ${cardTaps.horoscope * 15}px rgba(200, 130, 10, ${cardTaps.horoscope * 0.2})` : undefined
        }}
        onClick={() => !revealedCards.horoscope && handleCardTap('horoscope')}
      >
        <div className="card-aurora" />

        <div className={`flip-inner ${revealedCards.horoscope ? 'revealed' : ''} ${flippingCard === 'horoscope' ? 'flipping' : ''} ${flipDoneCards.horoscope ? 'flip-done' : ''}`}>
          {/* KAPALI HAL */}
          <div className="flip-front">
            <div className="card-closed-state horoscope-closed">
              <ZodiacWheel
                highlightSign={userZodiac?.id || 'scorpio'}
                accentColor={elementAccentColor}
              />
              <p className="card-mystery-text">Yıldızlar fısıldıyor...</p>
              <p className="card-mystery-sub">{getTapText(cardTaps.horoscope || 0)}</p>
            </div>
          </div>

          {/* AÇIK HAL */}
          <div className="flip-back" style={{ position: 'relative', overflow: 'hidden', zIndex: 1 }}>
            <div className="card-header">
              <MysticIcon name={userZodiac?.id || 'stars'} color="#fff" size={20} />
              <h3>Günlük Burç Yorumun</h3>
            </div>
            {loading ? (
              <p className="horoscope-text shimmer">Yükleniyor...</p>
            ) : (
              <p className="horoscope-text">{horoscope || 'Yorum hazır değil.'}</p>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          GÜNÜN ENERJİSİ
      ══════════════════════════════════════ */}
      {dailyEnergy && (
        <div
          className={`home-card energy-section ${bloomCard === 'energy' ? 'aurora-bloom' : ''}`}
          style={{
            borderBottom: `2px solid ${energyColor}`,
            '--aurora-1': '30, 180, 100',
            '--aurora-2': '0, 150, 140',
            '--energy-color': energyColor,
            animation: shakingCard === 'energy' ? 'custom-shake 0.15s ease-in-out' : undefined,
            boxShadow: (!revealedCards.energy && cardTaps.energy > 0) ? `0 0 ${cardTaps.energy * 15}px rgba(30, 180, 100, ${cardTaps.energy * 0.2})` : undefined
          }}
          onClick={() => !revealedCards.energy && handleCardTap('energy')}
        >
          <div className="card-aurora" />

          <div className={`flip-inner ${revealedCards.energy ? 'revealed' : ''} ${flippingCard === 'energy' ? 'flipping' : ''} ${flipDoneCards.energy ? 'flip-done' : ''}`}>
            {/* KAPALI HAL */}
            <div className="flip-front">
              <div className="card-closed-state energy-closed">
                <div className="quote-display">
                  <p className="quote-text">"{dailyQuote.text}"</p>
                  <p className="quote-author">— {dailyQuote.author}</p>
                </div>
                <p className="card-mystery-sub" style={{ marginTop: '16px' }}>{getTapText(cardTaps.energy || 0)}</p>
              </div>
            </div>

            {/* AÇIK HAL */}
            <div className="flip-back">
              <div className="card-header">
                <MysticIcon name="bolt" color="#fff" size={20} />
                <h3>Günün Enerjisi</h3>
              </div>
              <div className="energy-row">
                <div className="energy-item">
                  <span className="energy-label">Renk</span>
                  <span className="energy-value" style={{ color: energyColor, textShadow: `0 0 15px ${energyColor}` }}>
                    {dailyEnergy?.color}
                  </span>
                </div>
                <div className="energy-divider"></div>
                <div className="energy-item">
                  <span className="energy-label">Şanslı Sayı</span>
                  <span className="energy-value" style={{ color: energyColor, textShadow: `0 0 15px ${energyColor}` }}>
                    {dailyEnergy?.number}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ImageModal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </div>
  );
}