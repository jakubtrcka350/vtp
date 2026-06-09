export interface SubService {
  title: string;
  desc: string;
}

export interface ServiceItem {
  slug: string;
  category: string;
  title: string;
  /** Short description — shown on the bento card */
  desc: string;
  /** Intro paragraph shown above the sub-services list on the detail page */
  detail: string;
  /** Individual sub-services listed on the detail page */
  subServices?: SubService[];
  photos: string[];
  gradient: string;
  /** If true the card shows a CTA button and is NOT linkable */
  cta?: boolean;
}

export const services: ServiceItem[] = [
  {
    slug: "vodo-topo-plyn",
    category: "Instalace",
    title: "Vodo · Topo · Plyn",
    desc: "Kompletní instalace rozvodů vody a odpadů, podlahové vytápění, tepelná čerpadla, kotle a obkladačské práce. Pracujeme v bytech, domech i komerčních objektech.",
    detail: "Zajišťujeme veškeré instalatérské a topenářské práce — od rozvodů vody a kanalizace přes vytápění až po obklady a dlažby. Každou zakázku řešíme individuálně s důrazem na kvalitu provedení a dlouhou životnost.",
    subServices: [
      {
        title: "Rozvody vody a odpadů",
        desc: "Kompletní realizace vodovodních a kanalizačních rozvodů pro rekonstrukce bytů, rodinných domů i komerčních objektů. Dbáme na kvalitní provedení, spolehlivý provoz a dlouhou životnost celého systému.",
      },
      {
        title: "Podlahové vytápění",
        desc: "Moderní a úsporné řešení vytápění, které zajišťuje rovnoměrné rozložení tepla v celém prostoru. Navrhujeme a realizujeme podlahové vytápění na míru podle požadavků zákazníka.",
      },
      {
        title: "Tepelná čerpadla, kotle a zdroje tepla",
        desc: "Montáž, výměna a zapojení tepelných čerpadel, plynových kotlů, kotlů na tuhá paliva i dalších zdrojů vytápění pro rodinné domy, bytové domy a komerční objekty. Pomůžeme s výběrem vhodného řešení a zajistíme profesionální realizaci.",
      },
      {
        title: "Kompletace sanity",
        desc: "Odborná montáž koupelnového vybavení včetně van, sprchových koutů, WC, umyvadel, baterií a další sanitární techniky až do finálního dokončení.",
      },
    ],
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
    category: "Servis & údržba",
    title: "Čištění potrubí",
    desc: "Profesionální čištění vodovodního, topného i odpadního potrubí. Odstraňujeme usazeniny, ucpávky a inkrustace — bez zbytečného bourání.",
    detail: "Čistíme vodovodní, topné i odpadní potrubí pomocí výkonných vysokotlakých zařízení. Pracujeme rychle, s minimálním zásahem do okolního prostředí a s garancí výsledku.",
    subServices: [
      {
        title: "Čištění vodovodního a topného potrubí",
        desc: "Odstranění usazenin a nečistot, které snižují průtok a účinnost systému. Pravidelné čištění pomáhá prodloužit životnost rozvodů i topných soustav.",
      },
      {
        title: "Čištění odpadního potrubí",
        desc: "Mechanické i tlakové čištění odpadů, odstranění ucpávek a obnovení plné průchodnosti kanalizačních systémů v domácnostech i komerčních objektech.",
      },
    ],
    photos: ["/images/services/cist_potrubi/cist_potrubi.jpeg"],
    gradient: "from-[#1a0e08] to-[#110a05]",
  },
  {
    slug: "kamerove-zkousky",
    category: "Diagnostika",
    title: "Kamerové prohlídky",
    desc: "Inspekce potrubí průmyslovou kamerou. Přesná diagnostika závad, prasklin a ucpávek s videozáznamem — bez zbytečného bourání.",
    detail: "Kamerová inspekce umožňuje přesnou a neinvazivní diagnostiku stavu potrubí. Průběh zaznamenáváme na video a předáváme zákazníkovi jako podklad pro opravy, reklamační řízení i pojistné události.",
    subServices: [
      {
        title: "Kamerové prohlídky odpadního potrubí",
        desc: "Diagnostika odpadních a kanalizačních systémů pomocí inspekční kamery. Přesně lokalizujeme závady, praskliny, netěsnosti nebo místa zanesení bez zbytečného bourání.",
      },
    ],
    photos: ["/images/services/diagn/diagn.jpeg"],
    gradient: "from-[#0f1a0d] to-[#0a1108]",
  },
  {
    slug: "stavebni-prace",
    category: "Rekonstrukce",
    title: "Zednické a obkladačské práce",
    desc: "Kompletní stavební a zednické práce — zdění příček, omítky, obklady, bourání, překlady i kompletace sanity. Přesné provedení a kvalitní materiály.",
    detail: "Provádíme kompletní stavební a zednické práce v rámci rekonstrukcí i novostaveb. Spolupracujeme se zákazníkem od první konzultace až po finální předání hotového díla.",
    subServices: [
      {
        title: "Zdění stěn a příček",
        desc: "Realizace zděných konstrukcí, příček a dalších zednických prací při rekonstrukcích a stavebních úpravách. Důraz klademe na přesné provedení, kvalitu a dlouhou životnost výsledného díla.",
      },
      {
        title: "Omítky a štuky",
        desc: "Vnitřní i venkovní omítky, štukové úpravy a finální povrchové práce pro kvalitní a estetický vzhled stěn.",
      },
      {
        title: "Příčky a stavební úpravy",
        desc: "Výstavba nových příček, změny dispozic bytů a domů a další stavební úpravy podle požadavků zákazníka.",
      },
      {
        title: "Bourací práce",
        desc: "Bourání příček, vysekávání drážek pro instalace, odstranění obkladů, dlažeb a dalších konstrukcí v rámci rekonstrukcí.",
      },
      {
        title: "Překlady a vyzdívky",
        desc: "Osazování překladů, úpravy stavebních otvorů, zazdívky a další zednické práce související s rekonstrukcemi.",
      },
      {
        title: "Obklady a dlažby",
        desc: "Profesionální pokládka obkladů a dlažeb v koupelnách, technických místnostech, na terasách i dalších plochách.",
      },
    ],
    photos: ["/images/services/zedn_prace/zednicke_prace.jpg"],
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
