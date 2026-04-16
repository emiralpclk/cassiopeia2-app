/**
 * Altın Saatler — Kişiselleştirilmiş İçerik Motoru
 * ──────────────────────────────────────────────────
 * 
 * Bu dosya tüm "Yap / Yapma" metinlerini, gezegen açıklamalarını
 * ve kozmik banner mesajlarını üretir.
 *
 * Katmanlar:
 *   1. Gezegen Arketipi (7 gezegen)
 *   2. Zaman Dilimi (dawn / morning / afternoon / evening / night)
 *   3. Cinsiyet (woman / man / lgbtq)
 *   4. İlişki Durumu
 *   5. Gökyüzü Katmanı (Ay fazı + Merkür durumu)
 *
 * ═══════════════════════════════════════════════════
 *  İÇERİK NOTU: Bu dosyadaki metinler STUB (yer tutucu) dir.
 *  Nihai metinler kullanıcıyla birlikte yazılacak.
 * ═══════════════════════════════════════════════════
 */

// ─── Zaman Dilimi Tespiti ───────────────────────────────────────────────────
export const TIME_SLOTS = {
  dawn:      { id: 'dawn',      label: 'Şafak',     range: [5, 8],   icon: 'wb_twilight' },
  morning:   { id: 'morning',   label: 'Sabah',     range: [8, 12],  icon: 'light_mode' },
  afternoon: { id: 'afternoon', label: 'Öğleden Sonra', range: [12, 17], icon: 'sunny' },
  evening:   { id: 'evening',   label: 'Akşam',     range: [17, 21], icon: 'routine' },
  night:     { id: 'night',     label: 'Gece',      range: [21, 5],  icon: 'dark_mode' },
};

export const getTimeSlot = (date = new Date()) => {
  const h = date.getHours();
  if (h >= 5  && h < 8)  return 'dawn';
  if (h >= 8  && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night'; // 21-05
};

// ─── Gezegen Ana Veri Tabanı ────────────────────────────────────────────────
export const PLANETS = {
  'Güneş': {
    symbol: '☉', name: 'Güneş', color: '#fbbf24',
    tagline: 'Öz İfade & Liderlik',
    peak: true,
    coreEnergy: 'Güneş saatinde enerji yükseliyor, özgüven zirvede. Kendini gösterme, önemli kararlar alma ve liderlik için kozmik destek var.',
  },
  'Venüs': {
    symbol: '♀', name: 'Venüs', color: '#f472b6',
    tagline: 'Aşk, Uyum & Güzellik',
    peak: true,
    coreEnergy: 'Venüs saatinde çekim gücün yükseliyor. İlişkiler, estetik ve kişisel çekiciliğin tavan yapıyor.',
  },
  'Merkür': {
    symbol: '☿', name: 'Merkür', color: '#a78bfa',
    tagline: 'İletişim & Zeka',
    peak: false,
    coreEnergy: 'Merkür saatinde zihin hızlı, kelimeler akıcı. Yazışmalar, müzakereler ve öğrenme hızı dorukta.',
  },
  'Ay': {
    symbol: '☽', name: 'Ay', color: '#c4b5fd',
    tagline: 'Sezgi & Duygular',
    peak: false,
    coreEnergy: 'Ay saatinde sezgiler güçlü, duygular yoğun. İç dünya, aile ve ruhsal konularda hassasiyet dorukta.',
  },
  'Satürn': {
    symbol: '♄', name: 'Satürn', color: '#94a3b8',
    tagline: 'Disiplin & Yapı',
    peak: false,
    coreEnergy: 'Satürn saatinde ciddiyet ve düzen ön plana çıkıyor. Ertelediğin zor ama gerekli işler için doğru zaman.',
  },
  'Jüpiter': {
    symbol: '♃', name: 'Jüpiter', color: '#34d399',
    tagline: 'Şans & Genişleme',
    peak: true,
    coreEnergy: 'Jüpiter saatinde kapılar açılıyor, fırsatlar büyüyor. Büyük hayaller ve cesur adımlar için kozmik rüzgar arkanda.',
  },
  'Mars': {
    symbol: '♂', name: 'Mars', color: '#f87171',
    tagline: 'Eylem & Cesaret',
    peak: false,
    coreEnergy: 'Mars saatinde enerji alev alev. Harekete geçmek, cesur kararlar almak ve rekabet için en güçlü zaman.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MODÜLER MADDE HAVUZU (Item Pool) ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
//
// Her madde bağımsız, etiketli. Sistem kullanıcının profiline göre
// havuzdan süzüp gün bazlı döndürerek 3 do + 2 don't seçer.
//
// Etiketler:
//   type  : "do" | "dont"
//   time  : ["dawn","morning",...] veya "all"
//   gender: "woman" | "man" | "all"
//   rel   : "single" | "relationship" | "all"
//
// ═══════════════════════════════════════════════════════════════════════════════

export const ITEM_POOL = {
  // ──────────────────────────────────────────────────────────────────────────
  //  ♂ MARS — Eylem, Cesaret, Fiziksel Enerji, Sınır Koyma, Rekabet
  // ──────────────────────────────────────────────────────────────────────────
  'Mars': [
    // ── DO — Evrensel ──────────────────────────────────────────────────────
    { type: 'do', time: 'all', gender: 'all', rel: 'all',
      text: 'Fiziksel bir şey yap — koşu, yürüyüş, merdiven çık. Mars enerjisi vücuttan atılmazsa zihne çöker.' },
    { type: 'do', time: ['dawn', 'morning'], gender: 'all', rel: 'all',
      text: 'Güne vücudun uyanacağı bir şeyle başla — soğuk yüz yıkama, kısa bir esneme, 5 dakika hareket.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'all', rel: 'all',
      text: 'Mars hareketsizliğe tahammül etmez — ertelediğin o işe bugün başla, düşünmeyi bırak.' },
    { type: 'do', time: ['morning'], gender: 'all', rel: 'all',
      text: 'Bugünün en zor konuşmasını sabah yap — Mars cesareti sabah zirvede, öğlene azalır.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'all',
      text: 'Sabah başladığın işi sonuçlandır — Mars yarım kalan işlere tahammül etmez.' },
    { type: 'do', time: ['night'], gender: 'all', rel: 'all',
      text: 'Uyumadan önce yarın için bir cesaret niyeti belirle — Mars gece bilinçaltına işler.' },

    // ── DO — Kadın ─────────────────────────────────────────────────────────
    { type: 'do', time: ['dawn', 'morning'], gender: 'woman', rel: 'all',
      text: 'Mars sana bugün ses veriyor — toplantıda, sohbette, nerede olursan ol fikrini söyle, geri durma.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'woman', rel: 'all',
      text: 'Bugün özür dileme ve kendini açıklama reflekslerini fark et — Mars diyor ki: durma, yürü.' },
    { type: 'do', time: ['evening', 'night'], gender: 'woman', rel: 'all',
      text: 'Günün gerilimini bedeninden at — dans, yoga, esneme. Mars\'ın artık enerjisini yumuşat.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'woman', rel: 'single',
      text: 'Cesaretini gerektiren bir adım var hayatında — başvuru, teklif, konuşma. Mars diyor ki: bugün o gün.' },
    { type: 'do', time: ['afternoon', 'evening'], gender: 'woman', rel: 'single',
      text: 'Bugün enerjin yüksek — yeni biriyle tanışabilirsin, kapana kapatma kendini.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'woman', rel: 'relationship',
      text: 'Bugün sınırını koy — partnerinle de olsa, nazikçe ama kararlıca. Mars bu gücü sana veriyor.' },

    // ── DO — Erkek ─────────────────────────────────────────────────────────
    { type: 'do', time: ['dawn', 'morning'], gender: 'man', rel: 'all',
      text: 'Rekabetçi enerjin tavan — ama bugün rakibinle değil, dünkü seninle yarış.' },
    { type: 'do', time: ['dawn', 'morning'], gender: 'man', rel: 'all',
      text: 'Sabah rutinine hareket ekle — Mars günü hareketsiz başlattığında geri kalan her şey ağır gelir.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'man', rel: 'single',
      text: 'Hoşlandığın kişiye bugün yaz. Mars cesareti sende — yarına bırakırsan enerji dağılır.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'man', rel: 'relationship',
      text: 'İş yerinde bugün inisiyatif al — "ben yaparım" de. Mars senin arkanda.' },
    { type: 'do', time: ['evening'], gender: 'man', rel: 'relationship',
      text: 'Eve geldiğinde ilk 10 dakika sessiz ol — Mars\'ın günlük gerilimini kapıda bırak, sonra sohbet.' },
    { type: 'do', time: ['evening'], gender: 'man', rel: 'single',
      text: 'Bir arkadaşınla spontan bir plan yap — spor, oyun, dışarı çık. Mars hareketsiz akşamı sevmez.' },

    // ── DO — İlişki bazlı ──────────────────────────────────────────────────
    { type: 'do', time: ['evening'], gender: 'all', rel: 'relationship',
      text: 'Partnerinle birlikte fiziksel bir şey yapın — yürüyüş, birlikte yemek pişirme. Mars birlikte enerji istiyor.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'relationship',
      text: 'Partnerine kısa bir "düşünüyorum" mesajı at — Mars enerjisi bazen sert gösterir, yumuşak bir dokunuş dengeler.' },
    { type: 'do', time: ['night'], gender: 'all', rel: 'single',
      text: 'Yarın cesaretle yapacağın bir şeyi bu gece hayal et — Mars gece kurduğun niyetleri sabaha taşır.' },

    // ── DO — Ek kapsama (evening/night boşluk tamamlama) ───────────────────
    { type: 'do', time: ['evening'], gender: 'all', rel: 'all',
      text: 'Bugünün en cesur anını hatırla ve kendine "iyi iş çıkardım" de — Mars takdiri hak ediyor.' },
    { type: 'do', time: ['evening', 'night'], gender: 'man', rel: 'single',
      text: 'Bu akşam kendine vakit ayır — Mars enerjisiyle gün boyu koşturdun, şimdi şarj ol.' },
    { type: 'do', time: ['evening', 'night'], gender: 'all', rel: 'all',
      text: 'Yarın için bir hedef koy — büyük olması gerekmiyor, ama Mars netlik istiyor.' },
    { type: 'do', time: ['afternoon', 'evening'], gender: 'man', rel: 'all',
      text: 'Birine yardım teklif et — Mars sadece savaş değil, koruma da demek. Gücünü paylaş.' },

    // ── DON'T — Evrensel ───────────────────────────────────────────────────
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Öfkeyle mesaj atma — Mars parmağını klavyeye götürür ama gönder\'e basmadan 10 saniye bekle.' },
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Sabır gerektiren, uzun zaman alacak işlere bugün başlama — Mars kısa ve keskin hamleler istiyor.' },
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Bugün risk al ama kumar oynama — Mars cesaret verir, delilik değil. Hesaplı cüret.' },
    { type: 'dont', time: ['dawn', 'morning'], gender: 'all', rel: 'all',
      text: 'Kahve içmeden önce telefona bakma — Mars sabahı zaten yüklü, üstüne bilgi bombardımanı ekleme.' },
    { type: 'dont', time: ['evening', 'night'], gender: 'all', rel: 'all',
      text: 'Gece Mars gerilimini uyku bozukluğuna çevirir — ekranı bırak, vücudunu yor ki zihnin sussun.' },

    // ── DON'T — Kadın ──────────────────────────────────────────────────────
    { type: 'dont', time: 'all', gender: 'woman', rel: 'all',
      text: 'Birinin seni küçümsemesine bugün sessiz kalma — ama kavga da etme, sınırını bir cümleyle koy.' },
    { type: 'dont', time: ['night'], gender: 'woman', rel: 'all',
      text: 'Gece yalnız kalınca kendini sorgulamaya başlama — Mars\'ın gecesi savaşçıyı yıpratır, uyu.' },
    { type: 'dont', time: ['evening'], gender: 'woman', rel: 'single',
      text: 'Sosyal medyada başkalarının hayatıyla kıyaslama yapma — Mars seni savaşçı yaptı, yanlış savaşa girme.' },

    // ── DON'T — Erkek ──────────────────────────────────────────────────────
    { type: 'dont', time: ['morning', 'afternoon'], gender: 'man', rel: 'all',
      text: 'Trafikte, kuyrukte, tartışmada — ilk tepkini yutmayı dene. Mars\'ın ilk darbesi en hatalısıdır.' },
    { type: 'dont', time: ['afternoon'], gender: 'man', rel: 'relationship',
      text: 'Bugün haklı olsan bile "ben demiştim" deme — Mars ego\'ya yakıt verir, ilişki bunu kaldırmaz.' },
    { type: 'dont', time: ['night'], gender: 'man', rel: 'all',
      text: 'Gece alınan kararlar Mars\'ın en tehlikeli silahıdır — not al, sabah tekrar bak.' },

    // ── DON'T — İlişki bazlı ───────────────────────────────────────────────
    { type: 'dont', time: ['morning', 'afternoon'], gender: 'all', rel: 'relationship',
      text: 'Partnerinle güç savaşına girme — Mars ikinizi kışkırtır, haklı olan değil sakin olan kazanır.' },
    { type: 'dont', time: ['afternoon', 'evening'], gender: 'all', rel: 'relationship',
      text: 'İş stresini eve taşıma — çıkmadan önce derin bir nefes al, kapıda bırak.' },
    { type: 'dont', time: ['night'], gender: 'all', rel: 'single',
      text: 'Gece geç saatte eski sevgiliye mesaj atma — Mars cesaret verir ama gece 2\'de bu cesaret değil, dürtü.' },
    { type: 'dont', time: ['morning'], gender: 'all', rel: 'single',
      text: 'Reddedilme korkusuyla hareketsiz kalma — Mars cesareti bugün sende, "ya olmazsa" diye düşünme.' },
  ],

  // ──────────────────────────────────────────────────────────────────────────
  //  ☉ GÜNEŞ — Öz İfade, Liderlik, Görünürlük, Özgüven
  // ──────────────────────────────────────────────────────────────────────────
  'Güneş': [
    // DO
    { type: 'do', time: ['dawn'], gender: 'all', rel: 'all',
      text: 'Güne niyetini fısılda — "bugün neyi başarmak istiyorum?" Güneş ilk düşünceden enerji alır.' },
    { type: 'do', time: ['dawn', 'morning'], gender: 'all', rel: 'all',
      text: 'Ayna karşısına geç ve kendine "bugün benim günüm" de — Güneş buna inanıyor, sen de inan.' },
    { type: 'do', time: ['morning'], gender: 'all', rel: 'all',
      text: 'Önemli toplantını, sunumunu veya kararını sabah yap — Güneş enerjisi sabah zirvede.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'all', rel: 'all',
      text: 'Uzun süredir ertelediğin cesur adımı bugün at — Güneş arkanı alıyor, parla.' },
    { type: 'do', time: 'all', gender: 'all', rel: 'all',
      text: 'Kendini göster bugün — gizlenme, küçülme, arka sırada oturma. Güneş "görünür ol" diyor.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'all',
      text: 'Sabah başladığın işi pekiştir ve ilerlet — Güneş öğleden sonra sürdürme istiyor.' },
    { type: 'do', time: ['evening'], gender: 'all', rel: 'all',
      text: 'Bugün neler başardığını fark et ve kendini kutla — küçük de olsa. Güneş takdiri hak ediyor.' },
    { type: 'do', time: ['night'], gender: 'all', rel: 'all',
      text: 'Yarın nasıl parlamak istiyorsun? Rüya niyetini bu soruyla kur — Güneş gece hazırlanır.' },
    { type: 'do', time: ['morning'], gender: 'woman', rel: 'all',
      text: 'Bugün liderlik gerektiren bir inisiyatif al — Güneş kadın gücünü ışıltıya çeviriyor.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'man', rel: 'all',
      text: 'Otorite alanında kendinden emin ol — Güneş bugün seni lider yapıyor, çekilme.' },
    { type: 'do', time: ['morning'], gender: 'all', rel: 'single',
      text: 'Bugün enerjin çekici — yeni insanlarla tanış, sahneye çık. Güneş seni parlak gösteriyor.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'relationship',
      text: 'Partnerine bugünkü başarını paylaş — küçük de olsa. Güneş paylaşarak büyüyor.' },
    { type: 'do', time: ['evening'], gender: 'man', rel: 'relationship',
      text: 'Sevdiklerinle günü paylaş — onlara ışığını ver. Güneş akşam sıcaklık dağıtır.' },
    { type: 'do', time: ['evening'], gender: 'woman', rel: 'single',
      text: 'Bugün yaptıkların için kendini takdir et — Güneş dışarıdan onay beklemeni istemiyor.' },
    // DONT
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Geri planda kalma bugün — Güneş ışığını saklayanı cezalandırır, öne çık.' },
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Takdir edilmeyeceğini düşünerek pes etme — Güneş bugün seni görüyor, devam et.' },
    { type: 'dont', time: ['evening', 'night'], gender: 'all', rel: 'all',
      text: 'Gün boyunca yapamadıkların için kendini yıpratma — Güneş battı, bırak gitsin, yarın yeni bir gün.' },
    { type: 'dont', time: ['morning', 'afternoon'], gender: 'woman', rel: 'all',
      text: 'Fikirlerini söylerken "sadece bence" diye küçültme — Güneş bugün sana güveniyor, sen de güven.' },
    { type: 'dont', time: ['morning', 'afternoon'], gender: 'man', rel: 'all',
      text: 'Başkalarının başarısını kıskanma — Güneş herkese yetecek kadar ışık veriyor.' },
    { type: 'dont', time: ['night'], gender: 'all', rel: 'all',
      text: 'Geç saatte büyük kararlar alma — Güneş battı, karar yarın sabaha kalsın.' },
    { type: 'dont', time: 'all', gender: 'all', rel: 'single',
      text: 'Başkalarının ışığında kaybolma — bugün senin parlama günün. Güneş seninle.' },
    { type: 'dont', time: ['evening'], gender: 'all', rel: 'relationship',
      text: 'İş konuşmalarını eve taşıma — Güneş akşam sıcaklık istiyor, performans değil.' },
  ],

  // ──────────────────────────────────────────────────────────────────────────
  //  ♀ VENÜS — Aşk, Güzellik, Çekim, Estetik, İlişkiler
  // ──────────────────────────────────────────────────────────────────────────
  'Venüs': [
    // DO
    { type: 'do', time: 'all', gender: 'all', rel: 'all',
      text: 'Bugün güzelliğe vakit ayır — bir çiçek al, güzel giy, estetik detaylara dikkat et. Venüs bunu istiyor.' },
    { type: 'do', time: ['dawn', 'morning'], gender: 'woman', rel: 'all',
      text: 'Sabah bakım rutinine fazladan 5 dakika ekle — Venüs bugün ayna karşısında gülümsemen için cesaret veriyor.' },
    { type: 'do', time: ['dawn', 'morning'], gender: 'man', rel: 'all',
      text: 'Bugün kıyafetine özen göster — Venüs çekim gücünü artırıyor, ilk izlenim her şeyi değiştirebilir.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'all', rel: 'single',
      text: 'Hoşlandığın birine bugün bir iltifat et — samimi, kısa, yürekten. Venüs cesaretini arkana alıyor.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'all', rel: 'relationship',
      text: 'Partnerine "neden seninle birlikteyim" dedirten bir jest yap — küçük olsun ama düşünceli.' },
    { type: 'do', time: ['evening'], gender: 'all', rel: 'relationship',
      text: 'Bu akşam telefonları bırakın ve birbirinize vakit ayırın — Venüs bağ kurmak istiyor, ekran değil.' },
    { type: 'do', time: ['evening'], gender: 'woman', rel: 'single',
      text: 'Bu akşam kendine bir randevu kur — favori yemeğin, sevdiğin dizi, mum ışığı. Venüs self-love istiyor.' },
    { type: 'do', time: ['evening'], gender: 'man', rel: 'single',
      text: 'Sosyal planını iptal etme — Venüs akşam çekim gücünü açıyor, git ve orada ol.' },
    { type: 'do', time: 'all', gender: 'woman', rel: 'all',
      text: 'Kendine bir güzellik hediye et — parfüm, bakım, yeni bir renk. Venüs bunu hak ettiğini söylüyor.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'all',
      text: 'Yaratıcı bir şey yap — çiz, yaz, tasarla, pişir. Venüs öğleden sonra ilham veriyor.' },
    { type: 'do', time: ['morning'], gender: 'all', rel: 'all',
      text: 'Bugün güzel bir kahve veya çay ritüeli yap — acele etme, tada odaklan. Venüs hızlı tüketimi sevmez.' },
    { type: 'do', time: ['night'], gender: 'all', rel: 'all',
      text: 'Gece bakım rutinine özen göster — Venüs gecesi güzellik uykusunun ta kendisi.' },
    { type: 'do', time: ['night'], gender: 'all', rel: 'single',
      text: 'Uyumadan önce rüya niyetini sevgi üzerine kur — Venüs gece kalbe fısıldar.' },
    { type: 'do', time: ['dawn'], gender: 'all', rel: 'all',
      text: 'Güne yumuşak başla — Venüs şafakta sertlik istemiyor, sakin bir müzik, ılık bir çay.' },
    { type: 'do', time: ['afternoon', 'evening'], gender: 'woman', rel: 'relationship',
      text: 'Partnerine bugün neden değerli olduğunu söyle — basit bir cümle, büyük etki.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'man', rel: 'relationship',
      text: 'Bugün sevdiğin birine beklemediği bir jest yap — çiçek, mesaj, sürpriz. Venüs detaylarda yaşıyor.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'single',
      text: 'Bir arkadaşınla buluş — kahve, yürüyüş, sohbet. Venüs sosyal bağlantıdan enerji alıyor.' },
    // DONT
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Bugün tartışma başlatma — Venüs uyum istiyor, savaş değil. Sorun varsa yarın konuş.' },
    { type: 'dont', time: ['night'], gender: 'all', rel: 'single',
      text: 'Gece geç saatte eski sevgilinin profilini stalklama — Venüs nostaljiyi tetikler ama o kapı kapandı.' },
    { type: 'dont', time: ['evening', 'night'], gender: 'all', rel: 'relationship',
      text: 'İlişkideki küçük sorunları bu akşam masaya yatırma — Venüs gecesi kavga gecesi değil.' },
    { type: 'dont', time: 'all', gender: 'woman', rel: 'all',
      text: 'Kendini başkalarıyla kıyaslama — Venüs senin benzersiz güzelliğini kutluyor, başkasınınkini değil.' },
    { type: 'dont', time: ['morning', 'afternoon'], gender: 'man', rel: 'all',
      text: 'Kaba veya düşüncesiz davranma — bugün Venüs her sözünü büyütüyor, nazik ol.' },
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Çirkin veya değersiz hissetme tuzağına düşme — Venüs seninle, kendinle barış.' },
    { type: 'dont', time: ['morning', 'afternoon'], gender: 'all', rel: 'single',
      text: '"Kimse beni beğenmez" moduna girme — Venüs tam tersini söylüyor, güven kendine.' },
    { type: 'dont', time: ['evening'], gender: 'woman', rel: 'single',
      text: 'Sosyal medyada başka çiftleri kıyaslama — senin zamanın gelecek, Venüs bunu biliyor.' },
    { type: 'dont', time: ['night'], gender: 'all', rel: 'all',
      text: 'Gece alışveriş sepetini onaylama — Venüs seni dürtüyor ama yarın pişman olursun.' },
    { type: 'dont', time: ['afternoon'], gender: 'all', rel: 'relationship',
      text: 'Partnerinle para kavgası yapma bugün — Venüs maddi değil, manevi değeri öne çıkarıyor.' },
  ],

  // ──────────────────────────────────────────────────────────────────────────
  //  ☿ MERKÜR — İletişim, Zeka, Yazışma, Öğrenme, Fikirler
  // ──────────────────────────────────────────────────────────────────────────
  'Merkür': [
    // DO
    { type: 'do', time: ['dawn', 'morning'], gender: 'all', rel: 'all',
      text: 'Günlük yaz veya yapılacaklar listeni hazırla — Merkür sabah zihin berrak, düşüncelerini yakala.' },
    { type: 'do', time: ['morning'], gender: 'all', rel: 'all',
      text: 'Önemli mesajlarını ve e-postalarını şimdi gönder — Merkür sabah kelimeleri pırıl pırıl yapıyor.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'all', rel: 'all',
      text: 'Bugün öğren — bir makale, podcast, video. Merkür merak edeni ödüllendiriyor.' },
    { type: 'do', time: ['morning'], gender: 'all', rel: 'single',
      text: 'Hoşlandığın kişiye zekice bir mesaj at — Merkür bugün kelimelerini çekici yapıyor.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'woman', rel: 'all',
      text: 'Fikirlerini yazıya dök bugün — Merkür kadın sezgisini kelimelere çevirdiğinde büyü başlıyor.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'man', rel: 'all',
      text: 'Bugünün önemli görüşmesine hazırlıklı gir — Merkür hazırlıklı olanı parlak gösterir.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'all',
      text: 'Sabah başladığın bir öğrenmeyi veya yazıyı tamamla — Merkür öğleden sonra toparlama istiyor.' },
    { type: 'do', time: ['evening'], gender: 'all', rel: 'all',
      text: 'Hafif bir sohbet aç — günü paylaş. Merkür akşam ağır değil, samimi istiyor.' },
    { type: 'do', time: ['night'], gender: 'all', rel: 'all',
      text: 'Aklına gelenleri not defterine yaz — Merkür gece fısıldıyor, sabah unutursun.' },
    { type: 'do', time: ['evening'], gender: 'all', rel: 'relationship',
      text: 'Partnerinle bugünü konuşun — sadece ne yaptınız değil, ne hissettiniz. Merkür derinlik istiyor.' },
    { type: 'do', time: ['dawn'], gender: 'all', rel: 'all',
      text: 'Uyandığında ilk düşünceni not et — Merkür şafakta bilinçaltından mesaj getirir.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'all', rel: 'relationship',
      text: 'Ertelediğin o konuşmayı bugün yap — Merkür netlik veriyor, kelimeler doğru akar.' },
    { type: 'do', time: ['afternoon', 'evening'], gender: 'man', rel: 'single',
      text: 'Bir arkadaşını ara — mesaj değil, sesli. Merkür bugün ses tonundan etkileniyor.' },
    // DONT
    { type: 'dont', time: ['dawn'], gender: 'all', rel: 'all',
      text: 'Yarım uykuluyken önemli mesaj atma — Merkür sabahın ilk 30 dakikasında bulanık çalışır.' },
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Dedikodu yapma bugün — Merkür her kelimeni büyütür, arkadan konuştuğun mutlaka duyulur.' },
    { type: 'dont', time: ['evening', 'night'], gender: 'all', rel: 'all',
      text: 'Gece geç saatte stresli mesajlara cevap verme — Merkür gece modu hatalı tuşlara basar.' },
    { type: 'dont', time: ['morning', 'afternoon'], gender: 'all', rel: 'all',
      text: 'Duygusal kararlar alma — Merkür bugün mantık istiyor, his değil.' },
    { type: 'dont', time: ['night'], gender: 'all', rel: 'all',
      text: 'Ekran başında bilgi bombardımanına maruz kalma — Merkür gece susmalı, zihin dinlenmeli.' },
    { type: 'dont', time: ['morning'], gender: 'woman', rel: 'all',
      text: 'Fikrini söylerken "yanlışsam kusura bakmayın" ekleme — Merkür sana güveniyor, sen de güven.' },
    { type: 'dont', time: ['afternoon'], gender: 'man', rel: 'all',
      text: 'Uzun ve karmaşık açıklamalara girme — Merkür bugün kısa ve net olanı sever.' },
    { type: 'dont', time: 'all', gender: 'all', rel: 'single',
      text: 'Mesajda laf dolandırma — Merkür bugün doğrudan olanı ödüllendiriyor. Ne demek istiyorsan söyle.' },
    { type: 'dont', time: ['evening'], gender: 'all', rel: 'relationship',
      text: 'Partnerinle konuşurken telefona bakma — Merkür dikkat dağınıklığını cezalandırır.' },
  ],

  // ──────────────────────────────────────────────────────────────────────────
  //  ☽ AY — Duygular, Sezgi, Aile, İç Dünya, Rüyalar
  // ──────────────────────────────────────────────────────────────────────────
  'Ay': [
    // DO
    { type: 'do', time: ['dawn'], gender: 'all', rel: 'all',
      text: 'Rüyanı hatırlamaya çalış — Ay şafakta mesaj bırakır, not al.' },
    { type: 'do', time: ['dawn', 'morning'], gender: 'all', rel: 'all',
      text: 'Sabah sessizliğinde iç sesini dinle — Ay sezgilerini bu saatlerde en yüksek seviyeye çıkarıyor.' },
    { type: 'do', time: ['morning'], gender: 'all', rel: 'all',
      text: 'Ailenden biriyle konuş veya kısa bir mesaj at — Ay aile bağlarını besliyor.' },
    { type: 'do', time: 'all', gender: 'all', rel: 'all',
      text: 'Kendine şefkatle yaklaş bugün — Ay mükemmellik değil, kabul istiyor.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'all',
      text: 'Doğada kısa bir yürüyüş yap — Ay toprakla temas istediğinde vücut huzur buluyor.' },
    { type: 'do', time: ['evening'], gender: 'all', rel: 'all',
      text: 'Evin atmosferini güzelleştir — ışık, koku, müzik. Ay akşam yuva istiyor.' },
    { type: 'do', time: ['night'], gender: 'all', rel: 'all',
      text: 'Uyumadan önce meditasyon veya nefes çalışması yap — Ay gece derinleşiyor, buyur et.' },
    { type: 'do', time: ['night'], gender: 'all', rel: 'all',
      text: 'Rüya niyetini kur: "Neye ihtiyacım var?" diye sor — Ay cevabı rüyanda verebilir.' },
    { type: 'do', time: ['dawn', 'morning'], gender: 'woman', rel: 'all',
      text: 'Duygularına alan aç — ağlamak istiyorsan ağla, gülmek istiyorsan gül. Ay bastırmayı sevmez.' },
    { type: 'do', time: ['morning'], gender: 'woman', rel: 'single',
      text: 'İç sesine güven bugün — Ay sezgileri keskinleştiriyor, "içimden bir his var" diyorsan doğrudur.' },
    { type: 'do', time: ['evening'], gender: 'woman', rel: 'relationship',
      text: 'Partnerine bugün nasıl hissettiğini anlat — süsleme, sade söyle. Ay samimiyetten beslenir.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'man', rel: 'all',
      text: 'Bugün duygularını bastırma — Ay erkeklere de hissettiriyor, güçlü olmak duymamak değil.' },
    { type: 'do', time: ['evening'], gender: 'man', rel: 'relationship',
      text: 'Partnerine "nasılsın, gerçekten?" diye sor ve dinle — Ay bugün derinlik istiyor.' },
    { type: 'do', time: ['night'], gender: 'man', rel: 'single',
      text: 'Uyumadan önce bugün seni mutlu eden bir anı düşün — Ay bunu bilinçaltına işler.' },
    { type: 'do', time: ['evening'], gender: 'all', rel: 'relationship',
      text: 'Sevdiklerinizle sıcak bir akşam yemeği paylaşın — Ay sofra etrafında büyü yapar.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'single',
      text: 'Özlediğin bir arkadaşını ara — "uzun süredir görüşmüyoruz" de. Ay bağları canlandırır.' },
    { type: 'do', time: ['night'], gender: 'woman', rel: 'single',
      text: 'Bu gece kendinle randevun var — sıcak duş, loş ışık, sessizlik. Ay self-care istiyor.' },
    // DONT
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Duygularını bastırma — Ay hissettiklerini işlemeni istiyor, yok saymayı değil.' },
    { type: 'dont', time: ['morning', 'afternoon'], gender: 'all', rel: 'all',
      text: 'Büyük rasyonel kararlar alma bugün — Ay duyguları yükseltir, mantık biraz bulanıklaşır.' },
    { type: 'dont', time: ['night'], gender: 'all', rel: 'single',
      text: 'Gece yalnızlık hissine teslim olma — Ay duyguları büyütür, sabah farklı hissedeceksin.' },
    { type: 'dont', time: ['night'], gender: 'all', rel: 'single',
      text: 'Eski fotoğraflara dalma — Ay nostalji tuzağı kurar, düşme.' },
    { type: 'dont', time: ['evening', 'night'], gender: 'all', rel: 'all',
      text: 'Gerilimli veya korku yaratan içerik tüketme — Ay gece hassasiyetini artırır.' },
    { type: 'dont', time: 'all', gender: 'woman', rel: 'all',
      text: 'Kendini "çok duygusal" diye eleştirme — Ay duyguları bir güç, zayıflık değil.' },
    { type: 'dont', time: 'all', gender: 'man', rel: 'all',
      text: 'Duygularını "zayıflık" olarak görme — Ay güçlü olmanın derinlikten geçtiğini biliyor.' },
    { type: 'dont', time: ['morning'], gender: 'all', rel: 'relationship',
      text: 'Partnerinle agresif tartışma başlatma — Ay bugün duyguları yüksekte, yaraya dokunmak kolay.' },
    { type: 'dont', time: ['evening'], gender: 'all', rel: 'relationship',
      text: 'Dış dünyanın kaotik haberlerini eve taşıma — Ay akşam sakinlik istiyor.' },
    { type: 'dont', time: ['afternoon'], gender: 'all', rel: 'all',
      text: 'Kendini başkalarıyla kıyaslama — Ay senin yolunun farklı ve değerli olduğunu biliyor.' },
  ],

  // ──────────────────────────────────────────────────────────────────────────
  //  ♄ SATÜRN — Disiplin, Sorumluluk, Sabır, Yapı, Olgunluk
  // ──────────────────────────────────────────────────────────────────────────
  'Satürn': [
    // DO
    { type: 'do', time: ['dawn', 'morning'], gender: 'all', rel: 'all',
      text: 'Bugünün en zor görevini ilk sıraya koy — Satürn ertelemeyi cezalandırır ama bitireni ödüllendirir.' },
    { type: 'do', time: ['morning'], gender: 'all', rel: 'all',
      text: 'Projelerin yapısını kur veya güncelle — Satürn sabah yapısal düşünceyi güçlendiriyor.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'all', rel: 'all',
      text: 'Uzun vadeli hedeflerine bugün somut bir adım at — Satürn "bir gün" demeyi sevmez, "bugün" de.' },
    { type: 'do', time: 'all', gender: 'all', rel: 'all',
      text: 'Disiplinli ol — küçük ama kararlı adımlar. Satürn sabırla büyüyeni ödüllendirir.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'all',
      text: 'Sabahki çalışmanın sonuçlarını değerlendir — Satürn öğleden sonra muhasebeyi sever.' },
    { type: 'do', time: ['evening'], gender: 'all', rel: 'all',
      text: 'Bugün başardıkların için kendini takdir et — Satürn sessiz kazanımları da görüyor.' },
    { type: 'do', time: ['night'], gender: 'all', rel: 'all',
      text: 'Yarına hazırlık yap — plan, kıyafet, çanta. Satürn hazırlıklı olanı ödüllendiriyor.' },
    { type: 'do', time: ['morning'], gender: 'woman', rel: 'all',
      text: 'Mali konularını gözden geçir — bütçe, tasarruf. Satürn "paranı bil" diyor.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'man', rel: 'all',
      text: 'Ertelediğin o bürokratik işi bugün hallet — fatura, form, başvuru. Satürn bitireni sever.' },
    { type: 'do', time: ['dawn'], gender: 'all', rel: 'all',
      text: 'Güne sade ve sistematik başla — Satürn şafakta lüks değil, düzen istiyor.' },
    { type: 'do', time: 'all', gender: 'all', rel: 'relationship',
      text: 'İlişkinizde bir sorumluluğu üstlenin — Satürn paylaşılan yükleri hafifletiyor.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'single',
      text: 'Kendinle bir sözleşme yap — Satürn kendine verdiğin sözü tutmanı izliyor.' },
    { type: 'do', time: ['evening'], gender: 'man', rel: 'relationship',
      text: 'Partnerine bir söz ver — ve tut. Satürn sözünde duranı güçlendirir.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'all', rel: 'all',
      text: 'Sistematik bir düzenleme yap — dosyalar, oda, masa, telefon. Satürn düzenden güç alır.' },
    // DONT
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Eğlence ve hafiflik beklentisiyle bu saate girme — Satürn iş istiyor, ama meyvesi altın.' },
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Spontan kararlar alma — Satürn planlı ilerlemeyi sever, impulse hamlelerden kaçın.' },
    { type: 'dont', time: ['morning', 'afternoon'], gender: 'all', rel: 'all',
      text: 'Yeni ve renkli başlangıçlar yapma — Satürn bugün sonuçlandırmayı istiyor, başlatmayı değil.' },
    { type: 'dont', time: ['evening', 'night'], gender: 'all', rel: 'all',
      text: 'Daha fazla iş alarak kendini yıpratma — Satürn akşam dinlenmeyi de hak ettiğini söylüyor.' },
    { type: 'dont', time: 'all', gender: 'woman', rel: 'all',
      text: 'Kendine çok sert olma — Satürn disiplin ister ama işkence değil, yumuşak ol.' },
    { type: 'dont', time: 'all', gender: 'man', rel: 'all',
      text: 'Her şeyi tek başına yapmaya çalışma — Satürn yardım istemeyi güçsüzlük değil, olgunluk sayar.' },
    { type: 'dont', time: ['night'], gender: 'all', rel: 'all',
      text: 'Geç saatte çalışma — Satürn sabah daha verimli olacağını biliyor, bırak ve uyu.' },
    { type: 'dont', time: ['morning'], gender: 'all', rel: 'all',
      text: 'Başkalarını eleştirme — Satürn önce "ben ne yaptım?" diye sormayı öğretiyor.' },
  ],

  // ──────────────────────────────────────────────────────────────────────────
  //  ♃ JÜPİTER — Şans, Fırsat, Genişleme, Cömertlik, Vizyon
  // ──────────────────────────────────────────────────────────────────────────
  'Jüpiter': [
    // DO
    { type: 'do', time: ['dawn', 'morning'], gender: 'all', rel: 'all',
      text: 'Büyük düşün — seni sınırlayan kalıpları bugün kır. Jüpiter küçüklüğe tahammül etmez.' },
    { type: 'do', time: ['morning'], gender: 'all', rel: 'all',
      text: 'Bir fırsat başvurusu yap veya cesur bir teklif gönder — Jüpiter kapıları açık tutuyor.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'all', rel: 'all',
      text: 'Cömert ol bugün — verdiğin katlanarak dönecek. Jüpiter cömertliği ödüllendiriyor.' },
    { type: 'do', time: 'all', gender: 'all', rel: 'all',
      text: 'Yeni insanlarla tanış — sohbet, bağlantı, networking. Jüpiter genişlemeyi sosyal alanda da istiyor.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'all',
      text: 'Bir öğrenme veya eğitim fırsatını yakala — Jüpiter bilgiye yatırım yapanı büyütüyor.' },
    { type: 'do', time: ['evening'], gender: 'all', rel: 'all',
      text: 'Bugünkü kazanımlarını kutla — Jüpiter şükranlık duyanı daha çok bereketlendiriyor.' },
    { type: 'do', time: ['night'], gender: 'all', rel: 'all',
      text: 'Büyük hayalini gözlerini kapatıp hayal et — Jüpiter gece büyük rüyalar eker.' },
    { type: 'do', time: ['morning'], gender: 'woman', rel: 'all',
      text: 'Bugün kendine olan inancını büyüt — Jüpiter kadın cesaretiyle efsaneler yazar.' },
    { type: 'do', time: ['morning', 'afternoon'], gender: 'man', rel: 'all',
      text: 'Mentor olarak birine yol göster veya kapı aç — Jüpiter paylaşanı daha büyük yapıyor.' },
    { type: 'do', time: ['morning'], gender: 'all', rel: 'single',
      text: 'Bugün yeni biriyle tanışma cesareti göster — Jüpiter şansı cesur olanlara veriyor.' },
    { type: 'do', time: ['evening'], gender: 'all', rel: 'relationship',
      text: 'Sevdiklerinizle güzel bir sofra kurun — Jüpiter bolluğu ve sevgiyi aynı masada buluşturur.' },
    { type: 'do', time: ['afternoon'], gender: 'all', rel: 'relationship',
      text: 'Partnerinle birlikte bir plan yapın — seyahat, kurs, yeni bir deneyim. Jüpiter birlikte büyümeyi sever.' },
    { type: 'do', time: ['afternoon', 'evening'], gender: 'man', rel: 'single',
      text: 'Arkadaşlarınla veya ailenle vakit geçir — Jüpiter cömertliği sosyal bağlarda yaşatır.' },
    { type: 'do', time: ['dawn'], gender: 'all', rel: 'all',
      text: 'Şükran listesi yap — 3 şey yeter. Jüpiter sabah niyetini minnetle şekillendireni bereketlendirir.' },
    // DONT
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Detaylara boğulma bugün — Jüpiter büyük resme odaklan diyor, ağaçlara takılma.' },
    { type: 'dont', time: 'all', gender: 'all', rel: 'all',
      text: 'Karamsar düşüncelere teslim olma — Jüpiter kapıların açık olduğunu söylüyor, bak etrafına.' },
    { type: 'dont', time: ['morning', 'afternoon'], gender: 'all', rel: 'all',
      text: 'Fırsatı erteleme — "yarın yaparım" Jüpiter\'in en sevmediği cümle.' },
    { type: 'dont', time: 'all', gender: 'all', rel: 'single',
      text: 'Yalnız kalmaya mahkum olduğunu düşünme — Jüpiter şansın değişeceğini söylüyor.' },
    { type: 'dont', time: ['evening'], gender: 'all', rel: 'all',
      text: 'İsrafla cömertliği karıştırma — Jüpiter akıllı bolluğu sever, savurganı değil.' },
    { type: 'dont', time: 'all', gender: 'man', rel: 'all',
      text: 'Aşırı iyimserlikle gerçekçiliği kaybetme — Jüpiter hayal kurar ama ayaklar yerde.' },
    { type: 'dont', time: 'all', gender: 'woman', rel: 'all',
      text: 'Hak etmediğini düşünme — Jüpiter sana "fazlasını iste" diyor, geri adım atma.' },
    { type: 'dont', time: ['night'], gender: 'all', rel: 'all',
      text: 'Gece büyük finansal kararlar alma — Jüpiter sabah daha berrak görür.' },
  ],
};

// ─── Havuzdan Madde Seçici (Seed Bazlı) ──────────────────────────────────────
// Gün + gezegen bazlı seed ile her gün farklı maddeler gösterir.
// Her kullanıcı profili için süzülmüş havuzdan 3 do + 2 don't seçer.

function seededShuffle(arr, seed) {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getDaySeed(date = new Date()) {
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();
  return y * 10000 + m * 100 + d;
}

export function selectPoolItems(planetKey, timeSlot, gender, relationshipStatus, date) {
  const pool = ITEM_POOL[planetKey];
  if (!pool) return null;

  // İlişki durumunu normalize et
  const rel = (relationshipStatus === 'single' || relationshipStatus === 'flirt')
    ? 'single'
    : (relationshipStatus === 'married' || relationshipStatus === 'in_relationship' || relationshipStatus === 'relationship')
      ? 'relationship'
      : null;

  // Filtrele
  const filtered = pool.filter(item => {
    // Zaman uyumu
    const timeMatch = item.time === 'all' ||
      (Array.isArray(item.time) && item.time.includes(timeSlot));
    if (!timeMatch) return false;

    // Cinsiyet uyumu
    const genderMatch = item.gender === 'all' || item.gender === gender;
    if (!genderMatch) return false;

    // İlişki uyumu
    const relMatch = item.rel === 'all' || (rel && item.rel === rel);
    if (!relMatch) return false;

    return true;
  });

  // Do ve Don't ayır
  const dos = filtered.filter(i => i.type === 'do');
  const donts = filtered.filter(i => i.type === 'dont');

  // Seed bazlı karıştır
  const seed = getDaySeed(date) + planetKey.charCodeAt(0) * 31;
  const shuffledDos = seededShuffle(dos, seed);
  const shuffledDonts = seededShuffle(donts, seed + 7777);

  return {
    dos: shuffledDos.slice(0, 3).map(i => i.text),
    donts: shuffledDonts.slice(0, 2).map(i => i.text),
  };
}

// ─── Zaman Dilimine Göre Yap / Yapma ────────────────────────────────────────
// Her gezegen × zaman dilimi için farklı içerik.
// Aynı gezegen gün içinde 2-3 kez gezse bile her seferinde farklı yazar.
//
// ╔════════════════════════════════════════════════════════════════╗
// ║  STUB İÇERİKLER — Nihai metinler kullanıcıyla yazılacak      ║
// ╚════════════════════════════════════════════════════════════════╝

export const PLANET_TIME_CONTENT = {
  'Güneş': {
    dawn: {
      description: 'Güneş henüz doğarken sen de uyanıyorsun. Bugünün enerjisi şekillenmeye başlıyor — ilk düşüncen bugünün gidişatını belirleyecek.',
      dos: ['Güne niyetini fısılda — bugün neyi başarmak istiyorsun?', 'Ayna karşısına geç ve kendine "bugün benim günüm" de', 'Erken kalkmanın verdiği avantajı kullan, o önemli işe başla'],
      donts: ['Telefona bakmadan önce kendi sesini dinle', 'Başkalarının gündemine kapılma, önce kendininkini kur'],
    },
    morning: {
      description: 'Güneş yükseldi, enerji zirvede. Sahneye çıkma, görünür olma ve kendini ifade etme zamanı.',
      dos: ['Önemli toplantını veya sunumunu şimdi yap', 'Uzun süredir ertelediğin cesur adımı at', 'Liderlik gerektiren bir inisiyatif al'],
      donts: ['Arka planda kalmak veya gizlenmek', 'Takdir edilmeyeceğini düşündüğün işlere girmek'],
    },
    afternoon: {
      description: 'Gün ortasında Güneş enerjisi hâlâ kuvvetli ama iniş başlıyor. Öğleye kadar yaptıklarını pekiştirme zamanı.',
      dos: ['Sabah başlattığın işi ilerlet ve sonuçlandır', 'Kendinle ilgili önemli bir kararı netleştir', 'Kendine bir mola ver ama tembellik değil — ödül olarak'],
      donts: ['Yeni büyük projelere başlamak', 'Enerjini tüketecek gereksiz tartışmalar'],
    },
    evening: {
      description: 'Güneş batıyor, günün ışığı soluyor. Bugün neler başardığını fark et ve kendini kutla.',
      dos: ['Bugünün kazanımlarını not et — küçük de olsa', 'Sevdiklerinle günü paylaş, onlara ışığını ver', 'Yarın için kısa bir vizyon kur'],
      donts: ['Gün boyunca yapamadıkların için kendini yıpratma', 'İş konuşmalarını eve taşıma'],
    },
    night: {
      description: 'Güneş ufkun altında. İç güneşini keşfetme zamanı — kim olduğunu hatırla, yarın için güç topla.',
      dos: ['Rüya niyetini belirle — yarın nasıl parlamak istiyorsun?', 'Kendinle baş başa kaliteli vakit geçir', 'İlham veren bir içerik tüket — film, kitap, müzik'],
      donts: ['Geç saatte büyük kararlar almak', 'Ekran ışığıyla iç ışığını bastırmak'],
    },
  },
  'Venüs': {
    dawn: {
      description: 'Venüs şafakta uyanıyor. Güne güzellikle başlamak, kendine vakit ayırmak için kozmik bir davet.',
      dos: ['Sabah bakım rutinine özen göster — cilt, saç, ten bakımı', 'Bugün giyeceğin şeyi özenle seç, kendini güzel hisset', 'Partnerine veya sevdiğin birine günaydın mesajı at'],
      donts: ['Aynadan kaçınma — bugün kendine bak ve beğen', 'Güne stresle başlama, yumuşak bir giriş yap'],
    },
    morning: {
      description: 'Venüs enerjisi sabah sana çekim gücü veriyor. İlişkiler, bağlantılar ve güzellik konularında altın saattesin.',
      dos: ['Dikkatini çeken birine mesaj at veya yaklaş', 'Yaratıcı bir işe başla — tasarım, yazı, müzik', 'Önemli bir alışveriş veya yatırım yap'],
      donts: ['Soğuk ve mesafeli iş görüşmeleri', 'Tartışma veya yüzleşme — bugün değil'],
    },
    afternoon: {
      description: 'Öğleden sonra Venüs hâlâ aktif. Sosyal bağlantılar, estetik projeler ve harmonik çalışmalar için ideal.',
      dos: ['Bir arkadaşınla buluş veya sohbet et', 'Evin veya çalışma alanının estetiğini düzelt', 'Kendine küçük bir hediye al'],
      donts: ['İzole olmak — bugün insan bağlantısı çok değerli', 'Ağır ve yorucu fiziksel işler'],
    },
    evening: {
      description: 'Akşam Venüs\'ün en romantik saati. Aşk, paylaşım ve samimi anlar için gökyüzü seninle.',
      dos: ['Akşam yemeğini özenle hazırla veya dışarı çık', 'Partnerinle kaliteli vakit geçir — telefonsuz', 'Mum ışığında, müzikle akşamı şölen yap'],
      donts: ['Sosyal medyada karşılaştırma yapma', 'İlişkideki sorunları bu akşam deşme — yarına bırak'],
    },
    night: {
      description: 'Gece Venüs\'ü. Güzellik uykusu, kendine şefkat ve rüyalarda aşk mesajları.',
      dos: ['Gece bakım rutinine özen göster', 'Kendinle barışık bir şekilde yatağa gir', 'Rüya niyetini sevgi üzerine kur'],
      donts: ['Geç saatte eski sevgiliye mesaj atma', 'Kendini yetersiz hissettiren içeriklere maruz kalma'],
    },
  },
  'Merkür': {
    dawn: {
      description: 'Merkür şafakta zihnini uyandırıyor. Gün başlamadan düşüncelerini topla ve planını kur.',
      dos: ['Günlük yaz veya yapılacaklar listeni hazırla', 'Önemli bir mesajın taslağını hazırla', 'Yeni bir şey öğrenmeye başla — podcast, makale'],
      donts: ['Yarım uykuluyken önemli mesaj atma', 'Bilgi kirliliğine maruz kalma — sosyal medya beklesin'],
    },
    morning: {
      description: 'Merkür sabah tam güçte. İletişim, yazışma, müzakere ve zihinsel çalışmalar için en keskin anındasın.',
      dos: ['Önemli e-postalarını ve mesajlarını şimdi gönder', 'Müzakere veya sunum yap — kelimeler pırıl pırıl', 'Yeni bilgi öğren, araştır, not al'],
      donts: ['Duygusal kararlar alma — bugün mantık günü', 'Monoton fiziksel işlerle zihnini boşaltma'],
    },
    afternoon: {
      description: 'Öğleden sonra Merkür biraz yavaşlıyor. Sabah başladığın zihinsel işleri toparlama ve sonuçlandırma zamanı.',
      dos: ['Sabahki yazışmaların cevaplarını kontrol et', 'Yarım kalan bir öğrenmeyi tamamla', 'Kısa bir zihinsel mola — yürüyüş veya nefes'],
      donts: ['Yeni ve karmaşık konulara dalma', 'Tartışmaları uzatma — sabah ne dediysen yeterli'],
    },
    evening: {
      description: 'Akşam Merkür\'ü hafifliyor. Günün zihinsel yükünü bırak, hafif sohbetler ve rahatlatıcı bilgi tüketimi.',
      dos: ['Hafif bir sohbet — güne dair paylaşım yap', 'Podcast veya hafif bir kitap oku', 'Yarınki planını zihninde şekillendir'],
      donts: ['Ağır iş mailleri okuma', 'Tartışmalara girme — zihin yorgundur'],
    },
    night: {
      description: 'Gece Merkür\'ü sessizleşiyor. Zihinsel dinlenme, rüyalarla gelen fikirler ve bilinçaltı işleme zamanı.',
      dos: ['Aklına gelenleri not defterine yaz', 'Meditasyon veya sessizlik pratikleri', 'Zihni rahatlatacak bir aktivite — bulmaca, müzik'],
      donts: ['Geç saatte stresli mesajlara cevap verme', 'Ekran başında bilgi bombardımanı'],
    },
  },
  'Ay': {
    dawn: {
      description: 'Ay şafakta uyanırken sezgilerin canlanıyor. İç sesin en net duyulduğu anlardasın.',
      dos: ['Rüyanı hatırlamaya çalış — mesaj taşıyor olabilir', 'Sabah sessizliğinde iç sesini dinle', 'Bir bardak ılık su veya çay ile güne yumuşak başla'],
      donts: ['Hemen koşturaca içine atılma', 'Sabahın ilk duygusunu bastırma'],
    },
    morning: {
      description: 'Sabah Ay enerjisi duyguları yüze taşıyor. Aile, ev ve yakın ilişkiler ön planda.',
      dos: ['Ailenden biriyle konuş veya mesaj at', 'Ev ile ilgili ertelediğin bir konuyu ele al', 'Duygusal bir kararı kalbinle tart'],
      donts: ['Agresif müzakereler — bugün duygular çok yüksekte', 'Büyük rasyonel kararlar alma'],
    },
    afternoon: {
      description: 'Öğleden sonra Ay duygusal derinliğini korurken biraz hafifliyor. İç gözlemlerin için alan aç.',
      dos: ['Günlüğüne veya notlarına duygularını yaz', 'Doğada kısa bir yürüyüş — toprakla temas', 'Kendine sevgiyle yaklaş, mükemmeliyet arama'],
      donts: ['Duygusal tepkilerle karar verme', 'Kendini başkalarıyla kıyaslama'],
    },
    evening: {
      description: 'Akşam Ay\'ı ev ve yuva hissiyatını güçlendiriyor. Sıcaklık, güvenlik ve paylaşım zamanı.',
      dos: ['Sevdiklerinle akşam yemeğinde buluş', 'Evin atmosferini güzelleştir — ışık, koku, müzik', 'Partnerinle veya aileinle derin bir paylaşım anı yarat'],
      donts: ['Tartışmaları bu akşama bırakma', 'Dış dünyanın kaotik haberlerini eve taşıma'],
    },
    night: {
      description: 'Gece Ay\'ın en derin saati. Bilinçaltı aktif, sezgiler zirvedez rüyalar anlamlı.',
      dos: ['Uyumadan önce meditasyon veya nefes çalışması yap', 'Rüya niyetini belirle — cevap arıyorsan sor', 'Kendini güvende hissettiren bir ritüel oluştur'],
      donts: ['Gerilimli veya korku yaratan içerik tüketme', 'Kontrolünde olmayan şeyler için endişelenme'],
    },
  },
  'Satürn': {
    dawn: {
      description: 'Satürn şafağı ağırbaşlı bir sorumluluk enerjisi taşıyor. Disiplinli bir başlangıç için doğru an.',
      dos: ['Bugünün en zor görevini ilk sıraya koy', 'Ertelediğin borç, fatura veya bürokratik işi ele al', 'Sade ve sistematik bir planla güne başla'],
      donts: ['Eğlence ve hafiflik beklentisi bu saatte yanlış', 'Spontan kararlar — bugün planlı ilerle'],
    },
    morning: {
      description: 'Sabah Satürn\'ü disiplin ve verimlilik istiyor. Yapısal çalışma zamanı.',
      dos: ['Projelerin yapısını kur veya güncelle', 'Mali konuları gözden geçir — bütçe, yatırım', 'Uzun vadeli hedeflerine bir adım at'],
      donts: ['Duygusal konuşmalar — şimdi mantık konuşuyor', 'Yeni ve renkli başlangıçlar — bugün sonuçlandır'],
    },
    afternoon: {
      description: 'Öğleden sonra Satürn ağırlığı biraz hafiflıyor. Disiplininin meyvesini görmeye başla.',
      dos: ['Sabahki çalışmanın sonuçlarını değerlendir', 'Sistematik bir arşivleme veya düzenleme yap', 'Kısa bir öz-değerlendirme — neredeyim, nereye gidiyorum?'],
      donts: ['Yorgunluğa teslim olma — biraz daha sabır', 'Başkalarını eleştirme — önce kendinle ilgilen'],
    },
    evening: {
      description: 'Akşam Satürn\'ü günün sorumluluklarını serbest bırakmanı istiyor. Ağırlığı omuzlarından indir.',
      dos: ['Bugün başardıkların için kendini takdir et', 'Yarın için kısa bir plan yap — sabaha hazır uyan', 'Bir mentöre veya büyüğüne teşekkür et'],
      donts: ['İş stresini eve taşıma', 'Daha fazla iş alarak kendini yıpratma'],
    },
    night: {
      description: 'Gece Satürn\'ü düzen ve yapı ile ilgili bilinçaltı çalışma yapıyor. Sakin bir kapanış.',
      dos: ['Yarına hazırlık — kıyafet, çanta, plan', 'Uyku düzenini koru — aynı saatte yat', 'Ruhsal bir olgunluk pratğii — şükran listesi'],
      donts: ['Geç saatte çalışma — yarın sabah daha verimli olur', 'Kaygı spiral\'ine girme'],
    },
  },
  'Jüpiter': {
    dawn: {
      description: 'Jüpiter şafakta büyük hayaller fısıldıyor. Gün başlamadan vizyonunu genişlet.',
      dos: ['Büyük düşün — seni sınırlayan kalıpları bugün kır', 'Bir fırsat başvurusu yap veya teklif gönder', 'Uzun vadeli hayaline somut bir adım ekle'],
      donts: ['Küçük düşünme — Jüpiter büyüklük istiyor', 'Reddedilme korkusuyla hareketsiz kalma'],
    },
    morning: {
      description: 'Sabah Jüpiter\'ü bolluk ve genişleme enerjisi taşıyor. Kapılar açılmak için hazır.',
      dos: ['Cesur bir teklif yap veya yatırım adımı at', 'Yeni insanlarla tanış — networking zamanı', 'Cömert ol — verdiğin katlanarak dönecek'],
      donts: ['Detaylara boğulmak — büyük resme odaklan', 'Karamsar düşüncelere teslim olmak'],
    },
    afternoon: {
      description: 'Öğleden sonra Jüpiter sabahki açılım enerjisini korumak istiyor. Momentum\'u koru.',
      dos: ['Sabah attığın büyük adımı pekiştir', 'Bir öğrenme veya eğitim fırsatını yakala', 'Birini mentor olarak yaklaş veya yardım iste'],
      donts: ['Fırsatı erteleme — "yarın yaparım" deme', 'Aşırı detaycılıkla büyük resmi kaçırma'],
    },
    evening: {
      description: 'Akşam Jüpiter\'ü sosyal bolluğu getiriyor. Paylaşım, kutlama ve şükran zamanı.',
      dos: ['Sevdiklerinle güzel bir sofra kur', 'Bugünkü kazanımlarını kutla', 'Biri için referans ol veya kapı aç — cömertlik bereketleşir'],
      donts: ['İsrafla cömertliği karıştırma', 'Aşırı iyimserlikle gerçekçiliği kaybetme'],
    },
    night: {
      description: 'Gece Jüpiter\'ü rüyalarda genişleme. Büyük vizyonlar uyku sırasında şekilleniyor.',
      dos: ['Yatmadan önce hayalini görselleştir — detaylı hayal kur', 'İlham veren bir içerik tüket — belgesel, biyografi', 'Şükran niyetiyle gözlerini kapat'],
      donts: ['Kaygı ve endişe ile uyuma', 'Kontrolün dışındaki şeyleri zihninde büyütme'],
    },
  },
  'Mars': {
    dawn: {
      description: 'Mars şafakta enerjini ateşliyor. Güne güçlü bir başlangıç için bedeni ve zihni harekete geçir.',
      dos: ['Sabah sporu veya stretching yap', 'Güne bir "savaş planı" ile başla — önceliklerini belirle', 'İlk işin cesaret gerektiren bir konu olsun'],
      donts: ['Yavaş ve tembelce başlama — Mars hız istiyor', 'Erteleme yapma — aksiyon zamanı'],
    },
    morning: {
      description: 'Sabah Mars enerjisi dorukta. Fiziksel güç, cesaret ve rekabet zamanı.',
      dos: ['Fiziksel enerjini kullan — spor, yürüyüş, hareket', 'Savunman gereken bir konuda sesini yükselt', 'Rekabetçi bir ortamda öne çık'],
      donts: ['Sinirle karar verme — ateş var ama kontrol de lazım', 'Narin duygusal konuşmalar — şimdi aksiyon zamanı'],
    },
    afternoon: {
      description: 'Öğleden sonra Mars biraz dengelenmeli. Sabahki ateşi verimli kanalize et.',
      dos: ['Sabahki eylemi sonuçlandır — yarım bırakma', 'Fiziksel bir hobiyle meşgul ol', 'Birikimiş öfkeyi sağlıklı bir şekilde boşalt — spor, dans'],
      donts: ['Öfkeyle mesaj atma veya sosyal medya paylaşımı', 'Sabır gerektiren, uzun zaman alacak işler'],
    },
    evening: {
      description: 'Akşam Mars\'ı yavaşlamalı. Günün savaşını kazan, ama akşam barış zamanı.',
      dos: ['Fiziksel bir rahatlama — duş, banyo, masaj', 'Bugünkü cesaretini kutla', 'Partner veya arkadaşlarla aktif bir aktivite — dans, oyun'],
      donts: ['Tartışma başlatma — Mars ateşi akşam yangına dönebilir', 'Agresif dürtülerle hareket etme'],
    },
    night: {
      description: 'Gece Mars\'ı uyuyor ama ateş köz altında. Enerjini yarın için sakla.',
      dos: ['Yarınki fiziksel hedefini belirle', 'Gerilimi salacak bir gece rutini — ağır battaniye, sessizlik', 'Cesaret gerektiren bir konu hakkında rüya niyeti koy'],
      donts: ['Geç saatte yoğun egzersiz', 'Adrenalinle uyumaya çalışma — önce sakinle'],
    },
  },
};

// ─── Cinsiyet Katmanı ───────────────────────────────────────────────────────
// Her gezegen için cinsiyete özel ek tavsiyeler
// STUB: Nihai metinler kullanıcıyla yazılacak

export const GENDER_LAYER = {
  'Güneş': {
    woman: { tip: 'Bugün liderliğini kadınsı gücünle harmanlayabilirsin — yumuşak ama kararlı.' },
    man:   { tip: 'Güneş enerjisi erkek arketipinle uyumlu — otorite ve koruyuculuk zamanı.' },
    lgbtq: { tip: 'Kendi benzersiz ışığını sahneye koy — toplumsal kalıplar bugün senin önünde eğilsin.' },
  },
  'Venüs': {
    woman: { tip: 'Kişisel bakım, saç, makyaj ve estetik detaylar bugün çekim gücünü katlayacak.' },
    man:   { tip: 'Kıyafet seçimine, kokuna ve çevrendeki ilk izlenime bugün fazladan dikkat et.' },
    lgbtq: { tip: 'Güzellik tanımını kendin yarat — Venüs seni olduğun gibi parlatan şeylerde saklı.' },
  },
  'Merkür': {
    woman: { tip: 'Sözlerin bugün çok etkili — diplomatik ama net iletişim seni zirveye taşır.' },
    man:   { tip: 'Dinlemek bugün konuşmaktan daha güçlü — önce anla, sonra cevap ver.' },
    lgbtq: { tip: 'Kendi deneyimini paylaşmak bugün çevreni aydınlatacak bir güçtür.' },
  },
  'Ay': {
    woman: { tip: 'Duygusal döngülerini izle — bedenin ve ay uyum içinde çalışıyor.' },
    man:   { tip: 'Kırılganlığını göstermek bugün güçsüzlük değil, cesaret — duygularını bastırma.' },
    lgbtq: { tip: 'İç dünyan bugün çok zengin — sezgilerine güven, onlar seni doğru yöne taşıyor.' },
  },
  'Satürn': {
    woman: { tip: 'Sınır koymak bugün kendine sevgi demek — hayır diyebildiğin yerde güçlüsün.' },
    man:   { tip: 'Sorumluluk taşımak kolay değil ama bugün omuzlarındaki yük seni büyütüyor.' },
    lgbtq: { tip: 'Toplumun yapılarına meydan okurken kendi yapını da sağlam tut — denge önemli.' },
  },
  'Jüpiter': {
    woman: { tip: 'Büyük vizyonunu gerçekleştirmek için bugün cüretkar ol — evren kadınca cesareti destekliyor.' },
    man:   { tip: 'Cömertliğin bugün karşılığını bulacak — bilgini, bağlantılarını paylaş.' },
    lgbtq: { tip: 'Topluluklar ve network\'ler bugün senin için kapı açıyor — bağlantılarını genişlet.' },
  },
  'Mars': {
    woman: { tip: 'Fiziksel gücünü kutla — spor, dans veya bedeni harekete geçiren her şey bugün şifa.' },
    man:   { tip: 'Ateşini doğru kanalize et — fiziksel aktivite bugün hem ruhsal hem bedensel ilaç.' },
    lgbtq: { tip: 'Cesaretin bulaşıcıdır — bugün bir adım at ve çevrene ilham ol.' },
  },
};

// ─── İlişki Durumu Katmanı ──────────────────────────────────────────────────
// Her gezegen için ilişki durumuna özel ek notlar
// STUB: Nihai metinler kullanıcıyla yazılacak

export const RELATIONSHIP_LAYER = {
  'Venüs': {
    single:       { note: 'Bekar olmak bugün özgürlük — kimseye bağlı olmadan kendi çekimini keşfet.' },
    relationship: { note: 'Partnerinle bugün özel bir an yarat — küçük ama anlamlı bir jest yeterli.' },
    married:      { note: 'Evliliğe yeni bir soluk kat — rutinden çık, ilk günlerdeki heyecanı hatırla.' },
    broken_up:    { note: 'Ayrılık acısı varken Venüs sana kendini sevmeyi öğretiyor — bugün sadece sen.' },
    platonic:     { note: 'Platonik bağın bugün daha da derinleşebilir — duygularını bastırma, izle.' },
    complicated:  { note: 'Karmaşık ilişkiler bugün biraz daha netleşebilir — içinden ne geçtiğini dinle.' },
    long_distance:{ note: 'Uzaktaki sevgiline bugün bir sürpriz mesaj at — mesafe ile bağ güçlenir.' },
    ex_trouble:   { note: 'Eski sevgili mevzuları bugün aklına gelebilir — nostaljiye kapılma, şimdiye odaklan.' },
  },
  'Ay': {
    single:       { note: 'Yalnızlık bugün bir seçim — kendi duygusal ihtiyaçlarını keşfet.' },
    relationship: { note: 'Partnerinle duygusal bir derinlik an yaratmak için mükemmel zaman.' },
    married:      { note: 'Aile bağlarını güçlendir — ev yaşamına sevgi infüzyonu yap.' },
    broken_up:    { note: 'Kırılmış bir kalple yüzleşmek Ay\'ın şifasıdır — yas tutmana izin var.' },
    platonic:     { note: 'Platonik hislerin bugün daha yoğun hissedilecek — duygularını yargılama.' },
    complicated:  { note: 'Duygusal karmaşada bugün sezgilerine güven — mantık yeterli gelmiyor.' },
    long_distance:{ note: 'Uzaktaki sevgilinle sesli veya görüntülü bağlantı kur — yüz ifadesi her şeyi anlatır.' },
    ex_trouble:   { note: 'Geçmişle yüzleşme zamanı — ama bugün karar verme, sadece hisset.' },
  },
};

// ─── Burç Elementi Katmanı ──────────────────────────────────────────────────
// Kullanıcının burç elementi + gezegen kombinasyonuna özel not.
// 4 element × 7 gezegen = 28 metin.

export const ZODIAC_ELEMENTS = {
  fire:  ['Koç', 'Aslan', 'Yay'],
  earth: ['Boğa', 'Başak', 'Oğlak'],
  air:   ['İkizler', 'Terazi', 'Kova'],
  water: ['Yengeç', 'Akrep', 'Balık'],
};

const ZODIAC_ID_TO_NAME = {
  aries: 'Koç', taurus: 'Boğa', gemini: 'İkizler', cancer: 'Yengeç',
  leo: 'Aslan', virgo: 'Başak', libra: 'Terazi', scorpio: 'Akrep',
  sagittarius: 'Yay', capricorn: 'Oğlak', aquarius: 'Kova', pisces: 'Balık',
};

export const getZodiacElement = (zodiacInput) => {
  if (!zodiacInput) return null;
  // Fallback to lowercase just in case the profile saved it differently ('Aries', 'ARIES')
  const normalizedInput = zodiacInput.toLowerCase();
  
  // Önce ID ise Türkçe isme çevir (aries -> Koç)
  let signName = ZODIAC_ID_TO_NAME[normalizedInput] || zodiacInput;
  
  // Her ihtimale karşı ilk harfini büyük yap ki ZODIAC_ELEMENTS içindeki dizilerle (örn 'Koç') eşleşsin
  if (signName && signName.length > 0) {
    signName = signName.charAt(0).toUpperCase() + signName.slice(1).toLowerCase();
    // 'başak' -> 'Başak', 'koç' -> 'Koç' (fakat türkçe karakter sorunu olabilir 'ikizler' -> 'İkizler')
    if (normalizedInput === 'gemini' || normalizedInput === 'ikizler') signName = 'İkizler';
    if (normalizedInput === 'aries' || normalizedInput === 'koç') signName = 'Koç';
    if (normalizedInput === 'taurus' || normalizedInput === 'boğa') signName = 'Boğa';
    if (normalizedInput === 'leo' || normalizedInput === 'aslan') signName = 'Aslan';
    if (normalizedInput === 'virgo' || normalizedInput === 'başak') signName = 'Başak';
    if (normalizedInput === 'libra' || normalizedInput === 'terazi') signName = 'Terazi';
    if (normalizedInput === 'scorpio' || normalizedInput === 'akrep') signName = 'Akrep';
    if (normalizedInput === 'sagittarius' || normalizedInput === 'yay') signName = 'Yay';
    if (normalizedInput === 'capricorn' || normalizedInput === 'oğlak') signName = 'Oğlak';
    if (normalizedInput === 'aquarius' || normalizedInput === 'kova') signName = 'Kova';
    if (normalizedInput === 'pisces' || normalizedInput === 'balık') signName = 'Balık';
    if (normalizedInput === 'cancer' || normalizedInput === 'yengeç') signName = 'Yengeç';
  }

  for (const [element, signs] of Object.entries(ZODIAC_ELEMENTS)) {
    if (signs.includes(signName)) return { element, signName };
  }
  return null;
};

export const ZODIAC_ELEMENT_LAYER = {
  'Güneş': {
    fire:  'Güneş saatinde {sign} ateşi alevleniyor. Bu saat seni sıradan kılacak hiçbir güç yok — sahne senin, çık ve parla.',
    earth: '{sign} enerjin Güneş saatinde sessiz güçten görünür güce geçiyor. Bugün kendini küçümseme — herkes seni görmeli.',
    air:   'Güneş saatinde {sign} zekası parlak bir çığa kavuşuyor. Fikirlerini bugün seslendirmek bir tercih değil, zorunluluk.',
    water: '{sign} derinliğin Güneş saatinde yüzeye çıkıyor. İç dünyan ne kadar zengin olursa olsun, bugün görünmek seni büyütüyor.',
  },
  'Venüs': {
    fire:  'Venüs ve {sign} ateşi: tutku ile zarafetin buluştuğu an. Çekim gücün bugün yakıcı ama nazik — karşı konulmaz.',
    earth: 'Venüs {sign} enerjinle mantıklı bir uyum kuruyor. Bugün verdiğin sevgi tam yerine oturuyor — hem gönül hem akıl bir arada.',
    air:   'Venüs saatinde {sign} sosyal büyüsü zirvede. Her konuşman bir bağ, her gülüşün bir kapı açıyor bugün.',
    water: 'Venüs saatinde {sign} derinliği sevgiyi bir okyanusa dönüştürüyor. Bu saat sende farklı çalışıyor — çok daha derinden.',
  },
  'Merkür': {
    fire:  'Merkür saatinde {sign} içgüdüsü keskin kararlar için çalınıyor. Düşün ama çok düşünme — içgüdüne güven.',
    earth: 'Merkür ve {sign} pratikliği: analiz ile eylemin mükemmel birliği. Planlı konuşmalar bugün taş üstüne taş koyuyor.',
    air:   'Bu saat {sign} evreninin tam merkezi. Merkür enerjinle birleşince zihin lazer gibi keskin — kelimelerini boşa harcama.',
    water: 'Merkür saatinde {sign} sezgisi mantığa elbisesini giydiriyor. Hem duyuyorsun hem anlıyorsun — ikisini birden kullan.',
  },
  'Ay': {
    fire:  'Ay saatinde {sign} içgüdüsünü dinle — o ani his seni doğru yöne çekiyor. Duyguyu bastırma, hisset ve hareket et.',
    earth: 'Ay saati {sign} için nadir bir iç ses penceresi. Pratik zihnini bir kenara bırak — sezgilerin bugün daha net görüyor.',
    air:   'Ay saatinde {sign} aklı duygularla dans ediyor. Mantıklı olmaya çalışma — bu saatte kalbin daha iyi biliyor.',
    water: 'Ay enerjisi {sign} enerjisinin doğal habitatı — bu senin saatin. Sezgilerin şu an neredeyse kehanet gücünde.',
  },
  'Satürn': {
    fire:  'Satürn saati {sign} ateşinin en zorlu sınavı. Hız yerine sabır — bugün frene basmak aslında ilerlemenin ta kendisi.',
    earth: 'Satürn ve {sign} doğal müttefikler. Bu saat seni küçük adımların gizli gücüyle besliyor — güven.',
    air:   'Satürn saatinde {sign} fikirlerini yapıya dönüştür. Bugün plan olsun, yarın gerçek.',
    water: 'Satürn saatinde {sign} derinliği dengeleniyor. Duygular değil sorumluluk rehberin — bugün yük taşımak seni büyütüyor.',
  },
  'Jüpiter': {
    fire:  'Jüpiter ve {sign} ateşi: efsanevi kombinasyon. Bu saatte büyük düşünmek yetmez — inanılmaz düşün ve yap.',
    earth: 'Jüpiter saatinde {sign} güvenli limanının dışına çık. Genişleme zamanı — fırsat tam karşında bekliyor.',
    air:   'Jüpiter ve {sign} havası: fırsatların kapıda sıra beklediği an. Bugün kurduğun her bağlantı yarın bir kapıya dönüşür.',
    water: 'Jüpiter saatinde {sign} sezgisi seni doğru fırsata yönlendiriyor. O içgüdüsel "evet"e güven — evren de evet diyor.',
  },
  'Mars': {
    fire:  'Bu saat senin doğal frekansın. Mars\'ın ateşi {sign} enerjinle birleşince kimse durduramaz seni — harekete geç.',
    earth: 'Mars saatinde {sign} sabrı büyük avantaj. Diğerleri acelesiyle hata yaparken sen doğru hamleyi yaparsın.',
    air:   'Mars saatinde {sign} zekası bir silaha dönüşüyor. En güçlü silahın kelimeler — düşünce cesur, ifade keskin olsun.',
    water: 'Mars saatinde {sign} derinliği enerjiyle dolup taşıyor. Hem güçlüsün hem stratejiksin — bu nadir kombinasyonu bugün kullan.',
  },
};

// ─── Gökyüzü Katmanı (Cosmic Overlays) ──────────────────────────────────────
// Ay fazı ve Merkür durumuna göre ek uyarılar/güçlendirmeler.
// Bu mesajlar gezegen kartının altına küçük bir "kozmik fısıltı" olarak eklenir.

export const COSMIC_OVERLAYS = {
  // Ay Fazları
  moonPhase: {
    'Yeni Ay':      { emoji: '🌑', message: 'Yeni Ay döngüsünde niyetler güçleniyor. Bugün ne ekersen yarın biçersin.' },
    'Hilal':        { emoji: '🌒', message: 'Ay büyüyor, niyetlerin filizleniyor. Küçük ama kararlı adımlar at.' },
    'İlk Dördün':   { emoji: '🌓', message: 'İlk Dördün gerilimi — karşına engel çıkabilir ama kararlılığın seni aşırır.' },
    'Büyüyen Ay':   { emoji: '🌔', message: 'Ay neredeyse doldu. Son cilalama detayları için mükemmel zaman.' },
    'Dolunay':      { emoji: '🌕', message: 'Dolunay ışığında sırlar aydınlanıyor. Duygular çok yoğun — akışa güven.' },
    'Küçülen Ay':   { emoji: '🌖', message: 'Ay küçülüyor, paylaşma zamanı. Öğrendiklerini ve kazandıklarını dağıt.' },
    'Son Dördün':   { emoji: '🌗', message: 'Temizlik ve ayıklama zamanı. Sana ağır gelen her şeyi bırak.' },
    'Balzamik Ay':  { emoji: '🌘', message: 'Ay neredeyse karardı. Dinlen, şifalan, sessizliğe çekil.' },
  },
  // Merkür Durumu
  mercury: {
    retro:  { emoji: '☿️↺', message: 'Merkür Retro devrede — iletişimde dikkatli ol, eski konular geri gelebilir.' },
    shadow: { emoji: '☿️~', message: 'Merkür gölge fazında — yavaşlık ve belirsizlik başlıyor, dikkatli geçişler yap.' },
    direct: null, // İleri giderken ek mesaj gerekmez
  },
};

// ─── Cosmic Banner Mesajları ────────────────────────────────────────────────
// Saat kartları arasına eklenen "kozmik haber kutucukları"

export const BANNER_TEMPLATES = {
  sunrise: (time) => ({
    icon: 'wb_sunny',
    color: '#fbbf24',
    title: 'Gün Doğumu',
    subtitle: `Güneş ${time}'de doğdu — gündüz döngüsü başlıyor`,
    type: 'transition',
  }),
  sunset: (time) => ({
    icon: 'nights_stay',
    color: '#8b5cf6',
    title: 'Gün Batımı',
    subtitle: `Güneş ${time}'de battı — gece döngüsü başlıyor`,
    type: 'transition',
  }),
  moonPhase: (phase) => {
    const MOON_EMOJI = {
      'Yeni Ay': '🌑', 'Hilal': '🌒', 'İlk Dördün': '🌓', 'Büyüyen Ay': '🌔',
      'Dolunay': '🌕', 'Küçülen Ay': '🌖', 'Son Dördün': '🌗', 'Balzamik Ay': '🌘',
    };
    const MOON_FACT = {
      'Yeni Ay':    'Ay, Güneş ile aynı hizaya geçti — gökyüzünde görünmüyor.',
      'Hilal':      'Ay %1–49 aydınlık, akşam ufkunda ince bir dilim olarak görünüyor.',
      'İlk Dördün': 'Ay %50 aydınlık. Güneş\'e tam dik açıda, öğleden sonra doğuyor.',
      'Büyüyen Ay': 'Ay %50–99 aydınlık. Gece yarısından önce doğuyor, gökyüzü parlak.',
      'Dolunay':    'Ay %100 aydınlık. Dünya\'nın tam karşısına geçti — gece en aydınlık.',
      'Küçülen Ay': 'Ay %99–50 küçülüyor. Gece yarısından sonra doğuyor.',
      'Son Dördün': 'Ay %50 aydınlık. Sabah göğünde beliriyor, güneşten dik açıda.',
      'Balzamik Ay':'Ay %1–49 aydınlık, şafaktan önce doğuyor — neredeyse görünmez.',
    };
    const emoji = MOON_EMOJI[phase.name] || '🌙';
    return {
      emoji,
      color: '#c4b5fd',
      title: phase.name,
      subtitle: MOON_FACT[phase.name] || '',
      type: 'cosmic_event',
    };
  },
  mercuryRetro: () => ({
    icon: 'sync_problem',
    color: '#f87171',
    title: 'Merkür Retro',
    subtitle: 'Merkür, Dünya\'ya göre görünürde geriye hareket ediyor. Yaklaşık 21 gün sürecek.',
    type: 'warning',
  }),
  peakHour: (planetName) => ({
    emoji: '⭐',
    color: '#fbbf24',
    title: `${planetName} — Altın Saat`,
    subtitle: 'Bugünün en güçlü anındasın. Hemen açıp bakmalısın.',
    type: 'peak',
  }),
};

// ─── Ana İçerik Üretici ─────────────────────────────────────────────────────
/**
 * Kişiselleştirilmiş gezegen saati içeriği üretir.
 * 
 * @param {string} planetKey    - Gezegen adı (ör: 'Venüs')
 * @param {Date}   date         - O saatin tarihi
 * @param {object} userProfile  - { gender, relationshipStatus, zodiac }
 * @param {object} cosmicState  - { moonPhase, mercuryStatus }
 * @returns {object} { description, dos, donts, genderTip, relationshipNote, cosmicWhisper }
 */
export const getPersonalizedContent = (planetKey, date, userProfile = {}, cosmicState = {}) => {
  const timeSlot = getTimeSlot(date);
  const planet = PLANETS[planetKey];
  
  if (!planet) return null;
  
  // 1. İçerik kaynağı: ITEM_POOL varsa havuzdan seç, yoksa eski sisteme fallback
  const poolResult = selectPoolItems(planetKey, timeSlot, userProfile.gender, userProfile.relationshipStatus, date);
  
  let description, dos, donts;
  
  if (poolResult && poolResult.dos.length >= 2) {
    // Havuz sistemi aktif — description hâlâ zaman bazlı (şimdilik)
    const timeContent = PLANET_TIME_CONTENT[planetKey]?.[timeSlot];
    description = timeContent?.description || planet.coreEnergy;
    dos = poolResult.dos;
    donts = poolResult.donts;
  } else {
    // Eski sistem (henüz havuza taşınmamış gezegenler)
    const timeContent = PLANET_TIME_CONTENT[planetKey]?.[timeSlot] || {
      description: planet.coreEnergy,
      dos: ['Bu saati farkındalıkla geçir'],
      donts: ['Acele etme'],
    };
    description = timeContent.description;
    dos = timeContent.dos;
    donts = timeContent.donts;
  }
  
  // 2. Cinsiyet katmanı
  const genderTip = GENDER_LAYER[planetKey]?.[userProfile.gender]?.tip || null;
  
  // 3. İlişki katmanı
  const relationshipNote = RELATIONSHIP_LAYER[planetKey]?.[userProfile.relationshipStatus]?.note || null;

  // 4. Burç elementi katmanı
  const zodiacResult = getZodiacElement(userProfile.zodiac);
  let zodiacNote = null;
  if (zodiacResult) {
    const template = ZODIAC_ELEMENT_LAYER[planetKey]?.[zodiacResult.element];
    if (template) {
      zodiacNote = template.replace(/\{sign\}/g, zodiacResult.signName);
    }
  }
  
  // 5. Gökyüzü katmanı
  let cosmicWhisper = null;
  if (cosmicState.moonPhase) {
    const moonOverlay = COSMIC_OVERLAYS.moonPhase[cosmicState.moonPhase];
    if (moonOverlay) cosmicWhisper = moonOverlay.message;
  }
  
  let mercuryWarning = null;
  if (cosmicState.mercuryStatus === 'retro') {
    mercuryWarning = COSMIC_OVERLAYS.mercury.retro.message;
  } else if (cosmicState.mercuryStatus === 'shadow') {
    mercuryWarning = COSMIC_OVERLAYS.mercury.shadow.message;
  }
  
  return {
    planet,
    timeSlot: TIME_SLOTS[timeSlot],
    description,
    dos,
    donts,
    genderTip,
    relationshipNote,
    zodiacNote,
    cosmicWhisper,
    mercuryWarning,
  };
};
