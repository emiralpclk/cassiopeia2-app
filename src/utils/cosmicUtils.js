/**
 * Calculations for Moon Phases, Planetary Retrogrades, and Sunrise/Sunset
 * No external API required — all live from astronomy-engine.
 */
import {
  MoonPhase as AstroMoonPhase,
  GeoVector,
  Ecliptic,
  Body,
  MakeTime,
  SearchRiseSet,
  Observer
} from 'astronomy-engine';

import { getCityCoordinates, DEFAULT_COORDINATES } from './cities';

// ─── Gün Doğumu / Batımı Hesaplayıcı ────────────────────────────────────────
// Kullanıcının şehrindeki GERÇEK gün doğumu ve batımı.
// Mevsime ve konuma göre her gün farklıdır.

const DIRECTION_RISE = 1;   // astronomy-engine: +1 = Rise
const DIRECTION_SET  = -1;  // astronomy-engine: -1 = Set

/**
 * Belirtilen şehir ve tarih için gerçek gün doğumu ve batımı hesaplar.
 * @param {string} cityName - Kullanıcının doğduğu/bulunduğu şehir
 * @param {Date} date - Hesaplanacak tarih (varsayılan: bugün)
 * @returns {{ sunrise: Date, sunset: Date, dayLength: number, nightLength: number }}
 */
export const getSunTimes = (cityName, date = new Date()) => {
  const coords = getCityCoordinates(cityName);
  const observer = new Observer(coords.lat, coords.lng, 0);
  
  // Günün başlangıcından itibaren ara
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const time = MakeTime(dayStart);
  
  let sunrise, sunset;
  
  try {
    const riseResult = SearchRiseSet(Body.Sun, observer, DIRECTION_RISE, time, 1);
    sunrise = riseResult ? riseResult.date : null;
  } catch (e) {
    console.warn('[cosmicUtils] Gün doğumu hesap hatası:', e);
    sunrise = null;
  }
  
  try {
    const setResult = SearchRiseSet(Body.Sun, observer, DIRECTION_SET, time, 1);
    sunset = setResult ? setResult.date : null;
  } catch (e) {
    console.warn('[cosmicUtils] Gün batımı hesap hatası:', e);
    sunset = null;
  }
  
  // Fallback — hesaplanamadıysa makul varsayılan
  if (!sunrise) { sunrise = new Date(date); sunrise.setHours(6, 30, 0, 0); }
  if (!sunset)  { sunset  = new Date(date); sunset.setHours(20, 0, 0, 0); }
  
  const dayLength = sunset - sunrise;
  
  // Bir sonraki gün doğumunu da hesapla (gece uzunluğu için)
  let nextSunrise;
  try {
    const nextDay = new Date(dayStart);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextTime = MakeTime(nextDay);
    const nextRiseResult = SearchRiseSet(Body.Sun, observer, DIRECTION_RISE, nextTime, 1);
    nextSunrise = nextRiseResult ? nextRiseResult.date : null;
  } catch (e) {
    nextSunrise = null;
  }
  if (!nextSunrise) { nextSunrise = new Date(date); nextSunrise.setDate(nextSunrise.getDate() + 1); nextSunrise.setHours(6, 30, 0, 0); }
  
  const nightLength = nextSunrise - sunset;
  
  return { sunrise, sunset, nextSunrise, dayLength, nightLength };
};

// ─── Gezegen Saat Hesaplayıcı (24 Saat — Gündüz + Gece) ─────────────────────
export const PLANET_ORDER = ['Güneş', 'Venüs', 'Merkür', 'Ay', 'Satürn', 'Jüpiter', 'Mars'];
export const DAY_START_PLANET = [0, 3, 6, 2, 5, 1, 4]; // 0=Paz, 1=Pzt...

export function buildFullDaySchedule(cityName) {
  const now = new Date();
  const sunTimes = getSunTimes(cityName, now);
  const { sunrise, sunset, nextSunrise, dayLength, nightLength } = sunTimes;

  const dayHourLen = dayLength / 12;
  const nightHourLen = nightLength / 12;

  const dayOfWeek = now.getDay();
  const startIdx = DAY_START_PLANET[dayOfWeek];

  const hours = [];

  // ─── Gündüz 12 Saati ─────────────────────────────────
  for (let i = 0; i < 12; i++) {
    const planetKey = PLANET_ORDER[(startIdx + i) % 7];
    const start = new Date(sunrise.getTime() + i * dayHourLen);
    const end = new Date(sunrise.getTime() + (i + 1) * dayHourLen);
    const isActive = now >= start && now < end;
    const isPast = now >= end;
    hours.push({ planetKey, start, end, isActive, isPast, isNight: false, hourIndex: i });
  }

  // ─── Gece 12 Saati ───────────────────────────────────
  // Gece saatleri, gündüz bitiminden (12. saat) devam eder
  for (let i = 0; i < 12; i++) {
    const planetKey = PLANET_ORDER[(startIdx + 12 + i) % 7];
    const start = new Date(sunset.getTime() + i * nightHourLen);
    const end = new Date(sunset.getTime() + (i + 1) * nightHourLen);
    const isActive = now >= start && now < end;
    const isPast = now >= end;
    hours.push({ planetKey, start, end, isActive, isPast, isNight: true, hourIndex: 12 + i });
  }

  return { hours, now, sunrise, sunset, nextSunrise, dayHourLen, nightHourLen };
}

export function fmt(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export const MOON_PHASES = [
  { 
    name: 'Yeni Ay', 
    icon: 'new_moon', 
    energy: 'Karanlığın içinden doğan taptaze niyetler; aşkta ve başarıda yeni tohumlar ekme, hayata sıfırdan başlama ve uzun vadeli hayaller için en saf güç.',
    whisper: 'Gökyüzünün en karanlık anı, en parlak başlangıçlara gebedir. Mantığın sesini kıs, ruhunun derinliklerinde filizlenen o saf niyeti duy ve tohumlarını sessizce ek.' 
  },
  { 
    name: 'Hilal', 
    icon: 'waxing_crescent', 
    energy: 'Niyetlerin gerçeğe dönüştüğü o ilk kıvılcım; ilişkilerde beklenen o adımı atma ve büyüme heyecanını cesur bir fırsata çevirme vakti.',
    whisper: 'Büyüme sancıları başlasa da içindeki o küçük ışık artık görünür oldu. İlk adımı atmak için tereddüt etme; evren cesaretini ödüllendirmek için hazır bekliyor.' 
  },
  { 
    name: 'İlk Dördün', 
    icon: 'first_quarter', 
    energy: 'Kozmik bir kararlılık testi; önündeki engelleri aşmak için irade gösterme ve aşkta netleşmeyen durumları artık bir sonuca bağlama döngüsü.',
    whisper: 'Engeller seni durdurmak için değil, ne kadar istediğini kendine kanıtlaman için orada. Esneklik ve disiplini birleştir, yönünü netleştir ve o kritik kararı ver.' 
  },
  { 
    name: 'Büyüyen Ay', 
    icon: 'waxing_gibbous', 
    energy: 'Büyük ödülden önceki son hazırlık; ideallerinde ustalaşma, ilişkilerdeki son pürüzleri giderme ve sabırla gelecek o güzel günü bekleme süreci.',
    whisper: 'Büyük resim neredeyse tamamlandı. Şimdi ayrıntıları cilalama ve sabırla bekleme zamanı. Acele etme, enerjinin olgunlaşması için son birkaç gün.' 
  },
  { 
    name: 'Dolunay', 
    icon: 'full_moon', 
    energy: 'Görkemli bir ışık patlaması; gizli kalmış duyguların fışkırması, beklenen haberlerin ilanı ve aşkta ya tam birleşme ya da nihai bir yüzleşme anı.',
    whisper: 'Gökyüzünde hiçbir şey saklı kalmadı. Çabalarının meyvesini cesurca topla veya sana artık hizmet etmeyen o duyguyu serbest bırak. Aydınlığın içinde gerçeği gör.' 
  },
  { 
    name: 'Küçülen Ay', 
    icon: 'waning_gibbous', 
    energy: 'Kazanılan bilgeliği ve bereketi paylaşma; elde edilen başarıyı kutlama, ilişkideki dersleri anlama ve sahip olduklarını çevrenle bölüşme zamanı.',
    whisper: 'Hasattan aldığın dersleri heybene koy ve dünyaya fısılda. Sahip olduklarını paylaşmak, bereketini katlayacaktır. Bilgeliğini çevrene dağıtma sırası sende.' 
  },
  { 
    name: 'Son Dördün', 
    icon: 'last_quarter', 
    energy: 'Kozmik bir hafifleme ve ayıklama; aşkta ve işte sana artık yük olan her şeyi geride bırakma ve ruhsal bir ferahlama dönemi.',
    whisper: 'Hayatındaki fazlalıkları, eskimiş alışkanlıkları ve artık işlemeyen planları ayıklama vakti. Hafifle ki bir sonraki döngüde daha yükseğe uçabilesin.' 
  },
  { 
    name: 'Balzamik Ay', 
    icon: 'waning_crescent', 
    energy: 'Tam teslimiyet ve içsel arınma; rüyalarla gelen gelecek işaretleri, ilişkilerde sessiz bir kabulleniş ve yeni döngü öncesi en derin huzur anı.',
    whisper: 'Evrenin rahmine geri dönüş. Hiçbir şey yapmama lüksünü kendine tanı. Rüyalarının rehberliğine güven; en derin şifalar sessiz uykularda gerçekleşir.' 
  }
];

export const getMoonPhase = (date = new Date()) => {
  // astronomy-engine returns a solar longitude relative degree from 0-360
  // 0 = New Moon, 90 = First Quarter, 180 = Full Moon, 270 = Last Quarter
  const phaseDegrees = AstroMoonPhase(date);
  
  // Normalize to 0-1 scale used by our MoonPhase component
  const phaseValue = phaseDegrees / 360.0;
  
  // Each of the 8 phases spans ~45 degrees (0.125 value), centered on its peak
  // e.g. New Moon (0) is phaseValue 0 (or 1), index 0
  let index = Math.round(phaseValue * 8) % 8;
  
  return { ...MOON_PHASES[index], value: phaseValue };
};

export const PLANET_INFO = {
  Mercury: {
    label: 'Merkür',
    icon: 'history',
    adviceRetro: 'İletişimde aksaklıklar olabilir, eski konular açılabilir.',
    adviceDirect: 'Zihnin berrak, kararlarını netleştirme zamanı.',
    dos: ['Yedekleme al', 'Eski dostu ara', 'Yavaşla'],
    donts: ['Yeni imza atma', 'Pahalı cihaz alma', 'Fevri konuşma']
  },
  Venus: { label: 'Venüs', icon: 'favorite', adviceRetro: 'Eski aşklar kapını çalabilir.', adviceDirect: 'Uyum zamanı.', dos: ['Kendini sev'], donts: ['Büyük harcama yapma'] },
  Mars: { label: 'Mars', icon: 'bolt', adviceRetro: 'Enerjini sakla.', adviceDirect: 'Harekete geç.', dos: ['Sabırlı ol'], donts: ['Kavgaya girme'] }
};

export const SIGN_INSIGHTS = {
  'Koç': {
    focus: 'Hızlı ve Keskin Zihin',
    oracle: 'Düşünmeden konuşma ve pot kırma riskinin en yüksek olduğu dönem. İletişimde fevri çıkışlar artar; yeni projelere başlamak için harika bir fikir patlaması yaşanırken, ilişkilerde tartışmaları sert bir dille çözme eğilimi öne çıkar.',
    dos: ['Tutkunu ve enerjini doğru kişiye yönlendir', 'Söylemek istediklerini cesur ama zarif bir dille ifade et', 'Aşkta ertelediğin o ilk adımı bugün at'],
    donts: ['Öfkenle ilişkilerini sabote etme', 'Dinlemeden karar verip kestirip atma']
  },
  'Boğa': {
    focus: 'Pratik ve Somut Adımlar',
    oracle: 'Zihnin tamamen finansal güvenliğe ve somut maddiyata odaklandığı zamanlar. Hızlı kararlar almak yerine, her teklifin altını iki kez çizmek, maaş zamlarını konuşmak ve garanti sonuçlar peşinde koşmak isteyeceksin.',
    dos: ['Alma verme dengeni sevgiyle koru', 'Aşkta ve işte sağlam, kalıcı bağlar kur', 'Dünyevi ihtiyaçlarınla ruhsal huzurunu dengele'],
    donts: ['Anlık krizlerde inatçılık yapıp duvar örme', 'Değişime ve yeniliklere direnerek fırsatları kaçırma']
  },
  'İkizler': {
    focus: 'Bilgi Akışı ve Merak',
    oracle: 'Merkür tam gücünde. Bilgi akışı hızlanır, telefonlar susmaz. Aynı anda üç farklı plan yapıp dedikodu ve haber trafiğinin tam ortasında kalabilirsin. Flörtler artar ama kesin bir karar vermek zorlaşır.',
    dos: ['Zihnindeki yorucu kalabalığı sadeleştir', 'Eski flörtlerden gelen mesajları soğukkanlılıkla oku', 'Sahip olduğun harika fikirleri eyleme dönüştür'],
    donts: ['Kararsızlığınla karşındakini oyalama', 'Ani heveslerle tutamayacağın sözler verme']
  },
  'Yengeç': {
    focus: 'Duygusal Bellek',
    oracle: 'Mantığın rafa kalkıp kararların tamamen hisler üzerinden alındığı bir süreç. Eski hikayelerin açılması, nostalji rüzgarları ve geçmişteki kırgınlıkların hesaplaşmalarıyla yoğun bir zihinsel mesai seni bekliyor.',
    dos: ['Geçmişin yüklerini ve kırgınlıkları şefkatle affet', 'Kalbinin sesini korkusuzca dile getir', 'Kendi sınırlarını koruyarak sevmeyi öğren'],
    donts: ['Eski hataları deşip nostalji tuzağına düşme', 'Duygusal manipulasyonlara boyun eğme']
  },
  'Aslan': {
    focus: 'Yaratıcı ve Cesur İfade',
    oracle: 'Sözlerin sahneye çıktığı, ikna kabiliyetinin tepede olduğu dönem. Fikirlerini patron gibi savunur, aşkta iddialı cümleler kurarsın. Ancak dinlemekten çok \'ben\' demeye eğilimli olabilirsin.',
    dos: ['Aşkta ihtişamından değil, samimiyetinden güç al', 'Yaratıcılığını ve ışıltını cesurca sergile', 'İlişkilerinde ego yerine kalbini öne çıkar'],
    donts: ['Sadece ben diyerek partnerini gölgede bırakma', 'Gururun uğruna dürüst bir özrü erteleme']
  },
  'Başak': {
    focus: 'Kusursuz Analiz',
    oracle: 'Hayatını bir Excel tablosuna çevirmek isteyeceğin, aşırı detaycı bir zihin akışı. Sağlık, beslenme rutinleri ve çalışma ortamındaki küçük pürüzler ya da iş arkadaşlarıyla olan diyaloglar ana gündem madden.',
    dos: ['Zihnini biraz susturup sadece hissetmeye odaklan', 'İlişkilerinde şefkati acımasız analizin önüne koy', 'Ruhunu toksik düşünce yüklerinden arındır'],
    donts: ['Ufacık bir hatayı yüzlerce kez kurcalama', 'Sevdiğin insanları mükemmeliyetçilikle yorma']
  },
  'Terazi': {
    focus: 'Denge ve Uyum Arayışı',
    oracle: 'Diplomasi ve ayna dönemi. Kavgaları tatlıya bağlama, hukuki süreçler ve ortaklık antlaşmaları için yılın en iyi zamanı. Yine de karar verirken karşı tarafı fazla düşünmek kararsızlık krizlerini tetikleyebilir.',
    dos: ['Aşkta dengeyi bozmadan zarafetle adımlar at', 'Sanatsal ve ruhsal ilhamların peşinden git', 'Kendi değerini ilişkilerinin merkezine koy'],
    donts: ['Sırf uyum bozulmasın diye itirazlarını yutma', 'Karar alma yükünü sürekli partnerine atma']
  },
  'Akrep': {
    focus: 'Derinlik ve Gizem',
    oracle: 'Söylenmeyeni duyma ve dedektif gibi araştırma zamanı. Yüzeysel konuşmalar biter; gizli mesajlar, kriz yönetimi, borç veya miras mevzuları masada. Sessiz kalıp dinleyenin kazandığı tehlikeli sular.',
    dos: ['Küllerinden doğmak için eski bağlarla vedalaş', 'İlişkilerinde kontrolü bırakıp şeffaflığı seç', 'Sezgilerine güvenerek krizleri ruhsal bir fırsata çevir'],
    donts: ['Aşırı şüphe ve paranoyayla aşkı zehirleme', 'Gizem yaratmak için duvarları gereğinden fazla yükseltme']
  },
  'Yay': {
    focus: 'Vizyon ve Olasılıklar',
    oracle: 'Filtresiz konuşma dönemi. Aşırı iyimser, anlık kararlar alınabilir. Zihin pasaportlara, seyahatlere veya hukuki konulara kayar. Patavatsızlığa ve üstesinden gelemeyeceğin büyük vaatler vermeye dikkat et.',
    dos: ['Aşkına ve hayallerine geniş bir vizyonla bak', 'Ruhunu özgürleştirecek kararları cesurca al', 'Söylemek istediklerini açık ama kırmadan ifade et'],
    donts: ['Zorluk anında aniden kaçma eğilimine yenilme', 'Sonunu düşünmeden kalıcı vaatlerde bulunma']
  },
  'Oğlak': {
    focus: 'Stratejik İnşa',
    oracle: 'Otorite figürleriyle iletişimin arttığı o ağırbaşlı süreç. Patronla toplantılar, zam istemek veya büyük bir alım/satım işlemi için strateji yapma vakti. Duygulara yer yok, tamamen mantıklı ilerleyeceğin günler.',
    dos: ['Duygusal duvarlarını güvendiğin kişiye biraz olsun arala', 'Zirveye yürürken kalbini dışarıda bırakma', 'İlişkilerinde kontrolü zaman zaman akışa bırak'],
    donts: ['Her meseleyi bir mantık çerçevesine sığdırmaya çalışma', 'Hırslarına kapılıp sevdiklerine soğuk davranma']
  },
  'Kova': {
    focus: 'Sınır Tanımayan Yenilik',
    oracle: 'Zihnin teknolojiye, grup çalışmalarına ve geleceğe odaklandığı anlar. Radikal aydınlanmalar yaşayabilirsin ancak ikili ilişkilerde fazlasıyla mantık arayan, soğuk ve mesafeli bir iletişim tarzına geçebilirsin.',
    dos: ['Özgürlüğünü korurken derin bağ kurmayı öğren', 'Geleceğini tamamen kendi sezgilerinle kurgula', 'İçindeki o çılgın enerjiyi ilham olarak paylaş'],
    donts: ['Duygusal kriz anlarında robotlaşıp buz kesme', 'Topluma zıt gitmek uğruna gereksiz inatlaşma']
  },
  'Balık': {
    focus: 'Sezgisel Çözülme',
    oracle: 'Yanlış anlaşılmaların arttığı, randevuların unutulduğu bir süreç. Gündelik işleri organize etmekte zorlansan da; ilhamın, rüyaların ve yaratıcılığın tavan yaptığı büyülü bir iletişim döngüsü.',
    dos: ['Hayallerini ve sevgini gerçeğe taşımak için ilk adımı at', 'Şefkatini ve sezgilerini bir vizyon kalkanı olarak kullan', 'Ruhsal tatmini günlük kaygıların üzerinde tut'],
    donts: ['Gerçeklerden tamamen kopup kendini kurban etme', 'Sınırlarını aşanlara sınırsız müsamaha gösterme']
  }
};

export const SIGN_ELEMENTS = {
  'Koç': 'Ateş', 'Aslan': 'Ateş', 'Yay': 'Ateş',
  'Boğa': 'Toprak', 'Başak': 'Toprak', 'Oğlak': 'Toprak',
  'İkizler': 'Hava', 'Terazi': 'Hava', 'Kova': 'Hava',
  'Yengeç': 'Su', 'Akrep': 'Su', 'Balık': 'Su'
};

export const ELEMENT_RITUALS = {
  'Ateş': {
    'Yeni Ay':      'İçindeki cesareti uyandıran bu yeni döngüde, uzun süredir niyetlendiğin bir adımı karanlıktan aydınlığa çıkarmak isteyebilirsin. Gökyüzü, tutku duyduğun bir konuda ilk adımı atman için rüzgarı arkana veriyor.',
    'Hilal':        'İçinde filizlenen o ilk heyecan, eylemle buluşmak için doğru anı bekliyor. Küçük de olsa bir inisiyatif almak veya yeteneklerini sergilemek, beklediğinden daha parlak bir sürprizle sonuçlanabilir.',
    'İlk Dördün':   'Karşılaştığın küçük engeller seni yıldırmak yerine daha da güçlendiriyor. Bu evrede enerjini dağıtmadan tek ve net bir yöne akıtmak, içindeki o sıcak motivasyonu kalıcı bir başarıya dönüştürebilir.',
    'Büyüyen Ay':   'Sahne her an senin olmak üzere. Hedefine giden yolda son hazırlıklarını ince ince işlemek ve zamanı geldiğinde tüm ihtişamınla adım atmak, arzuladığın sonuca en kusursuz yoldan ulaşmanı sağlayabilir.',
    'Dolunay':      'Bu parlak enerji, emeğinin ve cesaretinin ne kadar görünür olduğunu fark etmeni istiyor. Sonuçların netleştiği bu anlarda, aldığın mesafeyi kendi ışıltınla kutlamak en doğal hakkın.',
    'Küçülen Ay':   'Zaman, ışığını ve enerjini yansıtarak büyüteceğin bir zaman. Kendi tecrübeni ihtiyaç duyan biriyle paylaşmak veya çevrene ilham olmak, ateşinin etrafa kalıcı bir sıcaklık bırakmasını sağlayacaktır.',
    'Son Dördün':   'Yıldızlar bugün sana, zihnini meşgul eden ve artık enerjini aşağı çeken bir konuyu kapatma cesareti sunuyor. Sana ağır gelen o döngüyü gündeminden düşürdüğünde, asıl potansiyelini hatırlayabilirsin.',
    'Balzamik Ay':  'Yeni bir yolculuktan önce duraksamak, ateşin doğasına aykırı gibi görünse de şu an en büyük şifan. Koşuşturmaya kısa bir mola verip iç ormanına çekilmek, yeni döngüye taptaze bir yaratıcılıkla girmeni hazırlıyor.'
  },
  'Toprak': {
    'Yeni Ay':      'Kalıcı ve sağlam bir temel inşa etmek için gökyüzünde çok verimli bir zemin var. Geleceğe dair somut, küçük ama köklü bir niyet tohumu ekmek, yarınların için büyük bir ormanın habercisi olabilir.',
    'Hilal':        'Planlarının toprağın üzerine çıktığı bu an, sabrının mükafatlarını ufak ufak göreceğin zamandır. Detaylara verdiğin o zarif önem, bu süreçte attığın adımların ne kadar değerli ve sağlam olduğunu kanıtlıyor.',
    'İlk Dördün':   'Seçimlerinin sınandığı bu evrede o sarsılmaz duruşun en büyük avantajın. Meselelere pratik bir çözüm üretmek ve kendi bildiğin güvenilir yoldan ilerlemek, seni fazladan yorulmaktan kurtaracaktır.',
    'Büyüyen Ay':   'Kurduğun yapının mükemmelleşmeye yaklaştığı bir dönemdesin. Fazladan bir hamle yapmak yerine, emeğinin yavaş yavaş olgunlaşmasını izlemek ve geldiğin noktanın güzelliğini takdir etmek ruhuna çok iyi gelebilir.',
    'Dolunay':      'Zaman hasat zamanı. Uzun süredir emek verdiğin, sabırla inşa ettiğin o düzenin meyvelerini açıkça görebileceğin bu fazda, yarattığın değerleri şükranla kabullenmek sana yepyeni perspektifler sunabilir.',
    'Küçülen Ay':   'O pratik bilgeliğini ve dünyevi tecrübeni çevrenle paylaşmanın tam sırası. Birine somut bir destek sunmak veya sahip olduklarından cömertçe vermek, toprağının bereketini daha da artıracaktır.',
    'Son Dördün':   'Gökyüzü sana bugün, köklerini hiç sarsmadan sadece kurumuş yaprakları dökme şansı veriyor. Zamanını veya enerjini tüketen yorucu bir rutini usulca ardında bırakmak, omuzlarından büyük bir yük kaldırabilir.',
    'Balzamik Ay':  'Dinlenmek, durmak ve toprağı nadasa bırakmak... Yeni kararlar ve vizyonlar öncesinde, mevcut durumu sevgiyle koruyarak içindeki o huzurlu sükunete dönmek, yaklaşan taze döngü için en bilgece hamle.'
  },
  'Hava': {
    'Yeni Ay':      'Uçsuz bucaksız bir ihtimaller denizi ve yepyeni fikirler... Zihninde beliren o taze ve belki biraz sıra dışı düşünceyi bugün serbest bırakmak, uzun soluklu harika bir vizyonun ilk esintisi olabilir.',
    'Hilal':        'İletişim rüzgarları senin lehine esiyor. Zihninde tartıp durduğun bir konuyu kelimelere dökmek, aradığın o doğru frekansı yakalamanı ve çevrenle arandaki eksik köprüyü inşa etmeni sağlayabilir.',
    'İlk Dördün':   'Çok fazla ihtimal arasında gidip gelen zihnin, bugün net bir yön belirlemeni talep ediyor. Sayısız seçeneği eleyip tek bir hedefe odaklanmak, zekanı en verimli şekilde kullanmanın kapılarını açabilir.',
    'Büyüyen Ay':   'Zihnindeki bilgiler yavaş yavaş birleşiyor ve büyük resmi oluşturuyor. Fikirlerini tamamen dışa vurmadan önce, onları demlendirmek ve eksik kalan küçük parçaları gözlemleyerek tamamlamak daha doyurucu olacaktır.',
    'Dolunay':      'Sözlerin, düşüncelerin ve sosyal bağlantıların bugün adeta spot ışıkları altında. İçinden geçenlerin açıkça yankılandığı bu parlak evrede, netliğin ve dürüstlüğün getirdiği özgürlüğün tadını çıkarabilirsin.',
    'Küçülen Ay':   'Entelektüel birikimini ve aydınlık vizyonunu başkalarıyla paylaşma vakti. Bakış açına ihtiyacı olan birine fikir vermek, zihninin o güzel akışını kolektif bir ilhama dönüştürebilir.',
    'Son Dördün':   'Zihnini bulandıran veya sadece gereksiz gürültü yaratan döngülerden uzaklaşma fırsatın var. İletişimi zorlaştıran frekansları nazikçe sessize almak, zihnine aradığı o berrak molayı verecektir.',
    'Balzamik Ay':  'Zihnine sürekli akan o yoğun bilgi trafiğini yavaşlatmak, derin bir dinlenmeye çekilmek sana çok iyi gelecek. Gündemden kısa bir süreliğine uzaklaşmak, yeni ve çok daha parlak fikirler için muazzam bir boşluk yaratıyor.'
  },
  'Su': {
    'Yeni Ay':      'Sezgilerinin en temiz ve berrak aktığı andasın. İç dünyandan gelen o hafif ama ısrarlı hissi dinlemek ve mantığın ötesine geçen bir niyete kalp açmak, ruhunun en çok ihtiyaç duyduğu yenilenme olabilir.',
    'Hilal':        'Duygularının yavaş yavaş belirli bir forma girdiği bu evrede, kalbinde taşıdıklarını güvendiğin birine yansıtmak isteyebilirsin. Şefkatin, bu minik adımla birlikte giderek daha güçlü ve anlamlı hale gelecek.',
    'İlk Dördün':   'Mantığın ve hislerin arasında ufak bir gelgit yaşıyor olabilirsin. Duygusal bir sel anında karar vermek yerine suların durulmasını beklemek, suyun o dingin bilgeliğiyle en doğru sonuca ulaşmanı sağlayabilir.',
    'Büyüyen Ay':   'İçindeki o yoğun duygusal havuz, anlamlı bir şeye dönüşmek için dolup taşıyor. Sevdiğin birine ya da manevi bir alana ruhunu katmak, hislerinin yavaş yavaş büyüleyici bir bağ haline gelmesine yardımcı olacaktır.',
    'Dolunay':      'Suların en yüksek seviyede kabardığı bu an, en derinlerdeki duygularının yüzeye çıkışıdır. Bu yoğunluğu bastırmak yerine akmasına izin vermek ve kalbindeki o manzarayla yüzleşmek, seni inanılmaz derecede özgürleştirebilir.',
    'Küçülen Ay':   'Sahip olduğun o sonsuz empatik gücü ve anlayışı, dinlenilmeye ihtiyacı olan biriyle paylaşma zamanı. Birini gerçekten derinden dinlemek, suyun iyileştirici enerjisini dünyaya yaymak gibidir.',
    'Son Dördün':   'Sana görünmez bir ağırlık yapan, ruhunu sömüren duygu veya düşünce kalıplarını serbest bırakma cesaretini gökyüzü bugün sana sunuyor. O bağı nefretle koparmak yerine sevgiyle akışa teslim etmek, en derin şifan olabilir.',
    'Balzamik Ay':  'Tamamen içe dönme, okyanusun en loş ve sessiz sularında dinlenme zamanı. Rüyalarının veya sezgilerinin sana rehberlik edeceği bu sessiz süreçte, sadece var olmak ruhunu yepyeni bir doğum için hazırlayacak.'
  }
};

// ============================================================
// Merkür Retro İçerikleri — Her Burç İçin Özel Oracle + Manifesto
// ============================================================

export const SHADOW_ALERT = {
  focus: 'Merkür Yavaşlıyor',
  text: 'Önümüzdeki birkaç hafta içinde iletişim, teknoloji ve kararlar alanında ince aksaklıklar başlayabilir. Acele etme — önemli adımlarını şimdi at, bekleyebilecekleri beklet.'
};

export const POST_RETRO_TEXT = {
  focus: 'Gökyüzü Aydınlandı',
  text: 'Merkür tekrar ileri gidiyor. Haftalardır birikmiş o iletişim yükü dağılıyor. Retroda donduğun konuları artık çözebilirsin — ertelediğin bir konuşmayı yap, bekleyen bir kararı ver.'
};

export const RETRO_SIGN_INSIGHTS = {
  'Koç': {
    focus: 'Ani Tepkiler, Yarım Kalan Sözler',
    oracle: 'İletişimin en patlayıcı olduğu dönem. Sevdiğin biriyle kurduğun cümleler kolayca yanlış anlaşılır; sert bir mesaj atmadan önce bir nefes al. Aşkta ve işte aceleci kararlar vererek değil, bekleyerek kazan.',
    dos: ['Önemli mesajları göndermeden önce bir kez daha oku', 'Yarım kalan bir tartışmayı barışla kapat', 'Dinle, hemen yanıt verme'],
    donts: ['Sinirle ilişki veya iş kararı alma', 'Yeni bir ilişkiye hızla girme', 'Anında et iş tekliflerine evet deme']
  },
  'Boğa': {
    focus: 'Değerler Yeniden Tartılıyor',
    oracle: 'Para değil, değer meselesi. Bir ilişkinin seni gerçekten besleyip beslemediğini, birinin sana ne kadar yer ayırdığını doğal olarak sorgulamak isteyeceksin. Doğru gözlem — ama karar vermek için acele etme.',
    dos: ['Bir ilişkideki dengeyi sessizce gözlemle', 'Enerjini nereye harcadığına dürüstçe bak', 'Bedeni dinle, dinlenmek ihtiyacınsa ver'],
    donts: ['Anlık kırgınlıkla köprüleri yakma', 'İlişkiyi salt maddi kriterlerle ölçme', 'İstemediğin bir ortaklığa bu dönemde girme']
  },
  'İkizler': {
    focus: 'Kelimeler Kafada Dolanıyor',
    oracle: 'Merkür kendi evinde geri gidiyor; karışıklık en yoğun halinde. Mesajlar yanlış anlaşılır, söylemek istediğini tam ifade edemezsin. Eski flörtlerden mesaj gelebilir — ilginç ama acele etme.',
    dos: ['Önemli konuşmaları yüz yüze yap', 'Yazdığın mesajı kaydet, bir gün sonra gönder', 'Eski bir arkadaşınla yeniden bağ kur'],
    donts: ['Sosyal medyada tartışmalara girme', 'Birinin söylediğini doğrudan alma, sor', 'Yazılı anlaşmalara bu dönemde imza atma']
  },
  'Yengeç': {
    focus: 'Geçmiş Yüzeye Çıkıyor',
    oracle: 'Eski kırgınlıklar, yarım kalan duygusal konuşmalar ve belki ayrıldığın biri kapını çalabilir. Duygular bu dönemde çok yoğun ama kafa bulanık. Her his gerçektir — ama her karar doğru değildir.',
    dos: ['Aile içindeki gerilimi sabırla ele al', 'Hissettiklerini önce kendin için yaz, sonra paylaş', 'Eski bir yaranı şefkatle işle'],
    donts: ['Nostaljinin peşinden gidip zamanın döndüğünü sanma', 'Birinin uzaklaştığını hissedince hemen kapanma', 'Geçmişteki kavgaları bugün yeniden açma']
  },
  'Aslan': {
    focus: 'Söylenmemiş Şeyler Birikmiş',
    oracle: 'Görülmek istiyorsun ama karşılık gelmiyor. Bir ilişkide veya işte değer görmediğini hissedebilirsin. Bu his gerçek olabilir — ama bunu tartışmak için olmak doğru an değil.',
    dos: ['İhtiyacını net ve sakin bir dille ifade et', 'Kendini takdir etmek için dışarıdan onay bekleme', 'Ertelediğin bir özrü bugün dile getir'],
    donts: ['Drama yaratarak dikkat çekmeye çalışma', 'Seni ciddiye almayanlara enerji harcama', 'Gurur uğruna özür dilemeyi öteleme']
  },
  'Başak': {
    focus: 'Analiz Değil, Sezgi Zamanı',
    oracle: 'Her şeyi mantıkla çözmeye çalışacaksın ama denklem tutmayacak. Bir ilişkiyi ya da durumu aşırı analiz etmek yoracak — şu an zihin değil sezgi daha güvenilir.',
    dos: ['Detaycılığını bir kenara bırak, büyük resme bak', 'Geçici düzensizliği kabul et', 'Bedeninin ve sezgilerinin sinyallerini dinle'],
    donts: ['Her şeyi mükemmelleştirme baskısına girme', 'Bir ilişkiyi yüzlerce kez analiz edip karar verememe', 'Eleştirilerinle başkasını yıpratma']
  },
  'Terazi': {
    focus: 'Karar Verme, Sadece Gözlemle',
    oracle: 'İki taraf arasında sıkışırsın, dengeyi korumak güçleşir. Bir ilişkide veya ortaklıkta belirsizlik derinleşebilir. Şu an karar için doğru zaman değil — ama gördüğün her şeyi not al.',
    dos: ['Adaletsiz hissettiren durumu ses çıkarmadan gözlemle', 'Bir ilişkide ne istediğini kendi içinde netleştir', 'Retro bitmeden büyük bir karar verme'],
    donts: ['Herkesin görüşünü alıp kafanı karıştırma', 'Uyum bozulmasın diye itirazını yutma', 'Hukuki ya da yazılı anlaşmalara bu dönemde imza atma']
  },
  'Akrep': {
    focus: 'Derinler Yüzeye Çıkıyor',
    oracle: 'Sakladığın bir şey ya da birinin senden sakladığı bir şey gün yüzüne çıkabilir. İlişkide güven meselesi, bastırılmış duygular, eski kırgınlıklar bu dönemde kendini gösterir. Yüzleşmekten kaçma.',
    dos: ['Uzun süredir taşıdığın bir gerçeği paylaş', 'Güvenmediğin birine neden güvenmediğini anlamaya çalış', 'Eski bir ilişkiyi zihninden gerçekten serbest bırak'],
    donts: ['Şüphe ve paranoyayla ilişkiyi zehirleme', 'Kafanda kurgular yaratıp tepki verme', 'Sırf gizem olsun diye duvarları yükseltme']
  },
  'Yay': {
    focus: 'Söz Uçar, Verilen Vaatler Kalmış',
    oracle: 'Aceleci vaatler, yarım kalan planlar bu dönemde seni sıkıştırabilir. Aşkta "her şey çözülür" diye geçiştirdiğin konular artık beklemek istemiyor. Yüksek sesle konuşmadan önce düşün.',
    dos: ['Verdiğin sözleri teker teker gözden geçir', 'Önemli bir problemi gerçekten dinleyerek çözmeye çalış', 'Bitiremediğin bir şeyi bugün bitir'],
    donts: ['Sıkıştığında kaçmaya çalışma', 'Tutamayacağın büyük vaatler verme', 'Anlık özgürlük hevesiyle ilişkiyi tehlikeye atma']
  },
  'Oğlak': {
    focus: 'Planlar Aksıyor, Sabır Önemli',
    oracle: 'İş ve sorumluluklar alanında aksaklıklar çıkabilir; kararlar gecilebilir, planlar değişebilir. Otorite figürleriyle iletişimde dikkatli ol. Hem profesyonel hem insan kal.',
    dos: ['Yazışmalarını titiz ve net tut', 'Bir projeyi veya ilişkiyi sıfırdan gözden geçir', 'Yakınlarını işin stresinden korumaya çalış'],
    donts: ['Soğuk ve mesafeli davranarak sevdiklerini uzaklaştırma', 'Geciktirilen bir karar için panikle yanlış adım atma', 'Önemli iş görüşmelerini bu döneme denk getirme']
  },
  'Kova': {
    focus: 'Dijital Karışıklık, İnsan Bağlantısı',
    oracle: 'Grup dinamikleri bozulur, dijital iletişim takılır. Sosyal ortamlarda yanlış anlaşılma riski yüksek. Bir ilişkide duygusal mesafe hissedebilirsin — ama bu dönemin geçici bir etkisi olabilir.',
    dos: ['Yüz yüze bağlantıya öncelik ver', 'Bir topluluğa ya da ilişkiye daha fazla mevcudiyet getir', 'Kendi sesini kaybetme ama başkalarını dinle'],
    donts: ['Sosyal medyada tartışma alanlarına girme', 'Grup içindeki anlaşmazlıkları körükleme', 'İlişkide robotlaşıp buz kesme']
  },
  'Balık': {
    focus: 'Sis, Rüyalar ve Kaybolmuşluk',
    oracle: 'Hiçbir şey net görünmüyor. Kararlar erteleniyor, mesajlar kayboluyor, ne söylemek istediğini bulamıyorsun. Bu dönemde sezgin mantığından güçlü, rüyaların senden daha net.',
    dos: ['Hissettiklerini yazmaya başla, kafan zamanla açılır', 'Bir ilişkide ne hissettiğini yargılamadan kabul et', 'Yanıtı bilmediğinde bunu dürüstçe söyle'],
    donts: ['Belirsizlikte birini askıda bırakma', 'Anlık ilhamla kalıcı bir karar verme', 'Gerçeklerden tamamen kopup kendini kurban etme']
  }
};


// ============================================================
// ✅ Aşama 2: Dinamik Astronomi Motor​ - Tüm hardcode array'ler silindi.
// Merkür'ün anlık pozisyonu, retro tarihleri ve gölge evreleri
// artık astronomy-engine'den canlı hesaplanır. Sonsuza kadar çalışır.
// ============================================================

/** Herhangi bir gezegenin gerçek geocentrik (Dünya merkezli) ekliptik boylamını 0-360° olarak döndürür.
 * GeoVector + Ecliptic kombinasyonu: heliocentric EclipticLongitude'dan farklı olarak
 * Merkür gibi iç gezegenler için doğru Zodyak pozisyonu verir. */
const getLongitudeDeg = (body, date) => {
  try {
    const time = MakeTime(date);
    const gv = GeoVector(body, time, true); // true = aberrasyon düzeltmesi
    const ec = Ecliptic(gv);
    return ((ec.elon % 360) + 360) % 360; // 0-360° normalize
  } catch (e) {
    console.warn('[cosmicUtils] getLongitudeDeg hatası:', e);
    return 0;
  }
};

/** Ekliptik boylam (0-360°) → Türkçe Zodyak burcu adı */
const ZODIAC_NAMES = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç',
  'Aslan', 'Başak', 'Terazi', 'Akrep',
  'Yay', 'Oğlak', 'Kova', 'Balık'
];
const getZodiacSign = (longitude) => ZODIAC_NAMES[Math.floor(longitude / 30) % 12];

/** Merkür'ün anlık Türkçe burç adını döndürür */
const getMercurySign = (date) => getZodiacSign(getLongitudeDeg(Body.Mercury, date));

/**
 * Merkür'ün şu an retroda olup olmadığını, gölge evrelerini ve
 * ilerleme yüzdesini dinamik astronomi hesabıyla bulur.
 *
 * Yöntem: Merkür'ün boylamını dhüş gününe göre karşılaştırır.
 * Azalan boylam = geri hareket (retro). Yavaşlayan boylam = gölge.
 */
const findMercuryPhase = (date) => {
  const now = date.getTime();
  const MS = 86400000;

  const lon0 = getLongitudeDeg(Body.Mercury, new Date(now - MS));
  const lon1 = getLongitudeDeg(Body.Mercury, date);
  const lon2 = getLongitudeDeg(Body.Mercury, new Date(now + MS));

  // Modüler açı delta (360° dönüş noktasını aşar)
  const angDiff = (a, b) => { let d = b - a; if (d > 180) d -= 360; if (d < -180) d += 360; return d; };

  const d0 = angDiff(lon0, lon1);
  const d1 = angDiff(lon1, lon2);
  const isRetro = d0 < 0 && d1 < 0;
  const isShadow = !isRetro && (Math.abs(d0) < 0.15 || Math.abs(d1) < 0.15);

  let daysUntilEnd = 0;
  const RETRO_DURATION_MS = 22 * MS;
  let progress = 30;
  let targetDate = null;

  if (isRetro) {
    // Retro baş/bitiş tespiti: günlük adımlarla tarama
    let scanStart = now;
    for (let t = now - MS; t > now - RETRO_DURATION_MS; t -= MS) {
      const la = getLongitudeDeg(Body.Mercury, new Date(t - MS));
      const lb = getLongitudeDeg(Body.Mercury, new Date(t));
      if (angDiff(la, lb) >= 0) { scanStart = t; break; }
    }
    let scanEnd = now;
    for (let t = now + MS; t < now + RETRO_DURATION_MS; t += MS) {
      const la = getLongitudeDeg(Body.Mercury, new Date(t - MS));
      const lb = getLongitudeDeg(Body.Mercury, new Date(t));
      if (angDiff(la, lb) >= 0) { scanEnd = t; break; }
    }
    targetDate = scanEnd;
    const total = scanEnd - scanStart;
    progress = total > 0 ? ((now - scanStart) / total) * 100 : 50;
    daysUntilEnd = Math.floor((scanEnd - now) / MS);
  } else if (isShadow) {
    // Gölge fazı sonu: ne zaman retro başlıyor?
    let shadowEnd = now;
    for (let t = now + MS; t < now + 25 * MS; t += MS) {
      const la = getLongitudeDeg(Body.Mercury, new Date(t - MS));
      const lb = getLongitudeDeg(Body.Mercury, new Date(t));
      if (angDiff(la, lb) < 0) { shadowEnd = t; break; }
    }
    targetDate = shadowEnd;
    daysUntilEnd = Math.floor((shadowEnd - now) / MS);
    progress = 85;
  }

  // Sonraki retroya kaç gün (Direct modu için): ileriye doğru günlük tarama
  let daysToRetro = 0;
  if (!isRetro) {
    for (let t = now + MS; t < now + 200 * MS; t += MS) {
      const la = getLongitudeDeg(Body.Mercury, new Date(t - MS));
      const lb = getLongitudeDeg(Body.Mercury, new Date(t));
      if (angDiff(la, lb) < 0) {
        daysToRetro = Math.floor((t - now) / MS);
        break;
      }
    }
  }

  return {
    isRetro,
    isShadow: isShadow && !isRetro,
    phaseText: isRetro ? 'RETROGRADE' : isShadow ? 'GÖLGE' : 'DIRECT',
    progress: Math.min(100, Math.max(0, progress)),
    targetDate,
    daysToRetro,
    daysUntilEnd
  };
};

/**
 * Merkür'ün bir sonraki burç geçiş tarihini (timestamp ms) bulur.
 * 1 günlük adımlarla, ardından 1 saatlik adımlarla hassaslaştırır.
 */
const findMercuryNextSignDate = (date) => {
  const currentSign = getMercurySign(date);
  const nowMs = date.getTime();
  const MS = 86400000;
  for (let t = nowMs + MS; t < nowMs + 90 * MS; t += MS) {
    if (getMercurySign(new Date(t)) !== currentSign) {
      for (let h = t - MS; h < t; h += 3600000) {
        if (getMercurySign(new Date(h)) !== currentSign) return h;
      }
      return t;
    }
  }
  return null;
};



import { getDirective } from './directives';

export const getPlanetStatus = (planetName, date = new Date(), userZodiac = null) => {
  const moon = getMoonPhase(date);

  let currentSign = '';
  let nextSign = '';
  let nextSignDate = null;
  let isRetro = false;
  let isShadow = false;
  let progress = 30;
  let daysToRetro = 0;
  let daysUntilEnd = 0;
  let currentPhase = 'DIRECT';

  if (planetName === 'Mercury') {
    currentSign = getMercurySign(date);

    const mercuryPhase = findMercuryPhase(date);
    isRetro = mercuryPhase.isRetro;
    isShadow = mercuryPhase.isShadow;
    progress = mercuryPhase.progress;
    daysToRetro = mercuryPhase.daysToRetro;
    daysUntilEnd = mercuryPhase.daysUntilEnd || 0;
    currentPhase = mercuryPhase.phaseText;

    const nextSignTime = findMercuryNextSignDate(date);
    if (nextSignTime) {
      nextSignDate = nextSignTime;
      nextSign = getMercurySign(new Date(nextSignTime + 3600000));
    }
  } else {
    // Venüs ve Mars: canlı burç tespiti
    const lon = getLongitudeDeg(Body[planetName], date);
    currentSign = getZodiacSign(lon);
  }

  const info = PLANET_INFO[planetName];

  // Retro veya Direct'e göre doğru içeriği seç
  const activeInsight = isRetro
    ? (RETRO_SIGN_INSIGHTS[currentSign] || SIGN_INSIGHTS[currentSign] || { focus: '', oracle: '', dos: [], donts: [] })
    : (SIGN_INSIGHTS[currentSign] || { focus: '', oracle: '', dos: [], donts: [] });

  const finalDos = activeInsight.dos || [];
  const finalDonts = activeInsight.donts || [];

  // Kullanıcı burcuna göre kişisel manifesto
  const userSignInfo = userZodiac
    ? (isRetro
        ? (RETRO_SIGN_INSIGHTS[userZodiac] || SIGN_INSIGHTS[userZodiac] || null)
        : (SIGN_INSIGHTS[userZodiac] || null))
    : null;
  const userDos = userSignInfo ? userSignInfo.dos : finalDos;
  const userDonts = userSignInfo ? userSignInfo.donts : finalDonts;

  // Direktif ve ritüel
  const cosmicDirective = getDirective(currentPhase, currentSign, moon.name, userZodiac);
  const element = SIGN_ELEMENTS[userZodiac] || null;
  const ritual = element && ELEMENT_RITUALS[element]
    ? (ELEMENT_RITUALS[element][moon.name] || 'Gökyüzü sana bugün iç sesini dinlemeni ve akışa bırakmanı fısıldıyor.')
    : 'Gökyüzü sana bugün iç sesini dinlemeni ve akışa bırakmanı fısıldıyor.';

  return {
    ...info,
    phaseText: currentPhase,
    isRetro,
    isShadow,
    currentSign,
    signInsight: activeInsight,
    nextSign,
    nextSignDate,
    daysToRetro,
    daysUntilEnd,
    progress: Math.min(100, Math.max(0, progress)),
    advice: isRetro ? info.adviceRetro : info.adviceDirect,
    dos: finalDos,
    donts: finalDonts,
    userDos,
    userDonts,
    cosmicDirective,
    element,
    ritual,
    shadowAlert: SHADOW_ALERT,
    postRetroText: POST_RETRO_TEXT
  };
};

export const calculateCountdown = (targetTime) => {
  if (!targetTime) return null;
  const now = new Date().getTime();
  const diff = targetTime - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
};
