import type { Atgardstyp, Omrade } from '../types';

// Säkerhetsåtgärdsområden — Cybersäkerhetslagen (2025:1506) 2 kap. 1 § / NIS2 Art. 21.2

export const KATEGORIER: Record<Atgardstyp, { label: string; horisont: string }> = {
  policy:  { label: 'Policy & styrning',         horisont: 'Omedelbart · 0–4 veckor' },
  process: { label: 'Process & utbildning',      horisont: 'Kort sikt · 1–3 månader' },
  teknik:  { label: 'Teknik & infrastruktur',    horisont: 'Medellång sikt · 3–12 månader' }
};

export const OMRADEN: readonly Omrade[] = [
  {
    id: 1, nr: '01', kategori: 'policy',
    title: 'Riskanalys och informationssystemens säkerhet',
    paragraf: '2 kap. 1 § p. 1', artikel: 'Art. 21.2(a)',
    iso: 'ISO 27001 · A.5.1, A.5.2, klausul 6.1',
    beskrivning: 'Strategier för riskanalys och systematiskt informationssäkerhetsarbete.',
    fragor: [
      { id: '1.1', text: 'Finns en dokumenterad och av ledningen beslutad informationssäkerhetspolicy?' },
      { id: '1.2', text: 'Genomförs systematiska riskanalyser minst årligen?' },
      { id: '1.3', text: 'Finns en uppdaterad förteckning över verksamhetens informationstillgångar?' },
      { id: '1.4', text: 'Är riskhanteringsåtgärder förankrade och godkända av ledningsgruppen?' }
    ]
  },
  {
    id: 2, nr: '02', kategori: 'process',
    title: 'Incidenthantering',
    paragraf: '2 kap. 1 § p. 2', artikel: 'Art. 21.2(b)',
    iso: 'ISO 27001 · A.5.24–A.5.27',
    beskrivning: 'Förmåga att upptäcka, hantera och rapportera betydande incidenter.',
    fragor: [
      { id: '2.1', text: 'Finns en dokumenterad incidenthanteringsprocess?' },
      { id: '2.2', text: 'Finns rutiner för att rapportera tidig varning till MCF inom 24 timmar?' },
      { id: '2.3', text: 'Finns rutiner för incidentanmälan inom 72 timmar och slutrapport inom en månad?' },
      { id: '2.4', text: 'Genomförs incidentövningar minst årligen?' }
    ]
  },
  {
    id: 3, nr: '03', kategori: 'process',
    title: 'Driftskontinuitet och krishantering',
    paragraf: '2 kap. 1 § p. 3', artikel: 'Art. 21.2(c)',
    iso: 'ISO 27001 · A.5.29, A.5.30, A.8.13',
    beskrivning: 'Säkerhetskopiering, återställning och krishantering.',
    fragor: [
      { id: '3.1', text: 'Finns en dokumenterad kontinuitetsplan (BCP) för verksamheten?' },
      { id: '3.2', text: 'Finns dokumenterade rutiner för säkerhetskopiering och återställning?' },
      { id: '3.3', text: 'Testas återställning av kritiska system minst årligen?' },
      { id: '3.4', text: 'Finns en kris- och katastrofplan med definierade roller?' }
    ]
  },
  {
    id: 4, nr: '04', kategori: 'process',
    title: 'Leverantörskedjesäkerhet',
    paragraf: '2 kap. 1 § p. 4', artikel: 'Art. 21.2(d)',
    iso: 'ISO 27001 · A.5.19–A.5.23',
    beskrivning: 'Säkerhetsaspekter i förhållande till direkta leverantörer och tjänsteleverantörer.',
    fragor: [
      { id: '4.1', text: 'Finns dokumenterade säkerhetskrav i avtal med kritiska leverantörer?' },
      { id: '4.2', text: 'Genomförs säkerhetsbedömningar av nya leverantörer innan kontrakt tecknas?' },
      { id: '4.3', text: 'Övervakas säkerhetsläget hos kritiska leverantörer löpande?' }
    ]
  },
  {
    id: 5, nr: '05', kategori: 'teknik',
    title: 'Säkerhet i förvärv, utveckling och underhåll',
    paragraf: '2 kap. 1 § p. 5', artikel: 'Art. 21.2(e)',
    iso: 'ISO 27001 · A.8.25–A.8.34',
    beskrivning: 'Säkerhet vid anskaffning, utveckling och underhåll av nät- och informationssystem.',
    fragor: [
      { id: '5.1', text: 'Finns dokumenterade säkerhetskrav i systemutvecklingsprocessen?' },
      { id: '5.2', text: 'Genomförs säkerhetstester (penetrationstest/sårbarhetsskanning) innan driftsättning?' },
      { id: '5.3', text: 'Hanteras sårbarheter och säkerhetsuppdateringar enligt en formell process?' }
    ]
  },
  {
    id: 6, nr: '06', kategori: 'policy',
    title: 'Effektivitetsbedömning av säkerhetsåtgärder',
    paragraf: '2 kap. 1 § p. 6', artikel: 'Art. 21.2(f)',
    iso: 'ISO 27001 · klausul 9.1, 9.2',
    beskrivning: 'Riktlinjer och rutiner för att bedöma effektiviteten i åtgärderna för cyberriskhantering.',
    fragor: [
      { id: '6.1', text: 'Finns mätetal (KPI:er) för cybersäkerhetsarbetet?' },
      { id: '6.2', text: 'Genomförs interna säkerhetsrevisioner minst årligen?' },
      { id: '6.3', text: 'Rapporteras säkerhetsläget till ledningen minst kvartalsvis?' }
    ]
  },
  {
    id: 7, nr: '07', kategori: 'process',
    title: 'Cyberhygien och utbildning',
    paragraf: '2 kap. 1 § p. 7 / 2 kap. 4 §', artikel: 'Art. 21.2(g) / Art. 20.2',
    iso: 'ISO 27001 · A.6.3, A.5.4',
    beskrivning: 'Grundläggande cyberhygien och obligatorisk utbildning, inklusive ledningens utbildning.',
    fragor: [
      { id: '7.1', text: 'Får alla medarbetare regelbunden cybersäkerhetsutbildning?' },
      { id: '7.2', text: 'Har ledningen genomgått obligatorisk utbildning enligt 2 kap. 4 §?' },
      { id: '7.3', text: 'Finns dokumenterade riktlinjer för cyberhygien (lösenord, phishing, BYOD)?' },
      { id: '7.4', text: 'Genomförs phishing-simuleringar för att mäta medvetenhet?' }
    ]
  },
  {
    id: 8, nr: '08', kategori: 'teknik',
    title: 'Kryptografi',
    paragraf: '2 kap. 1 § p. 8', artikel: 'Art. 21.2(h)',
    iso: 'ISO 27001 · A.8.24',
    beskrivning: 'Riktlinjer och rutiner för användning av kryptografi och, vid behov, kryptering.',
    fragor: [
      { id: '8.1', text: 'Finns en dokumenterad krypteringspolicy?' },
      { id: '8.2', text: 'Krypteras känsliga uppgifter både i vila och i transit?' },
      { id: '8.3', text: 'Hanteras krypteringsnycklar enligt en formell process?' }
    ]
  },
  {
    id: 9, nr: '09', kategori: 'teknik',
    title: 'Personalsäkerhet och åtkomstkontroll',
    paragraf: '2 kap. 1 § p. 9', artikel: 'Art. 21.2(i)',
    iso: 'ISO 27001 · A.5.15–A.5.18, A.6.1–A.6.5',
    beskrivning: 'Säkerhet kring personal, åtkomststyrning och tillgångsförvaltning.',
    fragor: [
      { id: '9.1', text: 'Tillämpas principen om minsta privilegium (least privilege) för åtkomst?' },
      { id: '9.2', text: 'Genomförs säkerhetsprövning vid säkerhetskritiska anställningar?' },
      { id: '9.3', text: 'Återkallas åtkomst omedelbart vid avslutad anställning?' },
      { id: '9.4', text: 'Genomförs regelbunden åtkomstöversyn (access review)?' }
    ]
  },
  {
    id: 10, nr: '10', kategori: 'teknik',
    title: 'MFA, säker kommunikation och nödkommunikation',
    paragraf: '2 kap. 1 § p. 10', artikel: 'Art. 21.2(j)',
    iso: 'ISO 27001 · A.5.14, A.8.5, A.8.20–A.8.21',
    beskrivning: 'Multifaktorautentisering, säkrade kommunikationskanaler och nödkommunikationssystem.',
    fragor: [
      { id: '10.1', text: 'Används MFA för all administrativ och privilegierad åtkomst?' },
      { id: '10.2', text: 'Används MFA för all extern åtkomst till verksamhetskritiska system?' },
      { id: '10.3', text: 'Finns säkra kommunikationskanaler för känslig information?' },
      { id: '10.4', text: 'Finns nödkommunikationssystem som fungerar vid större incidenter?' }
    ]
  }
];
