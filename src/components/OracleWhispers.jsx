import { useEffect, useRef, useState } from 'react';

const WHISPERS = [
  "Ecem beni ghost'luyor, asıl niyeti ne?",
  "Bugünlerde sezgilerim ısrarla bana ne anlatmaya çalışıyor?",
  "Şu an içinden çıkamadığım bu krizin çözümü nerede gizli?",
  "Efe bana karşı ne hissediyor? Çok mix sinyaller yolluyor.",
  "Üzerimde birilerinin nazarı veya negatif enerjisi mi var?",
  "Maddi konularda önümü tıkayan blokajı nasıl aşabilirim?",
  "Çok kararsızım, aklımdaki o kararı verirsem sonum ne olur?",
  "Ruhsal olarak daha güçlü hissetmek için neye ihtiyacım var?",
  "Benimle ciddi mi düşünüyor, yoksa sadece yedekte mi tutuyor?",
  "Geçmişten taşıdığım ve artık bırakmam gereken yük nedir?",
  "Çok yakında önüme çıkacak o büyük fırsat ne ile ilgili olacak?",
  "Bu ilişkiyi bırakmalı mıyım yoksa sabretmeli miyim?",
  "Hayatımda ısrarla neyi yanlış yapıyorum ve değiştirmem lazım?",
  "Önümüzdeki ay hayatımda tam olarak neye odaklanmam gerekiyor?",
  "Akın'a güvenmekte hata mı ediyorum?",
  "Kaderimde ne var, neyi kaçırıyorum?"
];

// Her listeyi 2 kez render et — seamless sonsuz döngü için
const DOUBLED = [...WHISPERS, ...WHISPERS];

export default function OracleWhispers({ onSelect }) {
  const containerRef = useRef(null);
  const isPaused = useRef(false);
  const animationRef = useRef(null);
  const lastTime = useRef(performance.now());
  const exactScrollTop = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    exactScrollTop.current = container.scrollTop;

    const animate = (time) => {
      const deltaTime = time - lastTime.current;
      lastTime.current = time;

      if (!isPaused.current) {
        // Frame limitli yumuşak kayma hızı — yaklaşık saniyede 15 piksel
        const speed = (0.25 * deltaTime) / 16; 
        exactScrollTop.current += speed;
        container.scrollTop = exactScrollTop.current;

        // Listenin tam yarısı (tek bir WHISPERS listesinin boyu)
        const halfHeight = container.scrollHeight / 2;
        
        if (container.scrollTop >= halfHeight) {
           exactScrollTop.current = container.scrollTop - halfHeight;
           container.scrollTop = exactScrollTop.current;
        }
      } else {
        // Kullanıcı kendi kaydırırken exactScrollTop değerini senkronize et
        exactScrollTop.current = container.scrollTop;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const handleInteractionStart = () => {
    isPaused.current = true;
  };

  const handleInteractionEnd = () => {
    // Mobil dokunuş veya fare çıkışında çok kısa bir gecikme ekleyerek başlat
    setTimeout(() => {
      isPaused.current = false;
      lastTime.current = performance.now(); // Zıplamayı önle
    }, 100);
  };

  const handleManualScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    
    // Kullanıcı çok hızlı kaydırıp en alta veya en üste dayandığında sonsuz döngüyü koru
    const halfHeight = container.scrollHeight / 2;
    if (container.scrollTop >= halfHeight * 1.5) {
       container.scrollTop = container.scrollTop - halfHeight;
       exactScrollTop.current = container.scrollTop;
    } else if (container.scrollTop <= 0) {
       container.scrollTop = halfHeight;
       exactScrollTop.current = container.scrollTop;
    }
  };

  return (
    <div className="oracle-whispers-wrapper">
      <div className="oracle-whispers-label">
        <span className="material-symbols-outlined">auto_awesome</span>
        Cevabını Arayan Sorular
      </div>

      <div 
        className="oracle-whispers-container"
        ref={containerRef}
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onScroll={handleManualScroll}
        style={{ 
          overflowY: 'auto', 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'auto' // Kesinlikle auto olmalı ki reset anında sıçrama yapmasın
        }}
      >
        <div className="oracle-whispers-track">
          {DOUBLED.map((q, idx) => (
            <div
              key={idx}
              className="oracle-whisper-item"
              onClick={() => onSelect(q)}
            >
              <span className="whisper-dot">✦</span>
              <span className="whisper-text">"{q}"</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
