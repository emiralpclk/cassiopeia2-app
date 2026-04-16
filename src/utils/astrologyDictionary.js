// ═══════════════════════════════════════════════════════════════
//  KOZMİK SÖZLÜK — Gezegen, Burç, Ev ve Açı Yorumları
// ═══════════════════════════════════════════════════════════════

// ─── GEZEGENLERİN TEMEL TANIMLARI ────────────────────────────
export const PLANET_DESCRIPTIONS = {
  sun:      { title: 'Benlik & Yaşam Amacı', desc: 'Güneş, senin en temel kimliğini, egonu ve yaşam amacını temsil eder. Işığını nereden yaktığın, dünyaya nasıl parladığın burada saklı.' },
  moon:     { title: 'İç Dünya & Duygular', desc: 'Ay, bilinçaltını, duygusal tepkilerini ve iç dünyandaki en mahrem bölgeyi yansıtır. Gerçek hislerin ve sezgilerin burada yaşar.' },
  mercury:  { title: 'Zihin & İletişim', desc: 'Merkür, düşünme biçimini, konuşma tarzını ve bilgiyi işleme şeklini gösterir. Zihninin ana dili burada yazılı.' },
  venus:    { title: 'Aşk & Estetik', desc: 'Venüs, sevgi anlayışını, güzellik algını ve ilişkilerdeki uyum arayışını temsil eder. Neyi çekici bulduğun ve nasıl sevdiğin burada.' },
  mars:     { title: 'Tutku & Eylem', desc: 'Mars, irade gücünü, savaş tarzını ve eyleme geçme biçimini yönetir. Engeller karşısında nasıl tepki verdiğin burada.' },
  jupiter:  { title: 'Şans & Genişleme', desc: 'Jüpiter, bolluk, fırsatlar ve büyüme alanını gösterir. Hayatta en şanslı olduğun yer ve inanç sistemi burada şekillenir.' },
  saturn:   { title: 'Sorumluluk & Disiplin', desc: 'Satürn, hayatında sınavların, sınırların ve olgunlaşma sürecinin yaşandığı alanı gösterir. En büyük ders burada gizli.' },
  uranus:   { title: 'Devrim & Özgünlük', desc: 'Uranüs, kuralları yıktığın, sıra dışı olduğun ve aniden değişime uğradığın alanı temsil eder. İç isyancın burada yaşar.' },
  neptune:  { title: 'Hayal & Maneviyat', desc: 'Neptün, rüyalarını, sezgisel derinliğini ve manevi arayışını gösterir. İlhamın ve kaçış noktaların burada saklı.' },
  pluto:    { title: 'Dönüşüm & Güç', desc: 'Plüton, en derin dönüşümlerin, yıkım ve yeniden doğuşun yaşandığı alanı temsil eder. Karanlık gücün ve diriliş noktaların burada.' },
  northNode:{ title: 'Kaderin Yönü', desc: 'Kuzey Düğüm, bu hayatta öğrenmen gereken dersleri ve ruhsal evrimin yönünü gösterir. Konfor alanından çıkman gereken yer burada.' },
};

// ─── 12 EV TANIMLARI ─────────────────────────────────────────
export const HOUSE_DESCRIPTIONS = {
  1:  { title: 'Kimlik & Görünüş', desc: 'Dünyaya nasıl göründüğün, ilk izlenimin ve fiziksel varlığın. "Ben kimim?" sorusunun cevabı.', keywords: ['Fiziksel görünüş', 'İlk izlenim', 'Kişilik maskesi', 'Benlik ifadesi'] },
  2:  { title: 'Değerler & Kaynaklar', desc: 'Para, sahiplik, güvenlik duygusu ve özsaygın. Neye değer verdiğin ve maddi dünyayla ilişkin.', keywords: ['Gelir', 'Özsaygı', 'Maddi güvenlik', 'Yetenekler'] },
  3:  { title: 'İletişim & Yakın Çevre', desc: 'Konuşma tarzın, kısa yolculuklar, kardeşler ve günlük mental dünya. Bilgiyi nasıl alıp verdiğin.', keywords: ['Kardeşler', 'Komşular', 'Kısa yolculuklar', 'Öğrenme tarzı'] },
  4:  { title: 'Aile & Kökler', desc: 'Evin, ailen, çocukluğun ve duygusal temellerin. Kendini güvende hissettiğin yer ve iç huzurun.', keywords: ['Anne/baba', 'Ev ortamı', 'Duygusal kökler', 'İç huzur'] },
  5:  { title: 'Yaratıcılık & Aşk', desc: 'Romantik aşk, yaratıcı ifade, hobiler ve eğlence. Hayattan zevk aldığın ve kalbini açtığın alan.', keywords: ['Romantizm', 'Hobi', 'Çocuklar', 'Yaratıcılık', 'Eğlence'] },
  6:  { title: 'Sağlık & Günlük Rutinler', desc: 'Günlük çalışma düzenin, sağlık alışkanlıkların ve hizmet etme biçimin. Bedeninin mesajları.', keywords: ['Sağlık', 'İş rutini', 'Beslenme', 'Hizmet'] },
  7:  { title: 'İlişkiler & Ortaklıklar', desc: 'Birebir ilişkilerin, evlilik, iş ortaklıkları ve "öteki" ile kurduğun denge. Ayna tuttuğun yer.', keywords: ['Eş/partner', 'Evlilik', 'İş ortağı', 'Anlaşmalar'] },
  8:  { title: 'Dönüşüm & Gizem', desc: 'Derin dönüşüm, paylaşılan kaynaklar, cinsellik ve tabular. Hayatın ölüm-doğum döngüsü.', keywords: ['Miras', 'Paylaşılan gelir', 'Cinsellik', 'Psikolojik derinlik'] },
  9:  { title: 'Felsefe & Keşif', desc: 'Yüksek öğrenim, uzak yolculuklar, felsefi inançlar ve anlam arayışı. Ufkunu genişleten deneyimler.', keywords: ['Yabancı kültürler', 'Üniversite', 'Felsefe', 'Uzak seyahat'] },
  10: { title: 'Kariyer & Toplumsal Konum', desc: 'Kamusal imajın, kariyer hedeflerin ve dışarıya gösterdiğin başarı. "Hayatta ne başardın?" sorusu.', keywords: ['Kariyer', 'Toplumsal statü', 'Otorite', 'Amaç'] },
  11: { title: 'Topluluk & İdealler', desc: 'Arkadaş çevren, gruplar, sosyal ağların ve geleceğe dair umutların. Birlikte değişim yaratmak.', keywords: ['Arkadaşlar', 'Topluluklar', 'Gelecek vizyonu', 'İnsani idealler'] },
  12: { title: 'Bilinçaltı & Maneviyat', desc: 'Gizli düşmanlar, bilinçaltı kalıplar, yalnızlık anları ve ruhsal arayış. İçsel sessizliğin evi.', keywords: ['Rüyalar', 'İzolasyon', 'Geçmiş yaşam', 'Manevi arayış', 'Şifa'] },
};

// ─── MODALİTE TANIMLARI ──────────────────────────────────────
export const MODALITY_DESCRIPTIONS = {
  'Kardinal': { icon: '🚀', desc: 'Başlatıcı enerji — yeni döngüler açar, harekete geçirir ve liderlik eder. Koç, Yengeç, Terazi, Oğlak enerjisi.' },
  'Sabit':    { icon: '⚓', desc: 'Sürdürücü enerji — başlanılan işe tutunur, kararlılıkla devam eder. Boğa, Aslan, Akrep, Kova enerjisi.' },
  'Değişken': { icon: '🌊', desc: 'Uyum sağlayıcı enerji — esnek, adaptif ve çok yönlü. İkizler, Başak, Yay, Balık enerjisi.' },
};

// ─── ASPECT TİPİ TANIMLARI ───────────────────────────────────
export const ASPECT_TYPE_DESCRIPTIONS = {
  'Kavuşum':  { icon: '☌', desc: 'İki gezegen aynı noktada buluşur — enerjiler iç içe geçer, yoğun ve güçlü bir birleşim. Bu alan hayatında çok belirleyici.' },
  'Altmışlık':{ icon: '⚹', desc: 'Hafif ama destekleyici bir uyum — fırsatlar sunar ama senin adım atmanı bekler. Potansiyel altın madeni.' },
  'Kare':     { icon: '□', desc: 'İç gerilim ve sürtüşme — rahatsız eder ama tam da bu yüzden seni büyütür. En büyük dönüşümlerin motoru.' },
  'Üçgen':    { icon: '△', desc: 'Doğal yetenek ve akış — iki enerji uyum içinde çalışır. Bu armağanı kullanmak için özel çaba gerekmez.' },
  'Karşıt':   { icon: '☍', desc: 'Zıtlık ve denge arayışı — iki karşıt gücü dengelemeyi öğrendiğinde muazzam bir bütünlüğe ulaşırsın.' },
};

// ─── GEZEGEN × BURÇ YORUMLARI ────────────────────────────────
export const ASTRO_DICTIONARY = {
  sun: {
    'Koç': 'Lider ruhlu, cesur ve öncü. Hayata karşı savaşçı bir tutumla yaklaşırsın ve her engele kafa tutarsın.',
    'Boğa': 'Güvenilir, ayakları yere sağlam basan ve sabırlı. Hayatta estetik, sağlamlık ve dünyevi zevkler senin için önemlidir.',
    'İkizler': 'Zihni sürekli çalışan, meraklı ve sosyal. Bilgiye aç bir yapın var, her şeye kolay adapte olursun.',
    'Yengeç': 'Özünde çok duyarlı, şefkatli ve koruyucu. Kalbinin ve sezgilerinin rehberliğinde bir hayat yaşarsın.',
    'Aslan': 'Doğuştan parlayan, gururlu ve yaratıcı. Hayatın sahnesinde her zaman başrolde olmayı seversin.',
    'Başak': 'Analitik, mükemmelliyetçi ve hizmet odaklı. Her şeyin en ince detayını görür, kusursuzu ararsın.',
    'Terazi': 'Uyum, estetik ve adalet arayışında. İnsan ilişkilerinde diplomatik ve dengeleyici bir rol oynarsın.',
    'Akrep': 'Yüzeysellikten nefret eden, tutkulu ve derin. Dönüşüm senin doğanda var, küllerinden doğmayı bilirsin.',
    'Yay': 'Maceracı, felsefi ve özgürlüğüne düşkün. Hayat senin için keşfedilecek kocaman bir lisedir.',
    'Oğlak': 'Ciddi, sorumluluk sahibi ve hedefine kilitlenmiş. Başarı senin için bir seçenek değil, kaderdir.',
    'Kova': 'Yenilikçi, asi ve mantıklı. Toplumsal kuralları sorgular, tamamen kendi kurallarına göre yaşarsın.',
    'Balık': 'Kişinin özünde son derece duyarlı, empatik, hayal gücü yüksek ve yaratıcı biri olduğunu gösterir. Çevrendeki enerjileri çekersin.'
  },
  moon: {
    'Koç': 'Duygularını anında ve patlayıcı bir şekilde yaşarsın. Sabırsızsın ama öfken de samani alevi gibi çabuk söner.',
    'Boğa': 'İç dünyanda güvenlik ve huzur ararsın. Değişimden hoşlanmaz, sağlam ve kalıcı duygusal bağlar istersin.',
    'İkizler': 'Gün içinde duygularından ziyade mantığınla tepki verirsin. Konuşarak ve analiz ederek rahatlarsın.',
    'Yengeç': 'Duyguların son derece derin. Evine, ailene ve anılarına sımsıkı bağlı, adeta psişik bir empatisin.',
    'Aslan': 'Duygusal olarak onaylanmak ve takdir edilmek istersin. Kalbinde çok sıcak ve dramatik bir sevgi yatar.',
    'Başak': 'Duygularını sürekli analiz eder, "neden" diye sorarsın. Düzen ve kontrol sana kendini güvende hissettirir.',
    'Terazi': 'İçsel huzurun her zaman dış dünyadaki uyuma bağlı. Çatışmadan kaçar, her zaman bir denge ararsın.',
    'Akrep': 'Duygularını adeta bir okyanusun dibi gibi karanlık ve yoğun yaşarsın. Sevdiğinde tam sever, hiç unutmazsın.',
    'Yay': 'İç dünyanda özgür bir ruhsun. Sıkıntıya gelemez, duygusal krizlerden mizah veya macera ile kaçarsın.',
    'Oğlak': 'Duygularını göstermekte zorlanabilir, duvarlar örebilirsin. İçsel dünyanda bile çok prensipli ve kontrollüsün.',
    'Kova': 'Duygularını mantık süzgecinden geçirerek yaşarsın. Olaylara tamamen objektif ve mesafeli yaklaşabilirsin.',
    'Balık': 'Bilinçaltın çok zengin, rüyaların çok güçlü. Başkalarının acılarını bile kendi acın gibi hissedebilirsin.'
  },
  mercury: {
    'Koç': 'Düşüncelerin hızlı, dilin sivri. Sözünü esirgemezsin ve aklına geleni anında söylersin.',
    'Boğa': 'Mantığın ağır ve sabırlı çalışır. Bir şeyi öğrendiğin zaman asla unutmazsın, kalıcı hafızan vardır.',
    'İkizler': 'Zihnin adeta bir işlemci gibi hızlı. Çok boyutlu düşünebilir ve harika bir hatip olabilirsin.',
    'Yengeç': 'Kararlarını aklınla değil hislerinle alırsın. İletişimde çok korumacı ve sezgisel bir tarzın var.',
    'Aslan': 'Sözlerinle insanları etkilersin. Konuşmalarında hep bir gösteriş ve büyük bir özgüven vardır.',
    'Başak': 'Zihnin çok keskin ve pürüzsüz çalışır. Hataları anında görür, kelimeleri çok net ve özeleştirel seçersin.',
    'Terazi': 'Diplomatik bir sözcüsün. Herkesin ne duymak istediğini bilir, uzlaştırıcı bir dil kullanırsın.',
    'Akrep': 'Sırları çözmeyi, derin araştırmaları seversin. Sözlerin adeta bir ok gibi iğneleyici ve gerçekçidir.',
    'Yay': 'Doğrucu Davut. Düşünce yapın çok felsefi ama konuşurken patavatsızlığa varacak kadar samimisindir.',
    'Oğlak': 'Son derece organize, resmi ve ciddi düşünürsün. Zihnin her zaman bir yapı ve mantık arar.',
    'Kova': 'İletişimde zeki, sıra dışı ve ileri görüşlüsün. Kafan herkesten bir adım önde, vizyoner bir zihin.',
    'Balık': 'Mantığın şiirsel bir şekilde çalışır. Zihnin tamamen hayaller, müzik ve sezgilerle örülüdür.'
  },
  venus: {
    'Koç': 'Aşkta avcı ruhlusun. Tutku, hız ve macera ararsın; monotonluktan anında sıkılırsın.',
    'Boğa': 'Aşkta kalite, dokunuş ve lüks ararsın. Sadakat ve konfor senin kırmızı çizgendir.',
    'İkizler': 'Flörtöz ve zihinsel uyuma aşık. Biri senin aklını etkilemezse kalbini kazanamaz.',
    'Yengeç': 'Sevdiğin kişiye tam bir yuva olursun. Koruyucu ve tamamen adanmış bir aşk tarzın var.',
    'Aslan': 'Aşkı bir krallık gibi yaşarsın. Romantiktir, gösterişi sever ve en iyi muameleyi istersin.',
    'Başak': 'Aşkı hizmet olarak görürsün. Duygularını pratik adımlarla, fedakarlık yaparak gösterirsin.',
    'Terazi': 'İlişki kurmak senin doğan. Aşkta nezaket, estetik ve sonsuz bir romantizm ararsın.',
    'Akrep': 'Ya hep ya hiç! Aşkta saplantılı bir derinlik, tamamen ruhsal ve cinsel bir birleşme peşindesin.',
    'Yay': 'Aşkta özgürlük istersin. Birlikte seyahat edip öğreneceğin insanlarla büyük bir macera ararsın.',
    'Oğlak': 'İlişkilerde, değer yargılarında ve finansta ayakları yere basan, güvenilir ve ciddi adımlar atarsın.',
    'Kova': 'Arkadaşlıkla başlayan marjinal ilişkileri seversin. Geleneksel aşk kalıpları asla sana göre değil.',
    'Balık': 'Aşkta kurban/kurtarıcı rolüne düşebilirsin. Sınır tanımayan, ruhani ve karşılıksız bir sevgi istersin.'
  },
  mars: {
    'Koç': 'Ateşin efendisi. Cesur, korkusuz ve rekabetçi. Harekete geçmek senin doğanda var.',
    'Boğa': 'Öfken yavaştır ama bir kez patlarsa yıkar. Eylemlerin inadına kalıcı ve dayanıklıdır.',
    'İkizler': 'Enerjin o kadar dağınıktır ki aynı anda 5 işe birden girersin. Kelimelerin senin kılıcındır.',
    'Yengeç': 'Eylemlerini duyguların yönetir. Sadece ailen, köklerin ve inandığın insanlar için savaşırsın.',
    'Aslan': 'Göz önünde büyük tepkiler verirsin. Liderlik etme ve egonu savunma konusunda sonsuz enerjin var.',
    'Başak': 'Enerjini mükemmeliyeti sağlamak için harcarsın. Çalışkan, planlı ancak fazla eleştirel bir savaşçı.',
    'Terazi': 'Çatışmadan kaçan, pasif-agresif bir yapın var. Haklıyı savunmak için savaşır, kendi kavganı edemezsin.',
    'Akrep': 'Stratejik ve tehlikelisin. Sessizce bekler, ölümcül noktadan tek bir hamlede vurursun.',
    'Yay': 'Eyleme geçme tarzı hevesli, maceracı ve felsefidir. İnandığı şeyler uğruna savaşmayı seversin.',
    'Oğlak': 'Hedefine tırmanan inatçı bir keçi... Enerjin sonsuz disiplinli ve inanılmaz dayanıklıdır.',
    'Kova': 'Kuralları yıkmak için eyleme geçersin. İleri görüşlü ama tamamen asi, anarşist bir doğan var.',
    'Balık': 'Enerjini yönlendirmekte zorlanırsın. Fiziksel bir kavgaya girmek yerine manevi ve kaçak yolları seçersin.'
  },
  jupiter: {
    'Koç': 'Cesaretin ve girişimciliğin sana şans getirir. Risk aldığında büyürsün.',
    'Boğa': 'Sabır ve tutarlılık sana bolluk getirir. Maddi dünyada doğal bir çekim gücün var.',
    'İkizler': 'Bilgi toplamak ve paylaşmak sana kapılar açar. Birden fazla alanda şanslısın.',
    'Yengeç': 'Aile ve duygusal bağlar sana büyüme getirir. Şefkatin en büyük gücün.',
    'Aslan': 'Yaratıcılığın ve kendine güvenin sana şans getirir. Cömertliğin katlanarak döner.',
    'Başak': 'Detaylara verdiğin önem ve hizmet anlayışın seni büyütür. Mükemmeliyetçiliğin bir armağan.',
    'Terazi': 'İlişkiler ve ortaklıklar sana bolluk getirir. Adalet anlayışın seni yüceltir.',
    'Akrep': 'Dönüşüm ve derinlik sana güç verir. Krizleri fırsata çevirme yeteneğin var.',
    'Yay': 'Jüpiter kendi evinde — doğal bir şanssın. Felsefe, seyahat ve öğretme yeteneğin çok güçlü.',
    'Oğlak': 'Disiplin ve yapı sana uzun vadeli başarı getirir. Otoriten doğal olarak kabul görür.',
    'Kova': 'Yenilikçi fikirlerin ve sosyal vizyonun sana kapılar açar. Topluluk içinde şanslısın.',
    'Balık': 'Sezgilerin ve manevi derinliğin sana rehberlik eder. Sanat ve şifa alanlarında büyük potansiyel.'
  },
  saturn: {
    'Koç': 'Sabır öğrenmen gereken alan. Aceleciliğin frenlenmesi seni olgunlaştırır.',
    'Boğa': 'Maddi güvenlik alanında ciddi sınavlar. Gerçek değerin parada değil, özsaygıda olduğunu öğrenirsin.',
    'İkizler': 'İletişimde disiplin ve derinlik dersi. Yüzeysel bilgi değil, uzmanlaşma istenir.',
    'Yengeç': 'Duygusal sınırlar koyma dersi. Aile ilişkilerinde olgunlaşma ve bağımsızlaşma süreci.',
    'Aslan': 'Ego ve yaratıcılık alanında sınav. Gerçek özgüvenin dışarıdan onay değil, içsel kabul olduğunu öğrenirsin.',
    'Başak': 'Sağlık ve iş disiplini alanında ciddiyet. Mükemmeliyetçiliğin yapıcı hale gelmesi dersi.',
    'Terazi': 'İlişkilerde ciddi sorumluluk. Bağlanmaktan ya da yalnız kalmaktan hangisinin gerçek korku olduğunu öğrenirsin.',
    'Akrep': 'Güç ve kontrol ile ilgili derin dersler. Teslim olma ve güvenme sınavı.',
    'Yay': 'İnanç sistemi ve özgürlük anlayışında olgunlaşma. Sınırların aslında özgürlüğü mümkün kıldığını öğrenirsin.',
    'Oğlak': 'Satürn kendi evinde — kariyer ve otorite alanında güçlü ama ağır yükler. Sabır ile zirve.',
    'Kova': 'Toplumsal rol ve bireysellik arasında denge dersi. Farklı olmakla dışlanma korkusu arasındaki sınav.',
    'Balık': 'Manevi disiplin ve sınır koyma dersi. Hayal ile gerçek arasındaki çizgiyi netleştirme.'
  },
  uranus: {
    'Koç': 'Radikal bireysellik ve cesaret. Tamamen yeni yollar açma ihtiyacı güçlü.',
    'Boğa': 'Maddi dünyada devrim. Değer yargılarında ve finansal sistemlerde köklü değişimler.',
    'İkizler': 'İletişim ve teknolojidte sıra dışı yaklaşımlar. Zihinsel aydınlanmalar.',
    'Yengeç': 'Aile yapısında ve duygusal kalıplarda devrim. Geleneksel olmayan yuva anlayışı.',
    'Aslan': 'Yaratıcılıkta ve kendini ifadede sıra dışılık. Sanatsal devrimcilik.',
    'Başak': 'Sağlık ve çalışma düzeninde yenilikçi yaklaşımlar. Alternatif tıp ve teknoloji.',
    'Terazi': 'İlişki kalıplarında devrim. Alışılmadık ilişki biçimleri ve sosyal adalet çağrısı.',
    'Akrep': 'Psikolojik dönüşümde radikal deneyimler. Tabularla yüzleşme ve güç dinamiklerini yıkma.',
    'Yay': 'Eğitim ve felsefede devrimci yaklaşımlar. Özgürlük kavramının yeniden tanımlanması.',
    'Oğlak': 'Toplumsal yapılarda köklü değişim. Otorite figürlerine meydan okuma.',
    'Kova': 'Uranüs kendi evinde — toplumsal devrim, teknoloji ve insanlık idealleri en güçlü haliyle.',
    'Balık': 'Manevi alanda devrimsel uyanış. Kolektif bilinçaltında dönüşüm ve mistik deneyimler.'
  },
  neptune: {
    'Koç': 'Ruhani savaşçı. İlham ve hayal gücüyle eylem arasında bulanık sınırlar.',
    'Boğa': 'Maddi dünyada manevi arayış. Sanat ve doğa ile derin bağ.',
    'İkizler': 'İletişimde şiirsellik ve hayal gücü. Sözlerin büyülü bir etkisi olabilir.',
    'Yengeç': 'Duygusal ve sezgisel derinlik. Aile bağlarında idealleştirme ve hayal kırıklığı döngüsü.',
    'Aslan': 'Yaratıcılıkta ilahi ilham. Sanatsal ifadede sınır tanımayan bir hayal gücü.',
    'Başak': 'Hizmet idealinde kaybolma. Sağlıkta alternatif ve bütüncül yaklaşımlara yönelim.',
    'Terazi': 'Aşkta idealleştirme ve romantik hayaller. Mükemmel ilişki arayışında kaybolma riski.',
    'Akrep': 'En derin psikolojik sezgiler. Mistisizm ve okültizme çekim.',
    'Yay': 'Felsefi ve dini arayışta sonsuz genişleme. Guru/rehber figürlerine çekim.',
    'Oğlak': 'Toplumsal ideallerde hayal kırıklığı ve yeniden inşa. Pragmatik idealizm.',
    'Kova': 'Kolektif rüyalar ve insanlık idealleri. Teknoloji ve maneviyatın birleşimi.',
    'Balık': 'Neptün kendi evinde — sezgilerin en güçlü, hayal gücün sınırsız. Sanat, müzik ve şifada büyük potansiyel.'
  },
  pluto: {
    'Koç': 'Kimlik ve benliğin yıkılıp yeniden doğması. Radikal bireysel dönüşüm.',
    'Boğa': 'Değer yargılarında ve maddi dünyada derin dönüşüm. Sahiplik kavramının sorgulanması.',
    'İkizler': 'İletişim ve bilgi alanında güç mücadeleleri. Sözlerin yıkıcı veya dönüştürücü gücü.',
    'Yengeç': 'Aile dinamiklerinde derin dönüşüm. Duygusal kalıpların yıkılması ve yeniden inşası.',
    'Aslan': 'Yaratıcı güç ve kontrol temaları. Ego ölümü ve yeniden doğuş.',
    'Başak': 'Çalışma düzeni ve sağlıkta köklü dönüşüm. Mükemmeliyetçiliğin karanlık yüzü.',
    'Terazi': 'İlişkilerde güç dinamikleri ve derin dönüşüm. Bağımlılık vs bağımsızlık savaşı.',
    'Akrep': 'Plüton kendi evinde — en derin dönüşüm gücü. Karanlıkla yüzleşme ve küllerinden doğma.',
    'Yay': 'İnanç sistemlerinde radikal dönüşüm. Dogmaların yıkılması ve hakikatin peşinde koşma.',
    'Oğlak': 'Toplumsal yapılarda güç mücadeleleri ve derin dönüşüm. Otorite kavramının sorgulanması.',
    'Kova': 'Toplumsal ideallerde güç dönüşümü. Kolektif bilinçte radikal değişimler.',
    'Balık': 'Kolektif bilinçaltında derin dönüşüm. Ruhsal uyanış ve evrensel şifa enerjisi.'
  },
  northNode: {
    'Koç': 'Bu hayatta bağımsız olmayı ve kendi yolunu çizmeyi öğrenmen gerekiyor. Cesaret dersin.',
    'Boğa': 'Huzur ve sabırla değer üretmeyi öğrenmen gerekiyor. Kaos yerine sükûnet dersin.',
    'İkizler': 'İletişim kurmayı, merak duymayı ve esnek olmayı öğrenmen gerekiyor. Çok bilmişlik değil, öğrenme yolculuğu.',
    'Yengeç': 'Duygusal açılmayı ve yuva kurmayı öğrenmen gerekiyor. Kontrol yerine şefkat dersin.',
    'Aslan': 'Kalbinle yaşamayı ve sahneye çıkmayı öğrenmen gerekiyor. Kalabalıktan sıyrılma dersin.',
    'Başak': 'Detaylara dikkat etmeyi ve hizmet etmeyi öğrenmen gerekiyor. Kaos yerine düzen dersin.',
    'Terazi': 'İlişki kurmayı ve "biz" demeyi öğrenmen gerekiyor. Bireysellik yerine ortaklık dersin.',
    'Akrep': 'Derinlere dalmayı ve dönüşmeyi öğrenmen gerekiyor. Konfor yerine yoğunluk dersin.',
    'Yay': 'Büyük resmi görmeyi ve anlam aramayı öğrenmen gerekiyor. Detaylardan kurtulup vizyon dersin.',
    'Oğlak': 'Sorumluluk almayı ve disiplinli olmayı öğrenmen gerekiyor. Duygusallık yerine yapı dersin.',
    'Kova': 'Topluluk için çalışmayı ve özgün olmayı öğrenmen gerekiyor. Drama yerine insanlık dersin.',
    'Balık': 'Teslim olmayı ve evrenle bütünleşmeyi öğrenmen gerekiyor. Kontrol yerine akış dersin.'
  },
  ascendant: {
    'Koç': 'İlk izleniminde çok enerjik, doğrudan ve hatta biraz sabırsızsın. İnsanlar senin liderlik özelliklerini ve cesaretini hemen fark ederler.',
    'Boğa': 'Topraklanmış, sakin ve güven veren bir dış görünüşün var. Girdiğin ortamlarda kolay sarsılmayan ve estetiğiyle dikkat çeken birisin.',
    'İkizler': 'Herkesle hemen sohbete girebilen, meraklı ve çok hareketli bir imaj çizersin. Gözlerin hep bir şeyleri arar, bedenin asla tam durmaz.',
    'Yengeç': 'Dışarıdan yumuşak, hassas ve biraz içine kapalı görünebilirsin. Yeni insanlara alışman zaman alır ama bir o kadar da evcimen bir aura yayarsın.',
    'Aslan': 'Girdiğin odada herkesin dikkatini çekecek bir ışığın, sıcak bir enerjin ve asil bir duruşun var. Saçların veya postürün kendini belli eder.',
    'Başak': 'Derli toplu, dikkatli ve biraz mesafeli bir ilk izlenim bırakırsın. Olayları ve insanları önce analiz etmeyi, sonra dahil olmayı seçersin.',
    'Terazi': 'Son derece zarif, çekici ve diplomatik bir auraya sahipsin. İnsanlar seninle kolayca bağ kurar, dış görünüşünde her zaman bir uyum vardır.',
    'Akrep': 'İnsanlar üzerinde gizemli, yoğun ve biraz da nüfuz edici bir etki bırakırsın. Bakışların adeta karşındakinin ruhunu okur gibidir.',
    'Yay': 'Güler yüzlü, patavatsızca samimi ve rahat bir imajın var. Yeni maceralara her an hazır ve ortama neşe katan biri olarak tanınırsın.',
    'Oğlak': 'Genç yaşta bile olgun, ciddi ve güvenilir görünürsün. Girdiğin ortamlarda hemen bir otorite ve saygınlık hali yaratırsın.',
    'Kova': 'İnsanlar seni biraz farklı, entelektüel ama mesafeli bulur. Çok dost canlısı görünürsün ancak kendi kişisel alanına müdahale edilmesini sevmezsin.',
    'Balık': 'Sihirli, rüya gibi ve biraz da dalgın bir havan var. İnsanlar senin empatik yüzünü hemen fark edip dertlerini sana anlatma eğilimi gösterir.'
  }
};
