// Büyük düşünürlerden günlük farkındalık alıntıları
// Seed bazlı günlük seçim için kullanılır

export const PHILOSOPHER_QUOTES = [
  { text: "Engel, yolun ta kendisidir.", author: "Marcus Aurelius" },
  { text: "Kaybettiğin zaman değil, kendini kaybettiğinde yenilirsin.", author: "Seneca" },
  { text: "Sessiz ol ve dinle. Susmak, bilgeliğin başlangıcıdır.", author: "Rumi" },
  { text: "Hayal gücü, bilgiden daha önemlidir.", author: "Albert Einstein" },
  { text: "Başkalarını tanıyan akıllıdır; kendini tanıyan aydınlanmıştır.", author: "Lao Tzu" },
  { text: "Zihniniz her şeydir. Ne düşünürsek, o oluruz.", author: "Buda" },
  { text: "İnsanları rahatsız eden olaylar değil, onlar hakkındaki düşüncelerdir.", author: "Epiktetos" },
  { text: "Tek bildiğim, hiçbir şey bilmediğimdir.", author: "Sokrates" },
  { text: "Her şey alınabilir insandan—son özgürlük hariç.", author: "Viktor Frankl" },
  { text: "Hiçbir şeyin sabit olmadığı dışında her şey değişir.", author: "Herakleitos" },
  { text: "Gölgenizle yüzleşmek, en büyük cesarettir.", author: "Carl Gustav Jung" },
  { text: "Bir eylem alışkanlık haline geldiğinde, karakter olur.", author: "Aristoteles" },
  { text: "Güzellik, gerçeğin parıltısıdır.", author: "Platon" },
  { text: "Güzellik dünyayı kurtaracak.", author: "Dostoyevski" },
  { text: "Öğrenme, tek hakiki eğlencedir.", author: "Leonardo da Vinci" },
  { text: "Kendin olmak istediğin değişim ol.", author: "Mahatma Gandhi" },
  { text: "İki şey beni hayrette bırakır: yıldızlı gökyüzü ve içimdeki ahlak yasası.", author: "Immanuel Kant" },
  { text: "İnsanın tüm mutsuzluğu, yalnız oturmayı bilmemesinden gelir.", author: "Blaise Pascal" },
  { text: "Sayılar, evrenin düzenini barındırır.", author: "Pisagor" },
  { text: "Gönül, bütün suretleri kabul eden bir aynadır.", author: "İbn Arabi" },
  { text: "Ne olursan ol, gel. Aramak için gel.", author: "Mevlana" },
  { text: "Hayat bir yolculuk değil, dans etmek için müziktir.", author: "Alan Watts" },
  { text: "Acınız, anlayışınızın kırıldığı yerdir.", author: "Khalil Gibran" },
  { text: "Dil, varlığın evidir.", author: "Martin Heidegger" },
  { text: "Sevilmek değil, sevmek mutlu eder.", author: "Fyodor Dostoyevski" },
  { text: "En uzun yolculuk içe doğru olandır.", author: "Dag Hammarskjöld" },
  { text: "Karanlık olmadan yıldızları göremezsin.", author: "Martin Luther King Jr." },
  { text: "Korku yokluğu değil, korku karşısında hareket etmektir cesaret.", author: "Mark Twain" },
  { text: "Bilinç, evreni kendi üzerinde düşünen evrendir.", author: "Carl Sagan" },
  { text: "Geçmiş bir hatıra, gelecek bir hayaldir; gerçek olan yalnızca şu andır.", author: "Buda" },
];

/**
 * Seed bazlı günlük alıntı seçimi
 * @param {number} seed - Günlük deterministik seed
 * @returns {{ text: string, author: string }}
 */
export function getDailyQuote(seed) {
  const index = seed % PHILOSOPHER_QUOTES.length;
  return PHILOSOPHER_QUOTES[index];
}
