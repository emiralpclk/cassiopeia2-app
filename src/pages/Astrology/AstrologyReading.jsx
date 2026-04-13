import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MysticIcon from '../../components/MysticIcon';
import CassiopeiaLogo from '../../components/CassiopeiaLogo';
import Typewriter from '../../components/Typewriter';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { callGemini } from '../../services/gemini';
import { calculateNatalChart } from '../../utils/astrologyEngine';
import { buildAstrologyPrompt } from '../../utils/astrologyPrompts';

export default function AstrologyReading() {
  const { apiKey, isTestMode, profiles, activeProfileId } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const readingType = location.state?.type || 'grand-report'; 
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingText, setReadingText] = useState('');

  const READING_META = {
    'grand-report': { title: 'Büyük Kozmik Rapor', icon: 'stars', color: 'var(--accent)', aura: 'aura-water' },
    'daily': { title: 'Günlük Etki', icon: 'bolt', color: '#00d2ff', aura: 'aura-water' },
    'love': { title: "Venüs'ün Sırrı", icon: 'heart', color: '#ff4d4d', aura: 'aura-fire' },
    'career': { title: 'Kaderin Zirvesi', icon: 'eye', color: '#a6ff4d', aura: 'aura-earth' },
    'identity': { title: 'Kozmik Kimlik', icon: 'mystic_hands', color: '#ff9500', aura: 'aura-air' },
    'lilith': { title: 'Gölgeni Keşfet: Lilith', icon: 'moon', color: '#af52de', aura: 'aura-water' },
    'chiron': { title: 'Ruhun Yarası: Şiron', icon: 'sparkles', color: '#5ac8fa', aura: 'aura-water' }
  };

  const meta = READING_META[readingType];

  useEffect(() => {
    const p = profiles.find(pr => pr.id === activeProfileId) || profiles[0];
    if (!p || !p.birthPlace) {
      navigate('/fallar/astroloji');
      return;
    }
    setProfile(p);

    const controller = new AbortController();

    async function generateReading() {
      // 1. Math Modülü (Gerçek Efemeris Verileri)
      const chartData = calculateNatalChart(p.birthDate, p.birthTime, p.birthPlace, p.birthDistrict);
      
      // 2. Cache / Hafıza Kontrolü
      const cacheKey = `astro_${readingType}_${p.name}_${p.birthDate?.year}-${p.birthDate?.month}-${p.birthDate?.day}`;
      
      // Eğer 'günlük' okumaysa, cache anahtarına bugünün tarihini de ekle (Günde 1 kez değişsin diye)
      const isDaily = readingType === 'daily';
      const finalCacheKey = isDaily ? `${cacheKey}_${new Date().toDateString()}` : cacheKey;

      const cachedResult = localStorage.getItem(finalCacheKey);
      
      if (cachedResult && !isTestMode) {
        // AI'a gitme, hafızadakini ver
        setTimeout(() => {
          if (!controller.signal.aborted) {
            setReadingText(cachedResult);
            setLoading(false);
          }
        }, 1500); // Mistik intibak süresi
        return;
      }

      // 3. Prompt Yarat
      const prompt = buildAstrologyPrompt(readingType, p, chartData);

      // 4. Test Modu & Gerçek Mod
      if (!apiKey && isTestMode) {
        setTimeout(() => {
          if (!controller.signal.aborted) {
            setReadingText(`(TEST MODU - Gerçek Api Key bulunamadı)\n\nSevgili ${p.name}, yıldız haritanda şu an Ay güçlü bir geçişte. Güneşin ışığı gölgeni aydınlatıyor. \n\n(Not: Api Key girildiğinde ${meta.title} için o devasa destansı metinler buraya düşecek).`);
            setLoading(false);
          }
        }, 2000);
      } else if (!apiKey) {
        setReadingText('Yıldızlarla bağlantı kurabilmem için bir API anahtarı gerekiyor. Lütfen ayarlar üzerinden anahtarını ekleyerek bu gizemli raporu çözmeme izin ver.');
        setLoading(false);
        // Otomatik modal açmayı dene
        dispatch({ type: 'SHOW_API_KEY_MODAL', payload: true });
      } else {
        try {
          const result = await callGemini(apiKey, prompt, { signal: controller.signal });
          if (!controller.signal.aborted) {
            setReadingText(result);
            // Başarılı sonucu Cache'e yaz
            localStorage.setItem(finalCacheKey, result);
            setLoading(false);
          }
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Astrology Reading Error:', err);
            let msg = 'Yıldızlarla olan bağlantımızda kozmik bir kırıntı oluştu. Lütfen tekrar dene.';
            
            if (err.message.includes('API ANAHTARI')) {
              msg = 'API anahtarın geçersiz görünüyor. Lütfen ayarlarından kontrol et.';
            } else if (err.message.includes('KOTA')) {
              msg = 'Günlük yıldız kotan dolmuş görünüyor. Yarın tekrar gelmeye ne dersin?';
            } else if (err.message.includes('Zaman aşımı')) {
              msg = 'Yıldızlar şu an çok meşgul, yanıt vermeleri biraz uzun sürdü. Tekrar dener misin?';
            }
            
            setReadingText(msg);
            setLoading(false);
          }
        }
      }
    }

    generateReading();

    return () => {
      controller.abort();
    };
  }, [navigate, readingType, apiKey, isTestMode, profiles, activeProfileId]);

  if (!profile) return null;

  return (
    <div className="page" style={{ position: 'relative', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="meteor-back meteor-back-1" />
      <div className="meteor-back meteor-back-2" />
      <div className="meteor-front meteor-front-1" />
      
      <div style={{ padding: '30px 20px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <MysticIcon name={meta.icon} color={meta.color} size={28} />
          <h1 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>{meta.title}</h1>
        </div>

        <div className="home-card" style={{ padding: '30px 20px', minHeight: '60vh', position: 'relative', overflow: 'hidden' }}>
          <div className="card-aurora" style={{ '--aurora-1': '20, 20, 40', '--aurora-2': '10, 10, 20' }} />

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px', marginTop: '100px' }}>
              <div className={`mystic-home-glow ${meta.aura}`} style={{ position: 'absolute' }}></div>
              <CassiopeiaLogo size={80} isLoading={true} color={meta.color} />
              <p style={{ color: 'var(--text-secondary)', letterSpacing: '2px', animation: 'shimmer 1.5s infinite', fontSize: '0.9rem', marginTop: '20px' }}>
                Yıldız Konumları Hesaplanıyor...
              </p>
            </div>
          ) : (
            <div style={{ position: 'relative', zIndex: 1, letterSpacing: '0.5px', lineHeight: '1.8' }}>
              <Typewriter 
                text={readingText} 
                speed={30}
                className="reading-text" 
              />
              
              {!apiKey && !loading && (
                <button 
                  onClick={() => dispatch({ type: 'SHOW_API_KEY_MODAL', payload: true })}
                  className="onboarding-next" 
                  style={{ marginTop: '30px', width: 'auto', padding: '12px 25px' }}
                >
                  <MysticIcon name="key" size={18} style={{ marginRight: '8px' }} />
                  API Anahtarı Gir
                </button>
              )}

              {readingText.includes('kırıntı') && (
                <button 
                  onClick={() => window.location.reload()}
                  className="onboarding-next" 
                  style={{ marginTop: '30px', width: 'auto', padding: '12px 25px', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                >
                  Tekrar Dene
                </button>
              )}

              <style>{`
                .reading-text {
                  color: var(--text-primary);
                  font-size: 1rem;
                  font-family: var(--font-body);
                  white-space: pre-wrap;
                }
              `}</style>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
