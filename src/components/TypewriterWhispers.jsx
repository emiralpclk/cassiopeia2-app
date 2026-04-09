import { useState, useEffect } from 'react';

const WHISPERS = [
  "Aklımdaki kişinin bana bir türlü söylemeye cesaret edemediği asıl hisleri neler?",
  "Üzerimde ciddi bir nazar veya dışarıdan gelen görünmez bir blokaj mı var?",
  "Arkamdan dönen dolapları veya benim hakkımda gizlice konuşanları görmek istiyorum.",
  "Aramızdaki bu kopukluğun sonu aydınlık mı, yoksa tamamen yollarımız ayrılıyor mu?",
  "Çok yakında kapımı çalacak olan o ani, beklenmedik sürpriz gelişme ne ile ilgili?",
  "Bana yalan söylediğini hissediyorum... Hissimde haklı mıyım?",
  "Sebepsiz yere hissettiğim bu iç sıkıntısının ve üzerimdeki ağırlığın asıl kaynağı ne?",
  "Neden sürekli tam bir şeyler olacakken tıkanıp kalıyor, bu döngüden ne zaman çıkarım?",
  "Kariyerim ve maddi konularda fincanın dibinde saklanan o büyük fırsat ne?",
  "Çevremde bana dost gibi görünen ama gizliden enerjimi çeken o kişi asıl kim?",
  "Önümdeki o zorlu seçimi yaparsam hayatım nasıl bir yola girecek?",
  "Son günlerde yaşadığım o olay tesadüf müydü, yoksa arkasında bilmediğim bir oyun mu var?"
];

export default function TypewriterWhispers({ onSelect }) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  
  const typingSpeed = 50; // Harflerin yazılma hızı (ms)
  const pauseDuration = 3000; // Yazı bittikten sonra beklenecek süre
  const fadeDuration = 500; // Silinme (opacity) efekti süresi

  useEffect(() => {
    let timeout;
    const fullText = WHISPERS[currentIndex];

    setIsFading(false);
    setCurrentText('');

    let charIndex = 0;
    const type = () => {
      if (charIndex < fullText.length) {
        setCurrentText(fullText.substring(0, charIndex + 1));
        charIndex++;
        timeout = setTimeout(type, typingSpeed);
      } else {
        // Yazma bitti, beklemeye geç
        timeout = setTimeout(() => {
          setIsFading(true); // Yavaşça silinmesi için tetikle
          
          // Silinme bitince sıradaki cümleye geç
          timeout = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % WHISPERS.length);
          }, fadeDuration);
        }, pauseDuration);
      }
    };

    // İlk karakterin başlaması için küçük bir es
    timeout = setTimeout(type, 200);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const handleClick = () => {
    if (WHISPERS[currentIndex]) {
      // Daktilo bitmemiş olsa bile cümlenin tamamını form içine kopyala
      onSelect(WHISPERS[currentIndex]);
    }
  };

  return (
    <div className="typewriter-whispers-wrapper" onClick={handleClick}>
      <div className="oracle-whispers-label" style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit_note</span>
          İç Sesin Diyor Ki...
        </div>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 'normal', fontStyle: 'italic' }}>
          (Seçmek için dokun)
        </span>
      </div>
      
      <div className="typewriter-container">
        <div className={`typewriter-text ${isFading ? 'fading-out' : ''}`}>
          "{currentText}"<span className="typewriter-cursor">|</span>
        </div>
      </div>
    </div>
  );
}
