// ═══════════════════════════════════════════════════════════════
//  GÜNLÜK ORACLE SÖZLÜĞÜ — Transit Ay × Natal Güneş (144 Şablon)
//  AI kullanmadan, tamamen yerel, her gün değişen içerik motoru.
// ═══════════════════════════════════════════════════════════════

// Transit Ay'ın hangi burçtan geçtiğine göre, kullanıcının
// Güneş burcuyla eşleşen günlük kozmik rota mesajları.
// Format: DAILY_ORACLE[transitAyBurcu][natalGüneşBurcu]

export const DAILY_ORACLE = {
  'Koç': {
    'Koç': 'Ay kendi burcundan geçerken enerjin tavan yapıyor. Bugün cesur adımlar atmak için ideal — ama düşünmeden atılma, önce bir nefes al.',
    'Boğa': 'Bugün alışkanlıklarından çıkman için kozmik bir dürtü var. Konfor alanından bir adım dışarı at, sürprizlere açık ol.',
    'İkizler': 'Zihnin her zamankinden hızlı çalışıyor. Bugün başladığın konuşmalar ve fikirler beklenmedik kapılar açabilir.',
    'Yengeç': 'İç dünyan biraz dalgalı olabilir ama dışarıda harekete geçmen gereken bir gün. Duygularını erteleme, eyleme dök.',
    'Aslan': 'Liderlik enerjin bugün çok güçlü. İnsanlar seni dinlemeye ve takip etmeye hazır — sahneye çık.',
    'Başak': 'Bugün mükemmeliyetçiliğini bırakıp hızlı hareket etmen gerekiyor. Detaylar sonra hallolur, önce başla.',
    'Terazi': 'İlişkilerinde bugün doğrudan konuşman gerekebilir. Diplomasiyi bir kenara bırakıp samimi ol.',
    'Akrep': 'İçindeki savaşçı bugün çok aktif. Bu enerjiyi yapıcı bir hedefe yönlendir, yoksa gereksiz çatışmalara girebilirsin.',
    'Yay': 'Macera ruhun bugün kabarıyor. Yeni bir şey deneme, spontan bir plan yapma günü.',
    'Oğlak': 'Kariyerinde bugün cesur bir hamle yapma zamanı gelmiş olabilir. Hesapçı doğanı bir kenara bırakıp risk al.',
    'Kova': 'Bugün topluluk içinde öncü olma enerjin güçlü. Bir fikri savunmak veya bir projeyi başlatmak için harika bir gün.',
    'Balık': 'Sezgilerin bugün çok keskin ama harekete geçmekte zorlanabilirsin. Bedenini dinle ve fiziksel aktiviteyle enerji topla.',
  },
  'Boğa': {
    'Koç': 'Bugün yavaşlaman ve sabretmen isteniyor — ama senin doğan bu değil. Bu gerilimi kabul et, acele etme.',
    'Boğa': 'Ay kendi burcundan geçiyor — bugün kendini şımartma günün. Güzel yemekler, güzel müzik, dokunsal zevkler.',
    'İkizler': 'Bugün zihinsel hızını düşürüp somut adımlara odaklanman gerekiyor. Bir listeye döküp planla.',
    'Yengeç': 'Ev, aile ve güvenlik temaları bugün ön planda. Sevdiklerinle vakit geçirmek sana inanılmaz iyi gelecek.',
    'Aslan': 'Bugün gösteriş yerine kaliteye odaklan. Az ama öz, sade ama etkili — bugünün mottosu bu.',
    'Başak': 'İkiz ruhun gibi bir gün — pratik, somut ve verimli. Bugün başladığın iş uzun vadeli meyveler verir.',
    'Terazi': 'Estetik zevklerin bugün dorukta. Güzel şeyler satın almak, sanat yapmak veya çevreyi güzelleştirmek için ideal.',
    'Akrep': 'Sahiplik ve değer temaları bugün yoğun. Neye ve kime değer verdiğini sorgulaman için güçlü bir kozmik sinyal.',
    'Yay': 'Bugün macera yerine huzur ara. Doğada yürümek, bahçeyle uğraşmak veya sessizce okumak sana çok iyi gelecek.',
    'Oğlak': 'Finansal konularda bugün önemli kararlar alabilirsin. Sağlam adımlar at, uzun vadeli düşün.',
    'Kova': 'Bugün sıra dışı fikirlerini somut bir projeye dönüştürme zamanı. Kafanda uçuşan konseptleri yere indir.',
    'Balık': 'Duygusal güvenlik bugün çok önemli. Kendini güvende hissettiğin bir ortamda vakit geçir, ruhunu besle.',
  },
  'İkizler': {
    'Koç': 'Bugün hem hızlı hem zeki olmalısın. Konuşmalarında cesur ol ama sözlerini tartarak kullan.',
    'Boğa': 'Bugün rutinden sıkılabilirsin. Yeni bir podcast, yeni bir konu, yeni bir sohbet — zihnini besle.',
    'İkizler': 'Ay kendi burcundan geçerken iletişim süper gücün aktif. Bugün yazma, konuşma ve networking için harika.',
    'Yengeç': 'Bugün duygularını kelimelere dökmek her zamankinden kolay. Birine mektup yaz, sesli mesaj at veya kalbini aç.',
    'Aslan': 'Sosyal medya, sunum veya sahne — bugün kendini ifade etme enerjin çok güçlü. Sözlerinle parla.',
    'Başak': 'Analitik zihnin bugün çok güçlü. Araştırma, karşılaştırma ve karar verme için ideal bir gün.',
    'Terazi': 'Diplomatik yeteneklerin bugün zirveye çıkıyor. Zor konuşmaları bugün yap — doğru kelimeleri bulacaksın.',
    'Akrep': 'Bugün yüzeyin altına inme isteğin güçlü. Derin bir araştırma yap, bir sırrı çöz veya bir kitabın içine gömül.',
    'Yay': 'Bilgi alışverişi bugün çok verimli. Öğret, öğren, tartış — zihinsel esnekliğin seni çok uzağa taşır.',
    'Oğlak': 'Bugün iş iletişiminde çok etkili olabilirsin. Mail at, toplantı yap, network genişlet.',
    'Kova': 'Sıra dışı fikirler bugün akıyor. Beyin fırtınası yap, not al — bu fikirlerin bazıları altın değerinde.',
    'Balık': 'Bugün hayal gücünü kelimelerle ifade etmek için mükemmel bir gün. Şiir, günlük veya yaratıcı yazı dene.',
  },
  'Yengeç': {
    'Koç': 'Bugün yumuşaman ve kırılgan tarafını kabul etmen isteniyor. Güçlü görünmek zorunda değilsin.',
    'Boğa': 'Ev ve aile temaları bugün çok rahatlatıcı. Evde yemek yapmak, sevdiklerinle olmak sana huzur verecek.',
    'İkizler': 'Bugün mantığını bir kenara bırakıp hislerinle hareket et. İçgüdülerin seni doğru yere götürecek.',
    'Yengeç': 'Ay kendi burcundan geçiyor — duyguların çok yoğun ama çok da bereketli. Kendine şefkat göster.',
    'Aslan': 'Bugün spotışığından biraz geri çekil ve iç dünyaya dön. Sessiz bir akşam sana çok iyi gelecek.',
    'Başak': 'Bugün analiz yerine his. Ruhsal temizlik yap — ağlamak, gülmek, anı yaşamak serbest.',
    'Terazi': 'İlişkilerinde bugün duygusal derinlik ara. Yüzeysel sohbetler yerine kalpten kalbe bir bağlantı kur.',
    'Akrep': 'Duygusal yoğunluğun bugün çok güçlü ama yapıcı. Dönüştürücü bir gündesin — eski yaraları iyileştir.',
    'Yay': 'Bugün kaçmak yerine yuva kur. Evini düzenle, aileni ara, köklerine dön.',
    'Oğlak': 'İş-ev dengesi bugün sınavda. Kariyerin önemli ama bugün ailene ve kendine de zaman ayır.',
    'Kova': 'Bugün duygusal zeka, entelektüel zekandan daha önemli. Hislerini bastırma, yaşa.',
    'Balık': 'Sezgisel ve ruhani bir gün. Meditasyon, müzik dinleme veya suyla temas (duş, deniz) sana çok iyi gelecek.',
  },
  'Aslan': {
    'Koç': 'Bugün sahneye çıkma ve liderlik etme enerjin inanılmaz güçlü. Çevrendeki insanları ateşle.',
    'Boğa': 'Bugün kendini ödüllendirme zamanı. Küçük lüksler, güzel anlar — hak ettiğin takdiri kendin ver.',
    'İkizler': 'Sosyal enerjin bugün parlıyor. Eğlenceli sohbetler, yaratıcı fikirler ve sahne performansı — ışıl ışıl bir gün.',
    'Yengeç': 'Bugün kalbinin sesini yükselt. Sevdiklerine ne kadar değerli olduklarını göster — cömertliğin karşılığını bulacak.',
    'Aslan': 'Ay kendi burcundan geçerken tüm ışığın dışarı vuruyor. Bugün sen sahnenin yıldızısın — tadını çıkar.',
    'Başak': 'Bugün kusursuz olma baskısını bırak ve eğlen. Yaratıcılığını serbest bırak, mükemmeliyetçiliği ertele.',
    'Terazi': 'Bugün çekiciliğin ve karizman zirve yapıyor. Sosyal etkinlikler, buluşmalar ve flört için harika bir gün.',
    'Akrep': 'İç gücün bugün dışarı vuruyor. Sessiz durmak yerine aksiyona geç — gücünü göster.',
    'Yay': 'Bugün büyük düşün, büyük hayal kur. Sınırları zorlamak ve maceraya atılmak için mükemmel bir enerji.',
    'Oğlak': 'Profesyonel alanda bugün öne çık. Sunum yap, liderlik göster, otoriteni hissettir.',
    'Kova': 'Bireyselliğin bugün parlıyor. Kalabalıktan sıyrıl ve kendi benzersiz tarzınla dans et.',
    'Balık': 'Yaratıcılığın bugün patlama yapabilir. Sanat, müzik veya hayal kurma — ruhunu özgür bırak.',
  },
  'Başak': {
    'Koç': 'Bugün hızını kes ve detaylara odaklan. Atladığın küçük şeyler büyük fark yaratacak.',
    'Boğa': 'Pratik ve verimli bir gün seni bekliyor. Liste yap, organize et, temizle — sonuçlar tatmin edici olacak.',
    'İkizler': 'Bugün bilgi toplamak ve analiz etmek için mükemmel. Araştırma, kıyaslama ve raporlama günün.',
    'Yengeç': 'Sağlık ve öz bakım bugün ön planda. Beslenme düzenini gözden geçir, bedenini dinle.',
    'Aslan': 'Bugün sahneden sahne arkasına geç. Detayları düzelt, planları rafine et — parlaman için önce hazırlan.',
    'Başak': 'Ay kendi burcundan geçiyor — bugün her şeyi düzene sokmak için harika bir gün. Ama aşırı eleştirmekten kaçın.',
    'Terazi': 'Bugün ilişkilerindeki pratik detaylarla ilgilen. Kim ne yapacak, sınırlar nerede — netleştirme zamanı.',
    'Akrep': 'Bugün derin analizler yapmak için ideal. Bir konunun dibine dal, sırları çöz, detayları keşfet.',
    'Yay': 'Bugün büyük vizyonunu küçük, uygulanabilir adımlara böl. Hayal kurmayı bırak, listeye dök.',
    'Oğlak': 'Verimlilik bugün senin süper gücün. İşleri sistematik olarak halletmek için enerjin çok yüksek.',
    'Kova': 'Bugün soyut fikirlerini somutlaştır. Prototip yap, plan çıkar, detaylarla uğraş — altın bulacaksın.',
    'Balık': 'Bugün sezgilerini mantıkla destekle. Hislerin doğru ama onları bir çerçeveye oturtman gerekiyor.',
  },
  'Terazi': {
    'Koç': 'Bugün ilişkilerinde denge arayışı öne çıkıyor. Kendi ihtiyaçlarını da karşıdakininki kadar önemse.',
    'Boğa': 'Estetik ve güzellik bugün sana çok iyi gelecek. Sanat galerisi, şık bir mekan veya güzel bir kıyafet.',
    'İkizler': 'Sosyal bağlantılar bugün çok verimli. İş birliği, ortaklık ve diplomatik konuşmalar için ideal.',
    'Yengeç': 'İlişkilerinde bugün duygusal denge ara. Hem veren hem alan olmayı öğrenmek günün teması.',
    'Aslan': 'Bugün çevrendeki insanlarla uyum içinde parla. Tek başına sahne alma — birlikte yaratmak daha güçlü.',
    'Başak': 'Bugün mükemmeliyetçiliğini ilişkilere değil, estetiğe yönlendir. Güzel bir şey tasarla veya yarat.',
    'Terazi': 'Ay kendi burcundan geçiyor — uyum, güzellik ve ilişki temaları çok güçlü. Barış yap, köprü kur.',
    'Akrep': 'Bugün yoğun duygularını dengeleme zamanı. Hem derine dal hem de yüzeye çık — aşırılıklardan kaçın.',
    'Yay': 'Bugün farklı bakış açılarını dinle. Kendi hakikatinin tek hakikat olmadığını kabul et — bu seni genişletecek.',
    'Oğlak': 'İş ortaklıkları ve profesyonel ilişkiler bugün ön planda. Anlaşma yap, müzakere et, denge kur.',
    'Kova': 'Sosyal adalet ve eşitlik duygun bugün kabarıyor. Topluluk içinde dengeleyici rol oyna.',
    'Balık': 'Bugün sanatsal ve romantik enerjin çok yüksek. Güzelliği hem yaşa hem yarat.',
  },
  'Akrep': {
    'Koç': 'Bugün tutkunun derinleştiği bir gün. Yüzeysel işleri bırak, seni gerçekten heyecanlandıran şeye odaklan.',
    'Boğa': 'Sahip olduklarını ve değerlerini bugün sorgulayabilirsin. Teslim ol — bazen bırakmak kazanmanın ta kendisi.',
    'İkizler': 'Bugün derin konuşmalar ve sırlar ortaya çıkabilir. Yüzeysel sohbetten kaçın, gerçek bağlantılar kur.',
    'Yengeç': 'Duygusal derinliğin bugün çok güçlü. Eski yaraları iyileştirmek veya birini affetmek için ideal.',
    'Aslan': 'Bugün gücünü sessizce kullan. Gösterişe gerek yok — stratejik ol, zamanı geldiğinde hamle yap.',
    'Başak': 'Analitik zekanla bugün bir konunun en karanlık köşelerine ışık tutabilirsin. Araştır ve dönüştür.',
    'Terazi': 'İlişkilerinde bugün derin bir dönüşüm yaşanabilir. Yüzeysel uyum yerine gerçek yakınlık ara.',
    'Akrep': 'Ay kendi burcundan geçiyor — dönüşüm enerjin zirvede. Neyi bırakman ve neyi dönüştürmen gerekiyor?',
    'Yay': 'Bugün felsefi derinliklere dal. Hayatın anlamı, ölüm ve yeniden doğuş temaları seni çekebilir.',
    'Oğlak': 'Güç dinamikleri bugün ön planda. Kariyer ve otoritenle ilgili stratejik kararlar alabilirsin.',
    'Kova': 'Bugün toplumsal tabular ve gizli yapıları sorgulama zamanı. İsyankar doğan derin bir amaç taşıyor.',
    'Balık': 'Mistik ve sezgisel enerjin bugün çok güçlü. Rüyalarına dikkat et — mesaj taşıyor olabilirler.',
  },
  'Yay': {
    'Koç': 'Bugün macera ve keşif enerjin tavan yapıyor. Yeni bir yer keşfet, yeni biri tanı.',
    'Boğa': 'Rutinden kaçma isteğin bugün güçlü. Küçük de olsa bir macera planla — kısa bir gezi bile olabilir.',
    'İkizler': 'Öğrenme ve öğretme enerjin bugün çok güçlü. Yeni bir kurs, yeni bir kitap veya ilham veren bir sohbet.',
    'Yengeç': 'Bugün duygusal güvenliğinden biraz uzaklaşıp ufkunu genişlet. Konfor alanından çık — merak et.',
    'Aslan': 'Büyük düşünme ve büyük yapma günün. Vizyoner enerjin çok güçlü — hedeflerini yüksek tut.',
    'Başak': 'Bugün detayları bırak ve büyük resme bak. Ormanı görmek için ağaçlardan geri çekil.',
    'Terazi': 'Farklı kültürler ve bakış açıları bugün seni çok zenginleştirecek. Dış dünyaya aç ol.',
    'Akrep': 'Bugün karanlıktan ışığa çık. Ağır konuları bırak, hafifle — gülmek ve eğlenmek serbest.',
    'Yay': 'Ay kendi burcundan geçiyor — özgürlük, macera ve anlam arayışın zirvede. Bugün dünya senin.',
    'Oğlak': 'Bugün ciddi planlarından bir mola ver. Spontanlık ve eğlence seni şarj edecek.',
    'Kova': 'Toplumsal vizyon ve insanlık ideallerin bugün güçleniyor. Büyük resim için ilham dolu bir gün.',
    'Balık': 'Ruhani arayışın ve hayal gücün bugün macera ruhunla birleşiyor. İlham verici bir gün.',
  },
  'Oğlak': {
    'Koç': 'Bugün sabırlı ve disiplinli olman gerekiyor. Hızlı sonuç yerine sağlam temel at.',
    'Boğa': 'Kariyer ve finans konularında bugün çok güçlüsün. Uzun vadeli yatırımlar ve kararlar için ideal.',
    'İkizler': 'Bugün iletişimini profesyonelleştir. İş mailleri, resmi konuşmalar ve networking için harika.',
    'Yengeç': 'İş-aile dengesi bugün sınavda. İkisine de zaman ayırman gerekiyor — birini ihmal etme.',
    'Aslan': 'Bugün gösteriş yerine sonuçlara odaklan. Sessiz ama etkili bir liderlik göster.',
    'Başak': 'Verimlilik ve disiplin bugün çok güçlü. Sistemleri kur, süreçleri oluştur — yapı inşa et.',
    'Terazi': 'Profesyonel ilişkiler ve ortaklıklar bugün önemli. Sözleşme, anlaşma ve müzakere zamanı.',
    'Akrep': 'Güç ve kontrol dinamikleri bugün ön planda. Stratejini gözden geçir, hamlelerin hesaplı olsun.',
    'Yay': 'Bugün büyük vizyonunu somut bir plana çevir. Hayal kurmayı bırak, takvim aç, tarih koy.',
    'Oğlak': 'Ay kendi burcundan geçiyor — otorite ve sorumluluk temaların güçlü. Bugün liderlik seni çağırıyor.',
    'Kova': 'Bugün kurumsal yapılardan biraz uzaklaş ve bireysel özgünlüğüne alan aç.',
    'Balık': 'Bugün pragmatik tarafını ruhani derinliğinle birleştir. İş hayatında sezgilerini kullanmaktan korkma.',
  },
  'Kova': {
    'Koç': 'Bugün sıra dışı ve cesur bir adım atma zamanı. Herkesin beklediği şeyi yapma — farklı ol.',
    'Boğa': 'Bugün rutini kırma ve yenilik arayışı güçlü. Alışkanlıklarını sorgula — hangisi seni tutuyor?',
    'İkizler': 'Teknoloji, bilim ve gelecekle ilgili fikirler bugün akıyor. Not al — bu düşünceler değerli.',
    'Yengeç': 'Bugün duygusal bağlarını topluluk perspektifinden değerlendir. Aile ≠ sadece kan bağı.',
    'Aslan': 'Bireyselliğin bugün parlıyor ama bunu topluluk için kullan. Tek başına ışılda, birlikte aydınlat.',
    'Başak': 'Bugün inovatif çözümler üretmek için analitik zekanı kullan. Sistem tasarla, devrim planla.',
    'Terazi': 'Sosyal adalet ve eşitlik duygun bugün çok güçlü. Birilerinin sesi ol, köprü kur.',
    'Akrep': 'Bugün toplumsal tabuları sorgulamak ve dönüştürmek için güçlü bir enerji var.',
    'Yay': 'Gelecek vizyonun ve insanlık ideallerin bugün çok canlı. Bilgeliğini paylaş, ilham ver.',
    'Oğlak': 'Bugün yapıları yık ve yeniden inşa et. Eski sistemler seni sınırlıyorsa değişim zamanı.',
    'Kova': 'Ay kendi burcundan geçiyor — özgünlüğün ve vizyonun tavan yapıyor. Bugün gelecek senin ellerinde.',
    'Balık': 'Bugün ruhani sezgilerini toplumsal bir amaca yönlendir. Kolektif bilinç bugün seninle konuşuyor.',
  },
  'Balık': {
    'Koç': 'Bugün savaşçı ruhunu bir kenara bırakıp akışa teslim ol. Kontrol yerine sezgilerine güven.',
    'Boğa': 'Bugün maddi dünyadan bir adım geri çekil ve ruhsal dünyayı keşfet. Meditasyon, müzik, doğa.',
    'İkizler': 'Bugün mantığını düşür, hayal gücünü aç. Şiirsel düşünmek, yaratıcı yazmak için harika bir gün.',
    'Yengeç': 'Duygusal ve sezgisel enerjin bugün çok güçlü. Rüyalarına dikkat et ve sevdiklerinle ruhsal bir bağ kur.',
    'Aslan': 'Bugün ego yerine ruh konuşsun. Sahneden çekil, sessizce gözlemle — derinlikte büyük güzellikler var.',
    'Başak': 'Bugün analizi bırak ve hisset. Her şeyi anlamak zorunda değilsin — bazen sadece yaşa.',
    'Terazi': 'Bugün ilişkilerinde ruhsal ve romantik bir derinlik ara. Sıradan buluşma yerine büyülü bir an yarat.',
    'Akrep': 'Mistik ve psişik yeteneklerin bugün çok güçlü. Meditasyon, tarot veya rüya günlüğü tut.',
    'Yay': 'Bugün anlam arayışın ruhsal bir boyut kazanıyor. Bir tapınağa git, bir bilgeyle konuş veya sessizce düşün.',
    'Oğlak': 'Bugün iş dünyasından bir mola ver ve ruhsal beslenmeye zaman ayır. Her şeyin bir mevsimi var.',
    'Kova': 'Kolektif bilinç ve evrensel sevgi temaları bugün çok güçlü. İnsanlık için dua et, umut taşı.',
    'Balık': 'Ay kendi burcundan geçiyor — sezgilerin, empatin ve ruhsal bağlantıların en güçlü olduğu gün. Akışa teslim ol.',
  },
};

// ─── GÜNLÜK ORACLE OKUYUCU ──────────────────────────────────
// Transit Ay burcu + Natal Güneş burcu → günlük mesaj
export function getDailyOracleMessage(transitMoonSign, natalSunSign) {
  const baseMessage = DAILY_ORACLE[transitMoonSign]?.[natalSunSign];
  
  if (!baseMessage) {
    return 'Bugün kozmik enerjiler senin için sakin bir gün hazırlamış. Akışına bırak ve günü keşfet.';
  }

  // Mesajı cümleye bağlamak için ilk harfi küçült
  const lowerBase = baseMessage.charAt(0).toLowerCase() + baseMessage.slice(1);
  
  // Rastgele giriş kalıpları (her gün aynı hissettirmemesi için)
  const prefixes = [
    `Bugün Ay ${transitMoonSign} burcundan geçiyor. Bir ${natalSunSign} olarak ${lowerBase}`,
    `Gökyüzünde Ay'ın ${transitMoonSign} transiti var. Senin gibi doğuştan ${natalSunSign} enerjisi taşıyan biri için ${lowerBase}`,
    `Kozmik sahnede Ay ${transitMoonSign} burcunda parlıyor. Doğal bir ${natalSunSign} olarak bilmelisin ki; ${lowerBase}`
  ];
  
  // Burç isminden basit bir hash üretip bugünün tarihine göre indeks seçelim (hep aynı çıkmasın ama gün içinde değişmesin)
  const dayIndex = new Date().getDate();
  const index = (transitMoonSign.length + natalSunSign.length + dayIndex) % prefixes.length;

  return prefixes[index];
}
