// ═══════════════════════════════════════════════════════════════
//  CHART NARRATIVE ENGINE — Yerel Astrolog Motoru
//  API kullanmadan, harita verisinden benzersiz yorumlar üretir.
// ═══════════════════════════════════════════════════════════════

import { calculateElements, calculateModality, calculatePolarity } from './astrologyEngine';
import { ASTRO_DICTIONARY, PLANET_DESCRIPTIONS, HOUSE_DESCRIPTIONS } from './astrologyDictionary';

// ─── ELEMENT MAPPING ──────────────────────────────────────────
const SIGN_TO_ELEMENT = {
  'Koç': 'Ateş', 'Aslan': 'Ateş', 'Yay': 'Ateş',
  'Boğa': 'Toprak', 'Başak': 'Toprak', 'Oğlak': 'Toprak',
  'İkizler': 'Hava', 'Terazi': 'Hava', 'Kova': 'Hava',
  'Yengeç': 'Su', 'Akrep': 'Su', 'Balık': 'Su'
};

const PLANET_KEYS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

// ═══════════════════════════════════════════════════════════════
//  ADIM 1: HARITA DNA'SI — Pattern Detection
// ═══════════════════════════════════════════════════════════════

export function analyzeChartDNA(chart) {
  if (!chart?.sun) return null;

  const elements = calculateElements(chart);
  const modality = calculateModality(chart);
  const polarity = calculatePolarity(chart);

  // --- Dominant & weakest element ---
  const dominantElement = elements[0];
  const weakestElement = elements[elements.length - 1];

  // --- Dominant modality ---
  const dominantModality = modality[0];

  // --- Stellium detection (3+ planets in same sign) ---
  const signCounts = {};
  PLANET_KEYS.forEach(key => {
    const p = chart[key];
    if (p?.name) {
      if (!signCounts[p.name]) signCounts[p.name] = [];
      signCounts[p.name].push(key);
    }
  });
  const stelliums = Object.entries(signCounts)
    .filter(([, planets]) => planets.length >= 3)
    .map(([sign, planets]) => ({ sign, planets, count: planets.length }));

  // --- Retrograde analysis ---
  const retroPlanets = PLANET_KEYS.filter(key => chart[key]?.retrograde);
  const retroCount = retroPlanets.length;

  // --- Sun-Moon element relationship ---
  const sunElement = SIGN_TO_ELEMENT[chart.sun?.name];
  const moonElement = SIGN_TO_ELEMENT[chart.moon?.name];
  const sunMoonConflict = sunElement !== moonElement;
  const sunMoonSame = sunElement === moonElement;

  // --- Venus-Mars element relationship ---
  const venusElement = SIGN_TO_ELEMENT[chart.venus?.name];
  const marsElement = SIGN_TO_ELEMENT[chart.mars?.name];
  const venusMarsConflict = venusElement !== marsElement;
  const venusMarsSame = venusElement === marsElement;

  // --- ASC-Moon element relationship ---
  let ascMoonConflict = false;
  let ascElement = null;
  if (chart.ascendant?.name) {
    ascElement = SIGN_TO_ELEMENT[chart.ascendant.name];
    const moonEl = SIGN_TO_ELEMENT[chart.moon?.name];
    ascMoonConflict = ascElement !== moonEl;
  }

  return {
    elements,
    modality,
    polarity,
    dominantElement,
    weakestElement,
    dominantModality,
    stelliums,
    retroCount,
    retroPlanets,
    sunElement,
    moonElement,
    sunMoonConflict,
    sunMoonSame,
    venusElement,
    marsElement,
    venusMarsConflict,
    venusMarsSame,
    ascElement,
    ascMoonConflict,
    hasBirthTime: chart.hasBirthTime,
  };
}


// ═══════════════════════════════════════════════════════════════
//  SENTEZ ŞABLONLARI — Güneş × Ay Element Kombinasyonları
// ═══════════════════════════════════════════════════════════════

const SUN_MOON_SYNTHESIS = {
  'Ateş-Ateş': 'Hem dışarıda hem içeride alev alev yanıyorsun. {sunSign} güneşin cesaret verirken, {moonSign} ayın da duygularını aynı şiddetle yaşatıyor. Frenlerin yok denecek kadar az — bu seni ya büyük işler başaran bir öncü yapar, ya da kendini tüketen bir ateş topuna dönüştürür.',
  'Ateş-Toprak': 'İçinde iki farklı ritim var: {sunSign} güneşin hızla harekete geçmek isterken, {moonSign} ayın "dur, planla, emin ol" diyor. Bu gerilim seni yavaşlattığında sinirlenirsin ama aslında tam da bu fren, vizyonlarını gerçeğe dönüştüren mucize.',
  'Ateş-Hava': 'Zihnin de yüreğin de hız sever. {sunSign} güneşinin cesaretine {moonSign} ayının entelektüel rüzgarı eklenince, ortaya hem düşünen hem yapan bir insan çıkıyor. Tehlike şu: bazen o kadar hızlı akarsın ki, durup hissetmeyi unutabilirsin.',
  'Ateş-Su': 'Dışarıdan ateşten bir savaşçı, içeride okyanusun dibinde bir şifacı. {sunSign} güneşin dünyaya meydan okurken, {moonSign} ayın gizlice yaraları sarıyor. İnsanlar senin ne kadar derin hissettiğini asla tahmin edemez — sen bunu bir güç olarak kullanıyorsun.',

  'Toprak-Ateş': 'Ayakların yerde ama gözlerin zirvedeki bayrağa kilitlenmiş. {sunSign} güneşin sana sabır ve disiplin verirken, {moonSign} ayın içeride sabırsızca "hadi artık başla" diye kükrüyor. İçindeki bu ateşi doğru zamanda serbest bıraktığında durdurulamaz olursun.',
  'Toprak-Toprak': 'Köklerinden dallarına kadar sağlam bir çınarsın. {sunSign} güneşin de {moonSign} ayın da aynı dilden konuşuyor: güvenlik, kalıcılık ve somut sonuçlar. Ancak bu kadar sağlamlık bazen katılığa dönüşebilir — değişime direnç senin en büyük sınavın.',
  'Toprak-Hava': '{sunSign} güneşin elle tutulur sonuçlar isterken, {moonSign} ayın sürekli yeni fikirler, yeni senaryolar, yeni ihtimaller üretir. Bu kombinasyon seni pratik bir vizyoner yapabilir — ama önce o düşünce fırtınasını bir kağıda dökmeni bekliyor.',
  'Toprak-Su': 'Dışarıdan sarsılmaz bir kale gibi görünürsün ama {moonSign} ayının altında duygularının okyanusu çalkalanıyor. {sunSign} güneşin "durumu kontrol altında tut" derken, iç dünyan "hisset ve bırak" diye fısıldıyor. Bu ikisini barıştırdığında hem güçlü hem şefkatli bir insana dönüşürsün.',

  'Hava-Ateş': 'Zihnin rüzgar gibi eser, yüreğin ateş gibi yanar. {sunSign} güneşin dünyayı analiz ederken, {moonSign} ayın "analiz etmeyi bırak, hisset ve atıl" diyor. Bu kombinasyon sana hem strateji hem cesaret veriyor — nadir bir armağan.',
  'Hava-Toprak': '{sunSign} güneşin fikirlerin dünyasında uçarken, {moonSign} ayın seni nazikçe yere indiriyor. Rüyaların büyük ama duygusal güvenliğin somut, elle tutulur şeylere bağlı. Bu çelişki seni gerçekçi bir hayalperest yapıyor.',
  'Hava-Hava': 'Zihnin hiç durmayan bir rüzgar türbini. {sunSign} güneşin de {moonSign} ayın da düşünce, iletişim ve sosyal bağlantılarla besleniyor. Parlak ve çok yönlüsün ama tehlike şu: her şeyi kafanda yaşayıp kalbini ihmal edebilirsin.',
  'Hava-Su': 'Zihnin gökyüzünde süzülürken kalbin okyanusun dibine dalıyor. {sunSign} güneşin mantıkla yaklaşmak isterken, {moonSign} ayın her şeyi derinden hissettiriyor. Bu ikili seni hem anlayan hem hisseden nadir insanlardan biri yapıyor — ama iç dünyandaki bu gel-git bazen yorucu olabilir.',

  'Su-Ateş': 'İçinde bir volkanın üzerinde oturan bir göl var. {sunSign} güneşin derin, sezgisel ve empatik ama {moonSign} ayın altında sabırsız, tutkulu bir alev yanıyor. İnsanlar senin o sakin yüzeyinin altında ne kadar şiddetli bir enerji taşıdığını bilmez.',
  'Su-Toprak': 'Duygularının derinliği ile pratik zekanın birleşimi seni olağanüstü sezgisel yapıyor. {sunSign} güneşin hisseder, {moonSign} ayın somutlaştırır. Bir insanın ne düşündüğünü, ne hissettiğini adeta kokusundan anlarsın.',
  'Su-Hava': '{sunSign} güneşin duygularla düşünürken, {moonSign} ayın mantıkla hissetmeye çalışıyor. İçinde sürekli bir tercüme süreci dönüyor — hislerin kelimelere, kelimelerin hislere. Bu seni hem sanatçı hem analist yapabilir.',
  'Su-Su': 'Duygusal derinliğin sınır tanımıyor. {sunSign} güneşin de {moonSign} ayın da aynı okyanusta yüzüyor — sezgilerin, empatik gücün ve hayal dünyan inanılmaz zengin. Ama dikkat: başkalarının acılarını kendi acın gibi taşıma eğilimin seni tüketebilir.',
};


// ═══════════════════════════════════════════════════════════════
//  VENÜS × MARS Element Sentezleri (Aşk DNA'sı)
// ═══════════════════════════════════════════════════════════════

const VENUS_MARS_SYNTHESIS = {
  'Ateş-Ateş': 'Aşkta ve tutkuda freni olmayan bir enerjisin. Hem sevme biçimin hem arzu tarzın alev alev — ilişkilerin ya büyük bir yangın ya da kısa ama unutulmaz bir patlama olur.',
  'Ateş-Toprak': 'Sevme tarzın hızlı ve tutkulu ama arzu ettiğin şey aslında kalıcılık ve güven. Bu çelişki seni başta ateşli, zamanla sadık bir partnere dönüştürür.',
  'Ateş-Hava': 'Flörtöz ve heyecan arayan bir aşk enerjin var. Hem tutkuyla hem zihinsel uyumla beslenirsin — seni çekecek birinin hem zeki hem cesur olması şart.',
  'Ateş-Su': 'Aşkta bir elinde kılıç, diğerinde şiir var. Dışarıda ateşli ve avcı, içeride derin ve kırılgansın. İlişkilerinde bu ikiliği dengelemeyi öğrendiğinde eşsiz bir partner olursun.',

  'Toprak-Ateş': 'Yavaş ısınırsın ama bir kez alevlendin mi o ateş kolay sönmez. Aşkta sadakat ve somut adımlar istersin ama arzu tarzın sabırsız ve yoğundur.',
  'Toprak-Toprak': 'Aşkta ve tutkuda kararlı, sabırlı ve sonuna kadar sadık bir yapın var. İlişkilerini bir bina gibi inşa edersin — temel sağlam olmazsa üst katları kurmazsın.',
  'Toprak-Hava': 'Sevdiğinde güvenilir ve somut adımlar atarsın ama arzu ettiğin şey zihinsel bağ ve özgürlük. Hem bağlanmak hem özgür kalmak istersin — bu dengeyi bulmak senin ilişki sınavın.',
  'Toprak-Su': 'Aşkta sessiz ama derin bir akış var sende. Dışarıdan sakin ve kontrollü görünürsün ama içeride duygusal bir okyanus taşırsın. Güvendiğin insana teslim olduğunda inanılmaz bir partner olursun.',

  'Hava-Ateş': 'Aşkta zihinle başlar, tutkuyla devam edersin. Seni önce akıllı konuşmalarla çekerler, sonra ateşin alev alır. Monotonluk düşmanın, sürekli yenilik ve heyecan ararsın.',
  'Hava-Toprak': 'Aşkta fikirle başlarsın ama arzu ettiğin şey güvenlik ve sadakat. Havada uçan romantik düşüncelerini yere indirip somut bir ilişkiye dönüştürmek senin büyük maceran.',
  'Hava-Hava': 'Aşkta en çok zihinsel uyum ararsın. Biri seninle saatlerce konuşamıyorsa çekiciliğini kaybeder. Tehlike: her şeyi kafada yaşayıp bedeni ve kalbi ihmal etmek.',
  'Hava-Su': 'Aşkta mantığınla hislerin sürekli müzakere halinde. Birini çekici bulmak için hem akıllı hem duygusal derinliği olması lazım — bu yüzden standartların çok yüksek.',

  'Su-Ateş': 'Aşkta bir gizemsin — dışarıdan sakin ve çekici, içeride tutkulu ve yoğun. Yavaş açılırsın ama bir kez kapıyı açtığında ortalık yangın yerine döner.',
  'Su-Toprak': 'Aşkta duygusal derinlik ve kalıcılık ararsın. Tek gecelik maceralar sana göre değil — ruhsal bir bağ kurmadan bedeninin kapılarını açmazsın.',
  'Su-Hava': 'Aşkta kalbinle mantığın arasında sürekli bir gel-git yaşarsın. Birini çok derinden hissedersin ama sonra zihnin "ama mantıklı mı?" diye sorar. Bu sarkaç seni bazen delirtir.',
  'Su-Su': 'Aşkta tamamen duygusal bir dalış yaparsın — ya hep ya hiç. İlişkilerin ya ruhların birleşmesi ya da derin bir kırılma olur. Ortası sana göre değil, sen aşkı bütün hücrelerinle yaşarsın.',
};


// ═══════════════════════════════════════════════════════════════
//  YÜKSELENxAY Element Çelişki Şablonları
// ═══════════════════════════════════════════════════════════════

const ASC_MOON_CONTRADICTION = {
  'Ateş-Toprak': 'İlk bakışta ateşli, cesur ve impulsif görünürsün ama içinde çok hesapçı ve güvenlik arayan bir ruh yaşıyor. İnsanlar senin ne kadar planlı olduğunu bilmez.',
  'Ateş-Hava': 'Dışarıdan enerjik ve aksiyoner görünürsün, içeride ise sürekli düşünen ve analiz eden bir zihin var. Cesur görüntünün ardında keskin bir strateji yatıyor.',
  'Ateş-Su': 'Dünya seni korkusuz bir savaşçı olarak görür ama geceleri yastığına baş koyduğunda iç dünyan duygu dolu bir okyanusa dönüşür. O sert kabuğun altındaki hassasiyeti çok az kişi bilir.',
  'Toprak-Ateş': 'Sakin, güvenilir ve kontrollü bir izlenim bırakırsın ama ruhunda sabırsız ve tutkulu bir ateş yanıyor. İnsanlar senin o patlamaya ne kadar yakın olduğunu bilmez.',
  'Toprak-Hava': 'Pratik ve ayakları yerde biri gibi görünürsün ama zihnin sürekli uçuyor — fikirler, ihtimaller, senaryolar. Dışarıdan sağlam, içeride rüzgar gibisin.',
  'Toprak-Su': 'Dünya seni sağlam ve duygusuz sanır ama o kabuğun altında çok hassas, çok sezgisel bir ruh gizleniyor. Güçlü görünme ihtiyacın aslında o kırılganlığı koruma mekanizman.',
  'Hava-Ateş': 'İlk izlenim olarak sosyal, konuşkan ve hafif görünürsün ama altında çok yoğun, hırslı ve tutkulu bir enerji saklı. İnsanlar o zarif yüzeyin arkasındaki ateşi geç fark eder.',
  'Hava-Toprak': 'Zihinsel ve uçarı biri gibi görünürsün ama iç dünyan güvenlik, somut sonuçlar ve maddi istikrar arar. Kafandan çok, midenle hissedersin aslında.',
  'Hava-Su': 'Dışarıdan mantıklı ve soğukkanlı görünürsün ama ruhunun derinliklerinde duygusal bir fırtına esiyor. O analitik maskenin ardında çok hassas bir kalp atıyor.',
  'Su-Ateş': 'Dünya seni hassas ve sakin sanır ama içinde beklenmedik anlarda patlayan bir volkan var. O yumuşak görüntünün arkasındaki savaşçıyı az kişi tanır.',
  'Su-Toprak': 'İlk bakışta duygusal ve empatik görünürsün — ve öylesin de — ama iç dünyan aslında çok daha pragmatik ve hesapçı. Hislerin karar mekanizman değil, pusulan.',
  'Su-Hava': 'Dışarıdan sezgisel ve gizemli bir hava yayarsın ama o perdenin arkasında sürekli düşünen, çözümleyen, analiz eden bir zihin çalışıyor. Mistik görünüşünün ardında keskin bir akıl var.',
  // Aynı element durumlarda çelişki minimaldir
  'Ateş-Ateş': null,
  'Toprak-Toprak': null,
  'Hava-Hava': null,
  'Su-Su': null,
};


// ═══════════════════════════════════════════════════════════════
//  GÜÇLÜ YÖN / KÖR NOKTA Şablonları
// ═══════════════════════════════════════════════════════════════

const ELEMENT_STRENGTH_TEXTS = {
  'Ateş': 'Cesaretini ve girişimci ruhunu ön plana çıkaran bir enerji hakimiyetin var. İlk adımı atan, risk alan ve çevresini ateşleyen kişi genellikle sensin. Bu dürtü, seni başkalarının hayalini kurduğu işleri gerçekleştiren birisi yapıyor.',
  'Toprak': 'Ayakların yere sağlam basıyor. Planlaman, sabrın ve elle tutulur eserler bırakma yeteneğin haritanın omurgasını oluşturuyor. İnsanlar sana güvenir çünkü söylediğini yaparsın, yaptığın şey de kalıcı olur.',
  'Hava': 'Zihinsel çevikliğin ve iletişim gücün haritanın en parlak noktası. Fikirleri sentezlemen, farklı bakış açılarını görmeni ve insanları birbirine bağlaman sana çok güçlü bir sosyal zeka veriyor.',
  'Su': 'Duygusal zeka ve sezgisel derinlik haritanın en büyük armağanı. İnsanları okuma, hissetme ve onlarla derin bağlar kurma kapasiten sıra dışı. Empatin hem kılıcın hem kalkanın.',
};

const ELEMENT_WEAKNESS_TEXTS = {
  'Ateş': 'Haritanda ateş enerjisi neredeyse hiç yok. Spontan hareket etmek, risk almak ve "canım istedi" demek sana zor gelebilir. Düşünmeden atılma cesaretini bilinçli olarak geliştirmen, hayatına beklenmedik güzellikler katacaktır.',
  'Toprak': 'Haritanda toprak enerjisi çok az. Somut planlara bağlı kalmak, sabırla beklemek ve maddi dünyayla barışık olmak senin sınavın. Ayaklarını yere basmayı öğrendiğinde fikirlerin uçmaktan çıkıp yürümeye başlar.',
  'Hava': 'Haritanda hava enerjisi eksik. Duygularını kelimelere dökmek, mantıkla mesafe almak ve sosyal ortamlarda rahatlamak bazen zorlaşabilir. İletişim kasını çalıştırdığında ilişkilerin çok daha akıcı hale gelecektir.',
  'Su': 'Haritanda su enerjisi zayıf. Duygularını hissetmek, kırılganlığını kabullenmek ve sezgilerine güvenmek senin en büyük büyüme alanın. Mantığın ötesinde kalbin sesini duymayı öğrendiğinde çok daha bütün hissedeceksin.',
};

const MODALITY_STRENGTH_TEXTS = {
  'Kardinal': 'Başlatan, harekete geçiren, ilk adımı atan enerji sende baskın. Etrafındakilerin "hadi yapacaksak yapalım" diye beklediği o tetikçi figürsün — liderlik senin doğal refleksin.',
  'Sabit': 'Bir kez başladığında bırakmayan, kararlı ve inatçı bir güç sende var. Başkaları vazgeçerken sen devam edersin — bu dayanıklılık ve sadakat senin süper gücün.',
  'Değişken': 'Esneklik ve adaptasyon yeteneğin olağanüstü. Ortam ne olursa olsun ayak uyduran, farklı insanlarla farklı diller konuşabilen ve değişimden korkmayan bir ruhsun.',
};


// ═══════════════════════════════════════════════════════════════
//  STELLİUM Şablonları (3+ gezegen aynı burçta)
// ═══════════════════════════════════════════════════════════════

const STELLIUM_TEXTS = {
  'Koç': 'Koç burcunda bir stellium var — birden fazla gezegenin bu noktada toplanması, sana olağanüstü bir girişimci ruhu ve öncü enerji veriyor. Bu alan hayatında çok belirleyici.',
  'Boğa': 'Boğa burcundaki stellium, maddi dünya, güvenlik ve estetikle derin bir bağın olduğunu gösteriyor. Değer üretme konusunda devasa bir potansiyel taşıyorsun.',
  'İkizler': 'İkizler stelliumun, zihninin sürekli çalışan bir fabrika olduğunu gösteriyor. İletişim, bilgi toplama ve çok yönlülük senin doğal ortamın.',
  'Yengeç': 'Yengeç burcundaki stellium, duygusal dünyanda çok yoğun bir konsantrasyon olduğuna işaret ediyor. Aile, kökler ve güven duygusu hayatının merkezinde.',
  'Aslan': 'Aslan stelliumun, yaratıcılığın ve kendini ifade etme gücünün çok yoğun olduğunu gösteriyor. Göz ardı edilemezsin — ışığın çok güçlü.',
  'Başak': 'Başak burcundaki stellium, analitik zekanın ve mükemmeliyetçiliğin haritanın merkezinde olduğunu gösteriyor. Detayları görme yeteneğin olağanüstü.',
  'Terazi': 'Terazi stelliumun, ilişkiler ve uyum arayışının hayatındaki en güçlü tema olduğunu gösteriyor. Adalet duygun ve diplomatik zekan çok gelişmiş.',
  'Akrep': 'Akrep burcundaki stellium, derinlik, dönüşüm ve gizem konularında çok yoğun bir enerji taşıdığını gösteriyor. Yüzeysellik sana göre değil — her şeyin dibine dalarsın.',
  'Yay': 'Yay stelliumun, anlam arayışının ve macera ruhunun haritanın en dominant enerjisi olduğunu gösteriyor. Vizyonun geniş, hedeflerin büyük.',
  'Oğlak': 'Oğlak burcundaki stellium, kariyer, otorite ve uzun vadeli hedefler konusunda devasa bir enerji yoğunluğun olduğunu gösteriyor. Zirveyi hedeflemek senin DNA\'nda var.',
  'Kova': 'Kova stelliumun, toplumsal yenilik ve bireysel özgürlük konularında çok güçlü bir enerji taşıdığını gösteriyor. Standart dışı olmak senin doğal halin.',
  'Balık': 'Balık burcundaki stellium, sezgisel derinliğinin ve ruhsal duyarlılığının olağanüstü güçlü olduğunu gösteriyor. Görünmeyeni görme yeteneğin var.',
};


// ═══════════════════════════════════════════════════════════════
//  RETROGRADE Şablonları
// ═══════════════════════════════════════════════════════════════

const RETRO_COUNT_TEXTS = {
  0: 'Haritanda retrograde gezegen yok — enerjini doğrudan, net ve engelsiz bir şekilde dışarı yansıtıyorsun. Niyetin ve eylemin arasında az mesafe var.',
  1: 'Haritanda bir gezegen geri gidiyor — bu alanda içsel bir revizyon ve olgunlaşma süreci yaşıyorsun. Bu gezegenin temsil ettiği konuda kendi içine dönüp yeniden keşfetmen gerekiyor.',
  2: 'İki retrograde gezegen, iç dünyana dönük çalışan güçlü bir revizyon enerjisi olduğunu gösteriyor. Bazı konularda dış dünyaya değil, kendi iç sesinle yüzleşmeyi tercih edersin.',
  3: 'Üç veya daha fazla retrograde gezegen — içsel dünyanda yoğun bir revizyon trafiği var. Kararlarını vermekte zorlanabilirsin çünkü her şeyi defalarca sorgulamaya eğilimlisin. Ama bu derinlik, zamanla büyük bir bilgeliğe dönüşür.',
};

const RETRO_PLANET_TEXTS = {
  mercury: 'Merkür retrosu, iletişim ve düşünce biçiminde kendine özgü bir ritim yarattığını gösteriyor. Konuşmadan önce çok düşünürsün, geçmişe dönük analizlerin ve içsel diyalogların çok güçlüdür.',
  venus: 'Venüs retrosu, aşk ve ilişkilerde derin bir içsel arayış yaşadığını gösteriyor. Sevgi konusunda eski yaraları iyileştirme ve kendine değer vermeyi yeniden öğrenme sürecindesin.',
  mars: 'Mars retrosu, öfkeni ve irade gücünü dışarı yansıtmakta zorlanabileceğini gösteriyor. Eylem enerjin içe dönük — bu seni yumuşak gösterir ama içerideki güç çok büyüktür.',
  jupiter: 'Jüpiter retrosu, şans ve büyümenin dış dünyadan değil, içsel keşiflerden geldiğini gösteriyor. Manevi ve felsefi derinliğin dışa dönük başarıdan daha güçlü.',
  saturn: 'Satürn retrosu, disiplin ve sorumluluk konusunda dış kurallara değil, kendi iç kurallarına göre yaşadığını gösteriyor. Otorite figürleriyle zorlu bir ilişkin olabilir.',
  uranus: 'Uranüs retrosu, isyankar ve yenilikçi enerjinin içe dönük çalıştığını gösteriyor. Dışarıdan sakin görünebilirsin ama içeride devrimci fikirler kaynıyordur.',
  neptune: 'Neptün retrosu, ruhsal ve sezgisel kapasitelerinin çok derin bir iç dünyada işlediğini gösteriyor. Rüyaların, önsezilerin ve hayal gücün çok güçlü.',
  pluto: 'Plüton retrosu, dönüşüm ve güç dinamiklerinin sessizce ama derinden çalıştığını gösteriyor. Değişimlerini kimseye göstermeden, kendi içinde yaşarsın.',
};


// ═══════════════════════════════════════════════════════════════
//  ANA FONKSİYONLAR — Kart İçerikleri Üretici
// ═══════════════════════════════════════════════════════════════

/**
 * Big 3 kartları — Güneş, Ay, Yükselen
 */
export function generateBigThreeNarrative(chart, dna) {
  if (!chart?.sun) return null;

  const sunEl = dna.sunElement;
  const moonEl = dna.moonElement;
  const key = `${sunEl}-${moonEl}`;
  const synthesis = SUN_MOON_SYNTHESIS[key] || '';
  const filledSynthesis = synthesis
    .replace(/{sunSign}/g, chart.sun.name)
    .replace(/{moonSign}/g, chart.moon.name);

  return {
    sun: {
      title: 'Güneşin — Dünyaya Nasıl Parlarsın',
      educational: 'Güneş, en temel kimliğini ve yaşam amacını temsil eder. Dışarıya yansıttığın enerji, bilinçli benliğin.',
      sign: chart.sun.name,
      icon: chart.sun.icon,
      degree: chart.sun.degree,
      house: chart.sun.house,
      interpretation: ASTRO_DICTIONARY.sun?.[chart.sun.name] || '',
      element: sunEl,
    },
    moon: {
      title: 'Ayın — İçinde Gerçekten Ne Hissediyorsun',
      educational: 'Ay, bilinçaltını ve duygusal tepkilerini yansıtır. Dış dünya bu yüzünü görmez ama sen her gece onunla yüzleşirsin.',
      sign: chart.moon.name,
      icon: chart.moon.icon,
      degree: chart.moon.degree,
      house: chart.moon.house,
      interpretation: ASTRO_DICTIONARY.moon?.[chart.moon.name] || '',
      element: moonEl,
    },
    ascendant: chart.ascendant ? {
      title: 'Yükselenin — Dünya Seni İlk Bakışta Nasıl Görüyor',
      educational: 'Yükselen burcun, fiziksel görünüşünü ve ilk izlenimini belirler. Sosyal masken — tanışıncaya kadar insanların gördüğü sen.',
      sign: chart.ascendant.name,
      icon: chart.ascendant.icon,
      degree: chart.ascendant.degree,
      interpretation: ASTRO_DICTIONARY.ascendant?.[chart.ascendant.name] || '',
      element: dna.ascElement,
    } : null,
    synthesis: filledSynthesis,
  };
}

/**
 * Güçlü yönler & kör noktalar
 */
export function generateStrengthsWeaknesses(chart, dna) {
  const strengths = [];
  const weaknesses = [];

  // Dominant element
  if (dna.dominantElement) {
    strengths.push({
      type: 'element',
      label: `${dna.dominantElement.name} Hakimiyeti`,
      percentage: dna.dominantElement.percentage,
      text: ELEMENT_STRENGTH_TEXTS[dna.dominantElement.name] || '',
    });
  }

  // Dominant modality
  if (dna.dominantModality) {
    strengths.push({
      type: 'modality',
      label: `${dna.dominantModality.name} Modalite`,
      percentage: dna.dominantModality.percentage,
      text: MODALITY_STRENGTH_TEXTS[dna.dominantModality.name] || '',
    });
  }

  // Stelliums
  dna.stelliums.forEach(s => {
    strengths.push({
      type: 'stellium',
      label: `${s.count} Gezegen ${s.sign}'da`,
      text: STELLIUM_TEXTS[s.sign] || `${s.sign} burcunda ${s.count} gezegenin toplanması, bu alana devasa bir enerji yoğunluğun olduğunu gösteriyor.`,
    });
  });

  // Weak element
  if (dna.weakestElement && dna.weakestElement.percentage <= 10) {
    weaknesses.push({
      type: 'element',
      label: `${dna.weakestElement.name} Eksikliği`,
      percentage: dna.weakestElement.percentage,
      text: ELEMENT_WEAKNESS_TEXTS[dna.weakestElement.name] || '',
    });
  }

  // Retrograde count
  if (dna.retroCount >= 2) {
    const retroKey = Math.min(dna.retroCount, 3);
    weaknesses.push({
      type: 'retrograde',
      label: `${dna.retroCount} Retrograde Gezegen`,
      text: RETRO_COUNT_TEXTS[retroKey] || RETRO_COUNT_TEXTS[3],
    });
  }

  return { strengths, weaknesses };
}

/**
 * Aşk DNA'sı — Venüs × Mars sentezi
 */
export function generateLoveDNA(chart, dna) {
  if (!chart?.venus || !chart?.mars) return null;

  const key = `${dna.venusElement}-${dna.marsElement}`;
  const synthesis = VENUS_MARS_SYNTHESIS[key] || '';

  return {
    venus: {
      title: 'Nasıl Seversin?',
      educational: 'Venüs, aşk dilini, güzellik algını ve kimi çekici bulduğunu belirler.',
      sign: chart.venus.name,
      icon: chart.venus.icon,
      interpretation: ASTRO_DICTIONARY.venus?.[chart.venus.name] || '',
    },
    mars: {
      title: 'Nasıl Arzularsın?',
      educational: 'Mars, tutku tarzını, cinsel enerjiyi ve eyleme geçme biçimini yönetir.',
      sign: chart.mars.name,
      icon: chart.mars.icon,
      interpretation: ASTRO_DICTIONARY.mars?.[chart.mars.name] || '',
    },
    synthesis,
    sameElement: dna.venusMarsSame,
  };
}

/**
 * Çelişki dedektörü — max 3 çelişki
 */
export function generateContradictions(chart, dna) {
  const contradictions = [];

  // Sun vs Moon element contradiction
  if (dna.sunMoonConflict) {
    const key = `${dna.sunElement}-${dna.moonElement}`;
    const synth = SUN_MOON_SYNTHESIS[key];
    if (synth) {
      contradictions.push({
        type: 'İç vs Dış',
        planet1: { glyph: '☉', label: 'Güneş', sign: chart.sun.name, element: dna.sunElement },
        planet2: { glyph: '☽', label: 'Ay', sign: chart.moon.name, element: dna.moonElement },
        text: synth.replace(/{sunSign}/g, chart.sun.name).replace(/{moonSign}/g, chart.moon.name),
      });
    }
  }

  // ASC vs Moon element contradiction
  if (dna.hasBirthTime && dna.ascMoonConflict && chart.ascendant) {
    const key = `${dna.ascElement}-${dna.moonElement}`;
    const text = ASC_MOON_CONTRADICTION[key];
    if (text) {
      contradictions.push({
        type: 'Maske vs Ruh',
        planet1: { glyph: '↑', label: 'Yükselen', sign: chart.ascendant.name, element: dna.ascElement },
        planet2: { glyph: '☽', label: 'Ay', sign: chart.moon.name, element: dna.moonElement },
        text,
      });
    }
  }

  // Venus vs Mars contradiction
  if (dna.venusMarsConflict) {
    const key = `${dna.venusElement}-${dna.marsElement}`;
    const synth = VENUS_MARS_SYNTHESIS[key];
    if (synth) {
      contradictions.push({
        type: 'Sevgi vs Arzu',
        planet1: { glyph: '♀', label: 'Venüs', sign: chart.venus.name, element: dna.venusElement },
        planet2: { glyph: '♂', label: 'Mars', sign: chart.mars.name, element: dna.marsElement },
        text: synth,
      });
    }
  }

  return contradictions.slice(0, 3);
}

/**
 * Kader & Kariyer — MC + Kuzey Düğüm + Jüpiter + Satürn
 */
export function generateDestinyCareer(chart) {
  const sections = [];

  // MC
  if (chart.mc) {
    const mcHouseNum = 10;
    const houseDesc = HOUSE_DESCRIPTIONS[mcHouseNum];
    sections.push({
      glyph: 'MC',
      title: 'Kariyer & Toplumsal Rolün',
      educational: 'Gökyüzü Ortası (MC), toplumun seni görmek istediği rolü ve kariyer yönelimini gösterir.',
      sign: chart.mc.name,
      icon: chart.mc.icon,
      interpretation: houseDesc ? `${chart.mc.name} enerjisiyle ${houseDesc.desc.toLowerCase()}` : '',
    });
  }

  // North Node
  if (chart.northNode) {
    sections.push({
      glyph: '☊',
      title: 'Kaderin Yönü',
      educational: 'Kuzey Düğüm, bu hayatta öğrenmen gereken en büyük dersi ve ruhsal evriminin yönünü gösterir.',
      sign: chart.northNode.name,
      icon: chart.northNode.icon,
      interpretation: ASTRO_DICTIONARY.northNode?.[chart.northNode.name] || '',
    });
  }

  // Jupiter
  if (chart.jupiter) {
    sections.push({
      glyph: '♃',
      title: 'Şansının Kapısı',
      educational: 'Jüpiter, hayatta en şanslı olduğun alanı ve büyüme fırsatlarını gösterir.',
      sign: chart.jupiter.name,
      icon: chart.jupiter.icon,
      interpretation: ASTRO_DICTIONARY.jupiter?.[chart.jupiter.name] || '',
    });
  }

  // Saturn
  if (chart.saturn) {
    sections.push({
      glyph: '♄',
      title: 'En Büyük Sınavın',
      educational: 'Satürn, hayatında en zorlandığın ama en çok olgunlaştığın alanı gösterir.',
      sign: chart.saturn.name,
      icon: chart.saturn.icon,
      interpretation: ASTRO_DICTIONARY.saturn?.[chart.saturn.name] || '',
    });
  }

  return sections;
}

/**
 * Retrograde gezegen detayları
 */
export function generateRetrogradeSummary(dna) {
  if (dna.retroCount === 0) return { summary: RETRO_COUNT_TEXTS[0], details: [] };

  const details = dna.retroPlanets.map(key => ({
    planet: key,
    text: RETRO_PLANET_TEXTS[key] || '',
  })).filter(d => d.text);

  const countKey = Math.min(dna.retroCount, 3);
  return {
    summary: RETRO_COUNT_TEXTS[countKey] || RETRO_COUNT_TEXTS[0],
    details,
    count: dna.retroCount,
  };
}


// ═══════════════════════════════════════════════════════════════
//  KOZMİK İMZA ANALİZCİSİ — Haritadaki en vurucu yerleşimler
//  Kullanıcıyı "Kahine Danış" bölümüne yönlendirecek kancalar.
// ═══════════════════════════════════════════════════════════════

const PLANET_HOUSE_SIGNATURES = {
  // ─── Özel ev yerleşimleri (en dikkat çekici olanlar) ────────
  // Kişisel gezegenler × güçlü evler
  'sun-1':     { title: 'Güneş 1. Evde', icon: '☉', color: '#FFD700', hook: 'Kimliğin ve fiziksel varlığın çok güçlü bir şekilde birleşmiş. İlk izlenimin ve gerçek benliğin neredeyse aynı — insanlar seni gördüğü gibi alıyor. Bu yerleşim sana doğal bir karizma ve \"ben buradayım\" enerjisi veriyor.' },
  'sun-10':    { title: 'Güneş 10. Evde', icon: '☉', color: '#FFD700', hook: 'Kariyer ve toplumsal statü hayatının merkezinde. Kamusal alanda parlama ve otorite olma potansiyelin devasa. İnsanlar seni profesyonel kimliğinle tanıyor — bu hem bir armağan hem de bir yük.' },
  'sun-12':    { title: 'Güneş 12. Evde', icon: '☉', color: '#FFD700', hook: 'Kimliğin gizli ve manevi bir alanda saklı. Dış dünyada kendini tam ifade edemediğini hissedebilirsin ama iç dünyan inanılmaz zengin. Ruhsal derinliğin ve şifa kapasiten çok güçlü.' },
  'moon-4':    { title: 'Ay 4. Evde', icon: '☽', color: '#E8E8FF', hook: 'Ay kendi doğal evinde — duygusal köklerin, aile bağların ve yuva ihtiyacın hayatının en önemli teması. Ev sana sığınak, aile sana anlam veriyor.' },
  'moon-8':    { title: 'Ay 8. Evde', icon: '☽', color: '#E8E8FF', hook: 'Duygusal dünyanda yoğun dönüşümler yaşıyorsun. Krizleri içgüdüsel olarak hisseder, insanların gizli taraflarını okursun. Bu yerleşim sana psişik bir derinlik veriyor.' },
  'moon-12':   { title: 'Ay 12. Evde', icon: '☽', color: '#E8E8FF', hook: 'Duyguların bilinçaltında çok derin bir yerde saklı. Rüyaların, sezgilerin ve empatik kapasiten olağanüstü güçlü ama bazen kendi hislerini tanımlamakta zorlanabilirsin.' },
  'venus-5':   { title: 'Venüs 5. Evde', icon: '♀', color: '#FF85C2', hook: 'Aşk ve yaratıcılık hayatının en büyük zevkleri. Romantizmin doğal, yaratıcılığın çekici, eğlence anlayışın sofistike. İlişkilerinde çok şanslı bir yerleşim.' },
  'venus-7':   { title: 'Venüs 7. Evde', icon: '♀', color: '#FF85C2', hook: 'İlişki ve ortaklıklar hayatının altın anahtarı. Doğal bir ilişki kurma yeteneğin var — insanlar seninle olmaktan huzur duyuyor. Evlilik sana çok yakışacak bir kurum.' },
  'venus-8':   { title: 'Venüs 8. Evde', icon: '♀', color: '#FF85C2', hook: 'Aşkı ve ilişkileri yüzeysel yaşayamıyorsun. Senin için sevmek demek karşındakinin ruhunu soymak, tabular ve sırları birlikte yaşamak. Cinsel ve duygusal yoğunluğun çok güçlü.' },
  'venus-12':  { title: 'Venüs 12. Evde', icon: '♀', color: '#FF85C2', hook: 'Gizli aşklar, karşılıksız sevgiler veya ruhsal bağlar hayatında önemli bir tema. Sevme biçimin çok derin ama görünmez — sanki başka bir boyutta seviyorsun.' },
  'mars-1':    { title: 'Mars 1. Evde', icon: '♂', color: '#FF5555', hook: 'Enerji ve eylem gücün fiziksel varlığına yansımış. Atletik, kararlı ve doğrudan biri olarak algılanırsın. Savaşçı ruhun dışarıdan hemen belli.' },
  'mars-10':   { title: 'Mars 10. Evde', icon: '♂', color: '#FF5555', hook: 'Kariyer hayatın senin savaş alanın. Başarıya ulaşmak için inanılmaz bir hırsın ve gözü pekliğin var. İş dünyasındaki boyun eğmez tutumun hemen fark edilir.' },
  'mars-12':   { title: 'Mars 12. Evde', icon: '♂', color: '#FF5555', hook: 'Öfken ve irade gücün bilinçaltında saklı. Dışarıdan sakin görünürsün ama içeride çok güçlü bir enerji birikir. Bu gücü yapıcı kanalize etmeyi öğrendiğinde durdurulamazsın.' },
  'mercury-3': { title: 'Merkür 3. Evde', icon: '☿', color: '#A0B0FF', hook: 'İletişim yeteneğin doğal evinde — yazma, konuşma ve öğrenme konusunda doğuştan yeteneklisin. Çok dilli, çok boyutlu bir zihin.' },
  'mercury-9': { title: 'Merkür 9. Evde', icon: '☿', color: '#A0B0FF', hook: 'Zihnin sürekli ufuk genişletiyor. Felsefe, yabancı kültürler ve yüksek öğrenim senin doğal habitatın. Öğretmen veya yazar olma potansiyelin çok güçlü.' },
  'jupiter-2': { title: 'Jüpiter 2. Evde', icon: '♃', color: '#F6A500', hook: 'Maddi bolluk ve değerler konusunda doğal bir şansın var. Para kazanma kapasiten geniş ama dikkatli olmazsan harcama dürtün de o kadar büyük.' },
  'jupiter-9': { title: 'Jüpiter 9. Evde', icon: '♃', color: '#F6A500', hook: 'Jüpiter kendi doğal evinde — felsefi derinliğin, öğretme yeteneğin ve şansın çok güçlü. Seyahat ve yüksek öğrenim sana kapılar açıyor.' },
  'saturn-10': { title: 'Satürn 10. Evde', icon: '♄', color: '#8888FF', hook: 'Kariyer yolun uzun ve çetin ama zirveye ulaştığında kimse seni oradan indiremez. Otorite figürleriyle sınavların var ama sonunda otorite sen oluyorsun.' },
  'pluto-1':   { title: 'Plüton 1. Evde', icon: '♇', color: '#CC6677', hook: 'Yoğun, manyetik ve dönüştürücü bir varlığın var. İnsanlar üzerinde güçlü bir etki bırakırsın — farkında olmasan bile. Hayatın boyunca birçok \"yeniden doğuş\" yaşayacaksın.' },
  'pluto-8':   { title: 'Plüton 8. Evde', icon: '♇', color: '#CC6677', hook: 'Plüton kendi doğal evinde — dönüşüm, güç ve gizem temaları hayatının merkezinde. Krizlerden küllerinden doğan bir anka kuşu gibi çıkma kapasiten devasa.' },
};

// Puanlama: Hangi yerleşimler daha "vurucu"?
const SIGNATURE_PRIORITY = {
  'venus-8': 95, 'pluto-1': 93, 'pluto-8': 92, 'moon-8': 90,
  'mars-12': 88, 'sun-12': 87, 'venus-12': 86, 'moon-12': 85,
  'sun-10': 82, 'mars-10': 80, 'saturn-10': 78, 'sun-1': 75,
  'mars-1': 73, 'venus-5': 70, 'venus-7': 68, 'moon-4': 65,
  'jupiter-9': 62, 'jupiter-2': 60, 'mercury-3': 58, 'mercury-9': 55,
};

const PERSONAL_PLANET_KEYS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'pluto'];

export function analyzeKozmikImza(chart) {
  if (!chart?.sun || !chart.hasBirthTime) return null;

  const found = [];

  PERSONAL_PLANET_KEYS.forEach(key => {
    const planet = chart[key];
    if (!planet?.house) return;

    const sigKey = `${key}-${planet.house}`;
    const sig = PLANET_HOUSE_SIGNATURES[sigKey];
    if (sig) {
      found.push({
        key: sigKey,
        priority: SIGNATURE_PRIORITY[sigKey] || 50,
        planetKey: key,
        house: planet.house,
        sign: planet.name,
        ...sig,
      });
    }
  });

  // Önceliğe göre sırala, en vurucu 2 tanesini döndür
  found.sort((a, b) => b.priority - a.priority);
  return found.slice(0, 2);
}

