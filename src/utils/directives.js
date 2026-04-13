// SIGN_ELEMENTS is duplicated here to avoid circular imports with cosmicUtils
const SIGN_ELEMENTS = {
  'Koç': 'Ateş', 'Aslan': 'Ateş', 'Yay': 'Ateş',
  'Boğa': 'Toprak', 'Başak': 'Toprak', 'Oğlak': 'Toprak',
  'İkizler': 'Hava', 'Terazi': 'Hava', 'Kova': 'Hava',
  'Yengeç': 'Su', 'Akrep': 'Su', 'Balık': 'Su'
};

export const COSMIC_THEMES = {
  STRATEGIC: 'Stratejik Atılım Döngüsü',
  PURGE: 'Radikal Arınma Günü',
  GENESIS: 'Kozmik Başlangıç Rehberi',
  NAVIGATION: 'Yol Ayrımı ve Kararlılık',
  HARVEST: 'Hasat ve Farkındalık Zamanı',
  HEALING: 'Ruhsal Şifa ve İnziva',
  REVISION: 'Sistem Güncelleme ve Revizyon',
  WISDOM: 'Bilgelik ve Paylaşım Evresi'
};

const MOON_MAP = {
  'Yeni Ay': 'NEW_MOON',
  'Hilal': 'WAXING_CRESCENT',
  'İlk Dördün': 'FIRST_QUARTER',
  'Büyüyen Ay': 'WAXING_GIBBOUS',
  'Dolunay': 'FULL_MOON',
  'Küçülen Ay': 'WANING_GIBBOUS',
  'Son Dördün': 'LAST_QUARTER',
  'Balzamik Ay': 'WANING_CRESCENT'
};

// Çekirdek açıklamalar (Gökyüzündeki objektif durum)
const CORE_DIRECTIVES = {
  'DIRECT_NEW_MOON': {
    theme: COSMIC_THEMES.GENESIS,
    text: "Bugün gökyüzünde karar alma hızını ve iletişimini açık kılan Merkür transiti ile, yepeni bir döngüyü başlatan Yeni Ay enerjisi birleşiyor. Astrolojik olarak bu kombinasyon tam bir 'start verme' zamanıdır."
  },
  'DIRECT_WAXING_CRESCENT': {
    theme: COSMIC_THEMES.STRATEGIC,
    text: "Zihnini berraklaştıran Merkür enerjisi, niyetlerini fiziksel dünyaya aktarmaya hazırlanan Hilal fazıyla buluşuyor. Düşüncelerinin artık somut bir eyleme dönüşme vakti geldi."
  },
  'DIRECT_FIRST_QUARTER': {
    theme: COSMIC_THEMES.NAVIGATION,
    text: "Merkür'ün ileri hareketi hedeflerine hızlıca koşmanı isterken, İlk Dördün gerilimi karşına küçük engeller çıkararak kararlılığını test ediyor. Engeller bugün seni durdurmak için değil, hızını ayarlaman için orada."
  },
  'DIRECT_WAXING_GIBBOUS': {
    theme: COSMIC_THEMES.REVISION,
    text: "Merkür'ün keskin zekasıyla projelerinde veya ilişkilerinde büyük finale hazırlanıyorsun. Büyüyen Ay, sabırla atacağın o son cilalama adımlarının her şeyden önemli olduğunu söylüyor."
  },
  'DIRECT_FULL_MOON': {
    theme: COSMIC_THEMES.HARVEST,
    text: "Merkür iletişimi kusursuzlaştırırken, Dolunay her türlü gerçeği ve sırrı gün yüzüne çıkarıyor. Mantığın ve duygularının aynı hizaya geldiği, beklediğin o keskin sonucu aldığın çok güçlü bir gündesin."
  },
  'DIRECT_WANING_GIBBOUS': {
    theme: COSMIC_THEMES.WISDOM,
    text: "Başarılarından ve kapanan konulardan elde ettiğin dersleri sindirme zamanındasın. Küçülen Ay, iletişim gezegeni Merkür'ün de desteğiyle, bilgeliğini ve neşeni çevrene rahatça aktarabileceğini fısıldıyor."
  },
  'DIRECT_LAST_QUARTER': {
    theme: COSMIC_THEMES.PURGE,
    text: "Bugün gökyüzünde karar alma hızını artıran bir Merkür transiti devrede. Ay'ın Son Dördün fazı ise bu hızı, hayatındaki gereksiz yüklerden ve artık sana hizmet etmeyen alışkanlıklardan kurtulmak için kullanmanı istiyor."
  },
  'DIRECT_WANING_CRESCENT': {
    theme: COSMIC_THEMES.HEALING,
    text: "Merkür'ün zihinsel hızı yavaşlarken, Balzamik Ay seni sessizliğe ve inzivaya çekiyor. Yeni bir karara imza atmadan veya yorucu bir sohbete girmeden önce sadece durup ruhunu dinlendirme vakti."
  },

  // Retrolar için temel gövdeler
  'RETROGRADE_NEW_MOON': {
    theme: COSMIC_THEMES.GENESIS,
    text: "Merkür'ün geri hareketi geçmişin tozunu attırırken, Yeni Ay sana eski bir konu üzerinden yepyeni bir başlangıç yapma fırsatı sunuyor. Dışarıya değil, sadece kendi içine kapanarak kararlar alma günü."
  },
  'RETROGRADE_WAXING_CRESCENT': {
    theme: COSMIC_THEMES.STRATEGIC,
    text: "İçinde bir şeyler filizlenmek istiyor ancak Retro Merkür seni geçmişte bıraktığın bir detayı incelemeye zorluyor. Atılımını yapmadan önce arkanda bıraktığın o eksik taşı yerine oturt."
  },
  'RETROGRADE_FIRST_QUARTER': {
    theme: COSMIC_THEMES.NAVIGATION,
    text: "Geçmişten gelen bir iletişim krizi veya pürüz, İlk Dördün gerilimiyle bugün tekrar kapını çalabilir. Bu pürüzü geçmişin tecrübeleriyle çözerek krizi harika bir fırsata çevirebilirsin."
  },
  'RETROGRADE_WAXING_GIBBOUS': {
    theme: COSMIC_THEMES.REVISION,
    text: "Büyük bir hasat öncesi, askıda kalmış işleri ve bitmemiş diyalogları tamamlamak için son kozmik şansın. İletişim kazalarına çok dikkat ederek eksiklikleri gidermelisin."
  },
  'RETROGRADE_FULL_MOON': {
    theme: COSMIC_THEMES.PURGE,
    text: "Retro Merkür zihnini sıkıştırırken Dolunay'ın güçlü ışığı tüm gizli kalanları ortaya döküyor. Yarım kalmış eski bir ilişkinin veya meselenin radikal yüzleşmesini yaşamaya çok uygun bir gün."
  },
  'RETROGRADE_WANING_GIBBOUS': {
    theme: COSMIC_THEMES.WISDOM,
    text: "Ağzından çıkanların yanlış anlaşılabileceği, iletişimde sınırların bulanıklaştığı bir Retro günü. En büyük bilgeliğin sessizlikte olduğunu bilerek, dışarıdan çok sadece kendi iç sesini dinle."
  },
  'RETROGRADE_LAST_QUARTER': {
    theme: COSMIC_THEMES.PURGE,
    text: "En radikal temizlik günü. Merkür retrodayken zihnini kirleten o eski korkuları, Son Dördün Ay'ın sana verdiği o bitirme cesaretiyle sonsuza kadar hayatından çıkarabilirsin."
  },
  'RETROGRADE_WANING_CRESCENT': {
    theme: COSMIC_THEMES.HEALING,
    text: "İletişimin de enerjinin de sıfırlandığı bir nokta. Zihnini yoran iç seslerini tamamen kapatıp, hiçbir karar almadan sadece dinlenme ve derin bir şifalanma sürecine teslim olma günü."
  }
};

// Ateş, Toprak, Hava, Su elementleri için kuyruk(Aksiyon) cümleleri - Psikoloji ve İç Dünyaya Odaklanma (Emir kipi olmadan)
const ELEMENT_ACTIONS = {
  'Ateş': "Ateş elementinin o tanıdık, sabırsız ve harekete geçmek isteyen enerjisi şu an zihninde yoğunlaşıyor. Durup bir şeyleri izlemek yerine müdahale etme arzusu, içindeki o yakıcı kıvılcım, sana artık hareketsiz kalmanın yorucu geldiğini işaret ediyor olabilir.",
  'Toprak': "Toprak elementinin doğasındaki o korumacı içgüdü, şu günlerde derin bir sadeleşme ve güvende hissetme arayışına bırakıyor kendini. Sıkıca tutunduğun ama artık sana hizmet etmeyen bazı yapıların, zihninde yavaş yavaş bir yüke dönüştüğünü hissediyor olabilirsin.",
  'Hava': "Hava elementinin o sürekli uçuşan, analiz eden ve olasılıkları tartan zihni şu an bir karar noktasına doğru çekiliyor. Dağınık fikirler ve çok fazla ihtimal arasında gidip gelmek, rüzgarın artık bir yöne esmek için içeriden seni zorladığını hissettiriyor.",
  'Su': "Su elementinin derinliklerindeki o yoğun duygusal akış ve görünmeyeni sezme yetisi bu aralar zirvede. Mantıklı açıklamaların bittiği yerde, göğüs kafesinde hissettiğin o açıklanamayan ama çok net olan çekim, senin şu anki en büyük pusulan haline geliyor."
};

const FALLBACK_ACTION = "Zodyak haritanın konumundan bağımsız olarak, bugün sadece akışta kalman ve uzun vadeli kalıcı kararlar almaktan ziyade durumu analiz etmen en doğrusu olacaktır.";

export const getDirective = (state, currentSign, moonPhaseStr, userZodiac) => {
  let normalizedState = 'DIRECT';
  if (state.includes('RETROGRADE')) normalizedState = 'RETROGRADE';
  if (state.includes('GÖLGE')) normalizedState = 'DIRECT'; // Gölgeleri Direct mantığına bağlıyoruz, detayda yormamak için

  const key = `${normalizedState}_${MOON_MAP[moonPhaseStr] || 'NEW_MOON'}`;
  const core = CORE_DIRECTIVES[key] || CORE_DIRECTIVES['DIRECT_NEW_MOON'];

  const element = SIGN_ELEMENTS[userZodiac];
  let tail = element ? ELEMENT_ACTIONS[element] : FALLBACK_ACTION;

  // Özel merkür burcu teması eklenebilir
  let intro = '';
  if (element && currentSign) {
     intro = `Merkür ${currentSign} burcundayken; `;
  }

  const finalTheme = core.theme;
  const finalText = `${intro}${core.text} ${tail}`;

  return {
    theme: finalTheme,
    text: finalText
  };
};
