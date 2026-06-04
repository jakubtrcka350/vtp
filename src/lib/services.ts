export interface ServiceItem {
  slug: string;
  category: string;
  title: string;
  /** Short description — shown on the bento card */
  desc: string;
  /** Longer description — shown on the detail page */
  detail: string;
  photos: string[];
  gradient: string;
  /** If true the card shows a CTA button and is NOT linkable */
  cta?: boolean;
}

export const services: ServiceItem[] = [
  {
    slug: "vodo-topo-plyn",
    category: "Voda · Teplo · Plyn",
    title: "Vodo-topo-plyn",
    desc: "Kompletní instalace a rozvody vody, topení i plynu. Montáž kotlů, radiátorů, podlahového vytápění, koupelen a plynových spotřebičů. Opravy havárií i plánované rekonstrukce.",
    detail: `Zajišťujeme veškeré instalatérské práce — od rozvodů studené a teplé vody přes topné soustavy až po plynové instalace a spotřebiče.

Provádíme montáž a servis plynových kotlů, radiátorů, podlahového vytápění i kompletních koupelen. Ať jde o novou instalaci, rekonstrukci stávajících rozvodů nebo havárii, přijíždíme vybaveni a připraveni.

Pracujeme v bytech, rodinných domech i komerčních objektech. Každou zakázku řešíme individuálně s důrazem na kvalitu provedení, bezpečnost a trvanlivost.`,
    photos: [
      "/images/services/vtp/koupelna.jpeg",
      "/images/services/vtp/ocel_radiatory.jpeg",
      "/images/services/vtp/podlah_topeni.jpeg",
      "/images/services/vtp/poz_potrubi.jpeg",
    ],
    gradient: "from-[#0d1520] to-[#080e18]",
  },
  {
    slug: "cisteni-potrubi",
    category: "Čištění potrubí",
    title: "Čištění vodovodního a odpadního potrubí",
    desc: "Profesionální čištění vodovodního i odpadního potrubí vysokotlakým čištěním. Odstraňujeme usazeniny, ucpávky a inkrustace — bez zbytečného bourání.",
    detail: `Čistíme vodovodní i odpadní potrubí pomocí výkonných vysokotlakých zařízení. Efektivně odstraňujeme usazeniny, tuky, kořeny i zatvrdlé inkrustace — bez zbytečného bourání zdí nebo podlah.

Služba je vhodná pro domácnosti, bytové domy i průmyslové objekty. Pracujeme rychle a s minimálním zásahem do okolního prostředí.

Po vyčištění doporučujeme kontrolní průjezd kamerou pro ověření výsledku a odhalení případných dalších závad.`,
    photos: ["/images/services/cist_potrubi/cist_potrubi.jpeg"],
    gradient: "from-[#1a0e08] to-[#110a05]",
  },
  {
    slug: "kamerove-zkousky",
    category: "Diagnostika",
    title: "Kamerové zkoušky",
    desc: "Inspekce potrubí průmyslovou kamerou. Přesná diagnostika závad, prasklin a ucpávek s videozáznamem — ideální podklad pro opravu i pojistné události.",
    detail: `Kamerová inspekce potrubí umožňuje přesnou a neinvazivní diagnostiku závad — prasklin, korozí, ucpávek i nežádoucích napojení — bez nutnosti odkrývat potrubí.

Průběh inspekce zaznamenáváme na video a záznam předáváme zákazníkovi. Videodokumentace je ideálním podkladem pro plánování oprav, reklamační řízení i pojistné události.

Výsledkem je jasná zpráva o stavu potrubí, která šetří čas, peníze i zbytečné bourání.`,
    photos: ["/images/services/diagn/diagn.jpeg"],
    gradient: "from-[#0f1a0d] to-[#0a1108]",
  },
  {
    slug: "zednicke-prace",
    category: "Stavební práce",
    title: "Zednické a obkladačské práce",
    desc: "Kompletní zednické a obkladačské práce. Obklady a dlažby do koupelen, kuchyní i ostatních prostor. Přesné provedení, kvalitní materiály.",
    detail: `Provádíme kompletní zednické a obkladačské práce s důrazem na přesnost, čistotu spár a celkový estetický výsledek.

Klademe obklady a dlažby do koupelen, kuchyní, předsíní i venkovních teras. Věnujeme zvláštní péči správné přípravě podkladu, volbě vhodné spárovací hmoty a finálním detailům.

Spolupracujeme se zákazníkem při výběru materiálů a formátu dlaždic, aby výsledek přesně odpovídal jeho představám.`,
    photos: ["/images/services/zedn_prace/zednicke_prace.jpeg"],
    gradient: "from-[#141420] to-[#0d0d18]",
  },
  {
    slug: "konzultace",
    category: "Poradenství",
    title: "Konzultace zdarma",
    desc: "Nejste si jistí, jaké řešení je pro vás nejlepší? Poradíme vám zdarma a bez závazků. Zavolejte nebo napište.",
    detail: "",
    photos: ["/images/services/consult/handshake.jpg"],
    gradient: "from-[#1a1208] to-[#0f0d05]",
    cta: true,
  },
];
