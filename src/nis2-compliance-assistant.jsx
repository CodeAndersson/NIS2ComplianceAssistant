import React, { useState, useMemo } from 'react';

// =============================================================================
// DATA — Cybersäkerhetslagen (2025:1506) 2 kap. 1 § / NIS2 Art. 21.2
// =============================================================================

const SEKTORER_BILAGA_1 = [
  'Energi', 'Transport', 'Bank- och finansmarknad', 'Hälso- och sjukvård',
  'Dricksvatten', 'Avloppsvatten', 'Digital infrastruktur',
  'IKT-tjänsteförvaltning (B2B)', 'Offentlig förvaltning', 'Rymd'
];

const SEKTORER_BILAGA_2 = [
  'Post- och budtjänster', 'Avfallshantering',
  'Tillverkning, produktion och distribution av kemikalier',
  'Produktion, bearbetning och distribution av livsmedel',
  'Tillverkning', 'Digitala leverantörer', 'Forskning'
];

// Mappning sektor → behörig sektorsmyndighet enligt cybersäkerhetsförordningen (2025:1507)
// MCF har samordnande roll; sektorsmyndigheter utövar faktisk tillsyn
const SEKTOR_MYNDIGHET = {
  'Energi':                                                  { myndighet: 'Energimyndigheten',         webb: 'energimyndigheten.se' },
  'Transport':                                               { myndighet: 'Transportstyrelsen',        webb: 'transportstyrelsen.se' },
  'Bank- och finansmarknad':                                 { myndighet: 'Finansinspektionen',        webb: 'fi.se' },
  'Hälso- och sjukvård':                                     { myndighet: 'Inspektionen för vård och omsorg (IVO)', webb: 'ivo.se' },
  'Dricksvatten':                                            { myndighet: 'Livsmedelsverket',          webb: 'livsmedelsverket.se' },
  'Avloppsvatten':                                           { myndighet: 'Naturvårdsverket',          webb: 'naturvardsverket.se' },
  'Digital infrastruktur':                                   { myndighet: 'Post- och telestyrelsen (PTS)', webb: 'pts.se' },
  'IKT-tjänsteförvaltning (B2B)':                            { myndighet: 'Post- och telestyrelsen (PTS)', webb: 'pts.se' },
  'Offentlig förvaltning':                                   { myndighet: 'Myndigheten för civilt försvar (MCF)', webb: 'mcf.se' },
  'Rymd':                                                    { myndighet: 'Myndigheten för civilt försvar (MCF)', webb: 'mcf.se' },
  'Post- och budtjänster':                                   { myndighet: 'Post- och telestyrelsen (PTS)', webb: 'pts.se' },
  'Avfallshantering':                                        { myndighet: 'Naturvårdsverket',          webb: 'naturvardsverket.se' },
  'Tillverkning, produktion och distribution av kemikalier': { myndighet: 'Kemikalieinspektionen',     webb: 'kemi.se' },
  'Produktion, bearbetning och distribution av livsmedel':   { myndighet: 'Livsmedelsverket',          webb: 'livsmedelsverket.se' },
  'Tillverkning':                                            { myndighet: 'Myndigheten för civilt försvar (MCF)', webb: 'mcf.se' },
  'Digitala leverantörer':                                   { myndighet: 'Post- och telestyrelsen (PTS)', webb: 'pts.se' },
  'Forskning':                                               { myndighet: 'Myndigheten för civilt försvar (MCF)', webb: 'mcf.se' }
};

const KATEGORIER = {
  policy:  { label: 'Policy & styrning',         horisont: 'Omedelbart · 0–4 veckor' },
  process: { label: 'Process & utbildning',      horisont: 'Kort sikt · 1–3 månader' },
  teknik:  { label: 'Teknik & infrastruktur',    horisont: 'Medellång sikt · 3–12 månader' }
};

const INCIDENT_FRISTER = [
  { tid: '24 h',  titel: 'Tidig varning',     text: 'Initial notifiering till MCF vid misstanke om betydande incident.' },
  { tid: '72 h',  titel: 'Incidentanmälan',   text: 'Detaljerad rapport: omfattning, troliga orsaker och vidtagna åtgärder.' },
  { tid: '1 mån', titel: 'Slutrapport',       text: 'Slutgiltig analys: rotorsak och långsiktiga förbättringar.' }
];

const OMRADEN = [
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

// =============================================================================
// LOGIK
// =============================================================================

const SVARSTYP = { JA: 'ja', DELVIS: 'delvis', NEJ: 'nej' };
const SVARSPOANG = { ja: 1, delvis: 0.5, nej: 0 };

function bedomOmfattning({ sektor, anstallda, omsattning }) {
  if (!sektor || sektor === 'ingen') {
    return { status: 'ej-omfattad', kategori: null,
      forklaring: 'Verksamheten tillhör ingen av sektorerna i bilaga 1 eller 2 till NIS2-direktivet.' };
  }
  const stort = anstallda === '250+' || omsattning === '50+';
  if (anstallda === 'under-50' && omsattning === 'under-10') {
    return { status: 'ej-omfattad', kategori: null,
      forklaring: 'Verksamheten ligger under tröskelvärdena (minst 50 anställda eller 10 MEUR omsättning). Notera att vissa kritiska verksamheter omfattas oavsett storlek — kontrollera MCFFS 2026:1.' };
  }
  const arBilaga1 = SEKTORER_BILAGA_1.includes(sektor);
  if (arBilaga1 && stort) {
    return { status: 'omfattad', kategori: 'vasentlig',
      forklaring: 'Stor verksamhet inom en sektor med hög kritikalitet (bilaga 1). Klassificeras som väsentlig verksamhetsutövare.' };
  }
  return { status: 'omfattad', kategori: 'viktig',
    forklaring: arBilaga1
      ? 'Medelstor verksamhet inom en sektor med hög kritikalitet (bilaga 1). Klassificeras som viktig verksamhetsutövare.'
      : 'Verksamhet inom en annan kritisk sektor (bilaga 2). Klassificeras som viktig verksamhetsutövare.' };
}

function beraknaScore(svar) {
  return OMRADEN.map(omrade => {
    const max = omrade.fragor.length;
    const summa = omrade.fragor.reduce((s, f) => s + (SVARSPOANG[svar[f.id]] ?? 0), 0);
    const procent = max > 0 ? (summa / max) * 100 : 0;
    const niva = procent >= 80 ? 'hog' : procent >= 40 ? 'medel' : 'lag';
    const besvarade = omrade.fragor.filter(f => svar[f.id]).length;
    return { ...omrade, procent, niva, besvarade, totalt: max };
  });
}

// =============================================================================
// STIL
// =============================================================================

const STIL = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

.nis2-app * { box-sizing: border-box; }
.nis2-app {
  --bg: #F4EFE6;
  --bg-elevated: #FBF8F1;
  --ink: #0F1B2D;
  --ink-soft: #4A5568;
  --ink-mute: #8A8578;
  --rule: #D9D2C2;
  --rule-soft: #E8E2D3;
  --accent: #1B3A5C;
  --accent-warm: #B8732B;
  --success: #2F5233;
  --warning: #C9974C;
  --danger: #8B2635;
  font-family: 'Geist', system-ui, sans-serif;
  color: var(--ink);
  background: var(--bg);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.01em;
}
.nis2-app .display { font-family: 'Fraunces', Georgia, serif; font-weight: 500; letter-spacing: -0.02em; line-height: 1.05; }
.nis2-app .mono { font-family: 'Geist Mono', monospace; font-feature-settings: "tnum"; }
.nis2-app .smallcaps { text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; font-weight: 500; }
.nis2-app .paragraph-mark { font-family: 'Fraunces', Georgia, serif; font-weight: 400; font-style: italic; }
.nis2-app button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; font-size: inherit; }
.nis2-app button:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.nis2-app .btn-primary {
  background: var(--ink); color: var(--bg-elevated); padding: 0.85rem 1.6rem;
  border-radius: 999px; font-weight: 500; font-size: 0.95rem;
  transition: transform 0.15s ease, background 0.2s ease;
}
.nis2-app .btn-primary:hover { background: var(--accent); transform: translateY(-1px); }
.nis2-app .btn-secondary {
  background: transparent; color: var(--ink); padding: 0.85rem 1.6rem;
  border: 1px solid var(--ink); border-radius: 999px; font-weight: 500; font-size: 0.95rem;
  transition: background 0.2s ease, color 0.2s ease;
}
.nis2-app .btn-secondary:hover { background: var(--ink); color: var(--bg-elevated); }
.nis2-app .btn-ghost { color: var(--ink-soft); padding: 0.5rem 0; font-size: 0.9rem; text-decoration: underline; text-decoration-thickness: 0.5px; text-underline-offset: 4px; }
.nis2-app .btn-ghost:hover { color: var(--ink); }
.nis2-app .field-radio {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.85rem 1rem; border: 1px solid var(--rule); border-radius: 8px;
  cursor: pointer; transition: all 0.15s ease; background: var(--bg-elevated);
}
.nis2-app .field-radio:hover { border-color: var(--ink-soft); }
.nis2-app .field-radio.selected { border-color: var(--ink); background: var(--ink); color: var(--bg-elevated); }
.nis2-app .field-radio input { display: none; }
.nis2-app select {
  font-family: inherit; font-size: 1rem; padding: 0.85rem 1rem; width: 100%;
  border: 1px solid var(--rule); background: var(--bg-elevated); color: var(--ink);
  border-radius: 8px; appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%230F1B2D' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 1rem center;
}
.nis2-app .progress-track { height: 2px; background: var(--rule-soft); position: relative; overflow: hidden; }
.nis2-app .progress-fill { position: absolute; left: 0; top: 0; height: 100%; background: var(--ink); transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
.nis2-app .answer-pill {
  padding: 0.5rem 1rem; border-radius: 999px; font-size: 0.875rem; font-weight: 500;
  border: 1px solid var(--rule); background: var(--bg-elevated); transition: all 0.15s;
}
.nis2-app .answer-pill:hover { border-color: var(--ink-soft); }
.nis2-app .answer-pill.selected-ja { background: var(--success); color: white; border-color: var(--success); }
.nis2-app .answer-pill.selected-delvis { background: var(--warning); color: white; border-color: var(--warning); }
.nis2-app .answer-pill.selected-nej { background: var(--danger); color: white; border-color: var(--danger); }
.nis2-app .score-bar { height: 6px; background: var(--rule-soft); border-radius: 999px; overflow: hidden; }
.nis2-app .score-bar-fill { height: 100%; transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); border-radius: 999px; }
.nis2-app .niva-hog { background: var(--success); }
.nis2-app .niva-medel { background: var(--warning); }
.nis2-app .niva-lag { background: var(--danger); }
.nis2-app .card {
  background: var(--bg-elevated); border: 1px solid var(--rule); border-radius: 12px;
  transition: border-color 0.2s ease;
}
.nis2-app .card:hover { border-color: var(--ink-soft); }
.nis2-app .timeline {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem; position: relative;
}
.nis2-app .timeline-node { position: relative; }
.nis2-app .timeline-circle {
  width: 56px; height: 56px; border-radius: 50%; background: var(--bg);
  border: 1.5px solid var(--ink); display: flex; align-items: center; justify-content: center;
  margin-bottom: 1.25rem; position: relative; z-index: 2;
}
.nis2-app .timeline-line {
  position: absolute; top: 28px; left: 56px; right: -2rem; height: 1px;
  background: var(--rule); z-index: 1;
}
@media (max-width: 720px) { .nis2-app .timeline-line { display: none; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.nis2-app .fade-up { animation: fadeUp 0.4s ease-out backwards; }
@media (max-width: 720px) { .nis2-app .desktop-only { display: none; } }
`;

// =============================================================================
// KOMPONENTER
// =============================================================================

function Header({ vy, gaTillStart }) {
  return (
    <header style={{ borderBottom: '1px solid var(--rule)', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 2rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={gaTillStart} style={{ textAlign: 'left', display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
          <span className="paragraph-mark" style={{ fontSize: '1.4rem', color: 'var(--accent-warm)' }}>§</span>
          <span className="display" style={{ fontSize: '1.05rem' }}>NIS2 Compliance Assistant</span>
        </button>
        <div className="smallcaps desktop-only" style={{ color: 'var(--ink-mute)' }}>
          {vy === 'intro' && 'Start'}
          {vy === 'wizard' && 'Steg 1 av 2 — Omfattningsbedömning'}
          {vy === 'gap' && 'Steg 2 av 2 — Gap-analys'}
          {vy === 'resultat' && 'Resultat'}
        </div>
      </div>
    </header>
  );
}

function IntroVy({ onStart }) {
  return (
    <div className="fade-up" style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 2rem 4rem' }}>
      <div className="smallcaps" style={{ color: 'var(--accent-warm)', marginBottom: '2rem' }}>
        Cybersäkerhetslagen (2025:1506) — Verktyg för självbedömning
      </div>
      <h1 className="display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', marginBottom: '2rem', maxWidth: '20ch' }}>
        Är er verksamhet redo för <em style={{ fontStyle: 'italic', color: 'var(--accent-warm)' }}>NIS2</em><span style={{ marginLeft: '0.12em' }}>?</span>
      </h1>
      <p style={{ fontSize: '1.15rem', lineHeight: '1.6', color: 'var(--ink-soft)',
                  maxWidth: '60ch', marginBottom: '3rem' }}>
        Sedan 15 januari 2026 ställer cybersäkerhetslagen nya krav på fler än 18 000
        svenska organisationer. Det här verktyget hjälper er att avgöra om ni omfattas,
        bedöma er nuvarande mognad mot lagens tio säkerhetsåtgärdsområden, och
        identifiera de viktigaste luckorna att åtgärda.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '5rem' }}>
        <button className="btn-primary" onClick={onStart}>Starta bedömning →</button>
        <button className="btn-ghost" onClick={() => alert('Källor: Cybersäkerhetslagen (2025:1506), Cybersäkerhetsförordningen (2025:1507), Prop. 2025/26:28, MCFFS 2026:1, NIS2-direktivet (EU 2022/2555).')}>
          Källor och underlag
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '0', borderTop: '1px solid var(--rule)' }}>
        {[
          { nr: '01', titel: 'Omfattningsbedömning', txt: 'Avgör om verksamheten klassas som väsentlig eller viktig enligt lagens tröskelvärden.' },
          { nr: '02', titel: 'Gap-analys', txt: 'Mognadsbedömning mot tio säkerhetsåtgärdsområden i 2 kap. 1 § cybersäkerhetslagen.' },
          { nr: '03', titel: 'Prioriterade åtgärder', txt: 'Konkreta nästa steg utifrån identifierade brister, viktade efter risk.' },
        ].map(s => (
          <div key={s.nr} style={{ padding: '2rem 1.5rem 0 0' }}>
            <div className="mono" style={{ color: 'var(--ink-mute)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{s.nr}</div>
            <div className="display" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{s.titel}</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: '1.5' }}>{s.txt}</p>
          </div>
        ))}
      </div>

      <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--rule)' }}>
        <div className="smallcaps" style={{ color: 'var(--accent-warm)', marginBottom: '1rem' }}>
          Skärpta krav i NIS2
        </div>
        <h2 className="display" style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', marginBottom: '0.75rem', maxWidth: '24ch' }}>
          Tre rapporteringsfrister vid betydande incidenter
        </h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: '3rem', maxWidth: '60ch', fontSize: '0.95rem' }}>
          Tidsfristerna är en av de mest påtagliga skillnaderna mot tidigare NIS-lagstiftning och
          en kritisk del av efterlevnaden enligt 3 kap. cybersäkerhetslagen.
        </p>
        <div className="timeline">
          {INCIDENT_FRISTER.map((f, i) => (
            <div key={i} className="timeline-node">
              {i < INCIDENT_FRISTER.length - 1 && <div className="timeline-line" />}
              <div className="timeline-circle">
                <span className="mono" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{f.tid}</span>
              </div>
              <div className="display" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{f.titel}</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function WizardVy({ omfattning, setOmfattning, onNasta, onTillbaka }) {
  const klar = omfattning.sektor && omfattning.anstallda && omfattning.omsattning;
  const bedomning = klar ? bedomOmfattning(omfattning) : null;

  return (
    <div className="fade-up" style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div className="smallcaps" style={{ color: 'var(--accent-warm)', marginBottom: '1rem' }}>
        Del 1 — Omfattningsbedömning
      </div>
      <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem', maxWidth: '20ch' }}>
        Omfattas verksamheten av cybersäkerhetslagen?
      </h2>
      <p style={{ color: 'var(--ink-soft)', marginBottom: '3rem', maxWidth: '60ch' }}>
        Tre frågor avgör om verksamheten klassas som <em>väsentlig</em>, <em>viktig</em>, eller faller utanför lagens tröskelvärden.
      </p>

      <div style={{ marginBottom: '2.5rem' }}>
        <label className="smallcaps" style={{ color: 'var(--ink-soft)', marginBottom: '0.75rem', display: 'block' }}>
          Sektor enligt bilaga 1 eller 2
        </label>
        <select value={omfattning.sektor || ''} onChange={e => setOmfattning({ ...omfattning, sektor: e.target.value })}>
          <option value="">— Välj sektor —</option>
          <optgroup label="Bilaga 1 — Sektorer med hög kritikalitet">
            {SEKTORER_BILAGA_1.map(s => <option key={s} value={s}>{s}</option>)}
          </optgroup>
          <optgroup label="Bilaga 2 — Andra kritiska sektorer">
            {SEKTORER_BILAGA_2.map(s => <option key={s} value={s}>{s}</option>)}
          </optgroup>
          <option value="ingen">Verksamheten passar inte i någon sektor</option>
        </select>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <label className="smallcaps" style={{ color: 'var(--ink-soft)', marginBottom: '0.75rem', display: 'block' }}>
          Antal anställda
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {[
            { val: 'under-50', label: 'Färre än 50' },
            { val: '50-249', label: '50 – 249' },
            { val: '250+', label: '250 eller fler' }
          ].map(o => (
            <label key={o.val} className={`field-radio ${omfattning.anstallda === o.val ? 'selected' : ''}`}>
              <input type="radio" checked={omfattning.anstallda === o.val} onChange={() => setOmfattning({ ...omfattning, anstallda: o.val })} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <label className="smallcaps" style={{ color: 'var(--ink-soft)', marginBottom: '0.75rem', display: 'block' }}>
          Årsomsättning
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {[
            { val: 'under-10', label: 'Under 10 MEUR' },
            { val: '10-50', label: '10 – 50 MEUR' },
            { val: '50+', label: 'Över 50 MEUR' }
          ].map(o => (
            <label key={o.val} className={`field-radio ${omfattning.omsattning === o.val ? 'selected' : ''}`}>
              <input type="radio" checked={omfattning.omsattning === o.val} onChange={() => setOmfattning({ ...omfattning, omsattning: o.val })} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      {bedomning && (
        <div className="card fade-up" style={{ padding: '1.75rem', marginBottom: '2.5rem',
              borderLeft: `3px solid ${bedomning.status === 'omfattad' ?
                (bedomning.kategori === 'vasentlig' ? 'var(--accent)' : 'var(--accent-warm)') : 'var(--ink-mute)'}` }}>
          <div className="smallcaps" style={{ color: 'var(--ink-mute)', marginBottom: '0.5rem' }}>Preliminär bedömning</div>
          <div className="display" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            {bedomning.status === 'omfattad'
              ? (bedomning.kategori === 'vasentlig' ? 'Väsentlig verksamhetsutövare' : 'Viktig verksamhetsutövare')
              : 'Verksamheten omfattas troligtvis inte'}
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            {bedomning.forklaring}
          </p>

          {bedomning.status === 'omfattad' && omfattning.sektor && SEKTOR_MYNDIGHET[omfattning.sektor] && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--line)' }}>
              <div className="smallcaps" style={{ color: 'var(--ink-mute)', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                Behörig sektorsmyndighet
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '0.35rem' }}>
                {SEKTOR_MYNDIGHET[omfattning.sektor].myndighet}
              </div>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Tillsyn och incidentrapportering enligt cybersäkerhetslagen (2025:1506) och cybersäkerhetsförordningen (2025:1507).
                Myndigheten för civilt försvar (MCF) har samordnande ansvar och utfärdar tvärsektoriella föreskrifter (MCFFS 2026:1).
                Webbplats: <span style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--accent)' }}>{SEKTOR_MYNDIGHET[omfattning.sektor].webb}</span>
              </p>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-ghost" onClick={onTillbaka}>← Tillbaka</button>
        <button className="btn-primary" onClick={onNasta} disabled={!klar}
                style={{ opacity: klar ? 1 : 0.4, pointerEvents: klar ? 'auto' : 'none' }}>
          Fortsätt till gap-analys →
        </button>
      </div>
    </div>
  );
}

function GapVy({ svar, setSvar, onKlar, onTillbaka }) {
  const [oppet, setOppet] = useState(1);
  const totalt = OMRADEN.reduce((s, o) => s + o.fragor.length, 0);
  const besvarade = Object.keys(svar).length;
  const procent = (besvarade / totalt) * 100;

  return (
    <div className="fade-up" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div className="smallcaps" style={{ color: 'var(--accent-warm)', marginBottom: '1rem' }}>
        Del 2 — Gap-analys mot 2 kap. 1 § cybersäkerhetslagen
      </div>
      <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1.5rem', maxWidth: '22ch' }}>
        Bedöm verksamhetens nuvarande mognad
      </h2>
      <p style={{ color: 'var(--ink-soft)', marginBottom: '2rem', maxWidth: '60ch' }}>
        Besvara frågorna för respektive säkerhetsåtgärdsområde. Markera <em>delvis</em> för åtgärder som finns
        men är ofullständiga eller inte fullt dokumenterade.
      </p>

      <div style={{ position: 'sticky', top: 0, background: 'var(--bg)', padding: '1rem 0',
                    marginBottom: '2rem', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem',
                      fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
          <span>Framsteg</span>
          <span className="mono">{besvarade} / {totalt} frågor</span>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${procent}%` }} /></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem' }}>
        {OMRADEN.map(omrade => {
          const ar_oppet = oppet === omrade.id;
          const omr_besvarade = omrade.fragor.filter(f => svar[f.id]).length;
          return (
            <div key={omrade.id} className="card" style={{ overflow: 'hidden' }}>
              <button onClick={() => setOppet(ar_oppet ? null : omrade.id)}
                      style={{ width: '100%', textAlign: 'left', padding: '1.25rem 1.5rem',
                               display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <span className="mono" style={{ color: 'var(--ink-mute)', fontSize: '0.85rem' }}>{omrade.nr}</span>
                <div style={{ flex: 1 }}>
                  <div className="display" style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{omrade.title}</div>
                  <div className="smallcaps" style={{ color: 'var(--ink-mute)' }}>
                    {omrade.paragraf} · {omrade.artikel}
                  </div>
                  <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--ink-mute)', marginTop: '0.3rem' }}>
                    {omrade.iso}
                  </div>
                </div>
                <span className="mono" style={{ fontSize: '0.85rem', color: omr_besvarade === omrade.fragor.length ? 'var(--success)' : 'var(--ink-mute)' }}>
                  {omr_besvarade}/{omrade.fragor.length}
                </span>
                <span style={{ fontSize: '1.2rem', color: 'var(--ink-mute)', transition: 'transform 0.2s', transform: ar_oppet ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
              </button>
              {ar_oppet && (
                <div className="fade-up" style={{ padding: '0 1.5rem 1.5rem 4rem', borderTop: '1px solid var(--rule-soft)' }}>
                  <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', margin: '1.25rem 0 1.5rem',
                              fontStyle: 'italic', lineHeight: '1.5' }}>
                    {omrade.beskrivning}
                  </p>
                  {omrade.fragor.map(fraga => (
                    <div key={fraga.id} style={{ marginBottom: '1.25rem',
                                                  paddingBottom: '1.25rem',
                                                  borderBottom: '1px solid var(--rule-soft)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                        <span className="mono" style={{ color: 'var(--ink-mute)', fontSize: '0.75rem', paddingTop: '0.2rem' }}>
                          {fraga.id}
                        </span>
                        <p style={{ flex: 1, fontSize: '0.95rem', lineHeight: '1.5' }}>{fraga.text}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', paddingLeft: '2rem' }}>
                        {[
                          { val: SVARSTYP.JA, label: 'Ja' },
                          { val: SVARSTYP.DELVIS, label: 'Delvis' },
                          { val: SVARSTYP.NEJ, label: 'Nej' }
                        ].map(opt => (
                          <button key={opt.val}
                                  className={`answer-pill ${svar[fraga.id] === opt.val ? 'selected-' + opt.val : ''}`}
                                  onClick={() => setSvar({ ...svar, [fraga.id]: opt.val })}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-ghost" onClick={onTillbaka}>← Tillbaka</button>
        <button className="btn-primary" onClick={onKlar} disabled={besvarade === 0}
                style={{ opacity: besvarade > 0 ? 1 : 0.4, pointerEvents: besvarade > 0 ? 'auto' : 'none' }}>
          Visa resultat →
        </button>
      </div>
    </div>
  );
}

function ResultatVy({ svar, omfattning, onStartOm }) {
  const resultat = useMemo(() => beraknaScore(svar), [svar]);
  const totalScore = useMemo(() => {
    const summa = resultat.reduce((s, r) => s + r.procent, 0);
    return summa / resultat.length;
  }, [resultat]);
  const bedomning = bedomOmfattning(omfattning);
  const prioriterade = [...resultat].filter(r => r.niva !== 'hog' && r.besvarade > 0).sort((a, b) => a.procent - b.procent);

  return (
    <div className="fade-up" style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div className="smallcaps" style={{ color: 'var(--accent-warm)', marginBottom: '1rem' }}>Resultat — Mognadsöversikt</div>
      <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '2rem', maxWidth: '20ch' }}>
        Sammantagen NIS2-mognad
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '4rem' }}>
        <div className="card" style={{ padding: '1.75rem' }}>
          <div className="smallcaps" style={{ color: 'var(--ink-mute)', marginBottom: '0.75rem' }}>Total mognad</div>
          <div className="display" style={{ fontSize: '3rem', lineHeight: 1 }}>{Math.round(totalScore)}<span style={{ fontSize: '1.5rem', color: 'var(--ink-soft)' }}>%</span></div>
        </div>
        <div className="card" style={{ padding: '1.75rem' }}>
          <div className="smallcaps" style={{ color: 'var(--ink-mute)', marginBottom: '0.75rem' }}>Klassificering</div>
          <div className="display" style={{ fontSize: '1.4rem', lineHeight: 1.2 }}>
            {bedomning.status === 'omfattad' ? (bedomning.kategori === 'vasentlig' ? 'Väsentlig' : 'Viktig') : 'Ej omfattad'}
          </div>
          {bedomning.kategori && <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.5rem' }}>verksamhetsutövare</div>}
        </div>
        <div className="card" style={{ padding: '1.75rem' }}>
          <div className="smallcaps" style={{ color: 'var(--ink-mute)', marginBottom: '0.75rem' }}>Prioriterade luckor</div>
          <div className="display" style={{ fontSize: '3rem', lineHeight: 1 }}>{prioriterade.filter(r => r.niva === 'lag').length}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.5rem' }}>områden under 40 %</div>
        </div>
      </div>

      <h3 className="display" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Mognad per säkerhetsåtgärdsområde</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '4rem' }}>
        {resultat.map(r => (
          <div key={r.id} className="card" style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.75rem' }}>
              <span className="mono" style={{ color: 'var(--ink-mute)', fontSize: '0.85rem' }}>{r.nr}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1rem', fontWeight: 500 }}>{r.title}</div>
                <div className="smallcaps" style={{ color: 'var(--ink-mute)', marginTop: '0.15rem' }}>{r.paragraf}</div>
              </div>
              <div className="mono" style={{ fontSize: '1rem', fontWeight: 500 }}>{Math.round(r.procent)}%</div>
            </div>
            <div className="score-bar"><div className={`score-bar-fill niva-${r.niva}`} style={{ width: `${r.procent}%` }} /></div>
          </div>
        ))}
      </div>

      {prioriterade.length > 0 && (
        <>
          <h3 className="display" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Roadmap för åtgärder</h3>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '2.5rem', maxWidth: '60ch' }}>
            Områden med ofullständig mognad grupperade efter typ av insats och förväntad tidshorisont.
            Policy-arbete kräver framförallt dokumentation och kan starta direkt; tekniska kontroller
            kräver upphandling och utrullning.
          </p>
          {Object.entries(KATEGORIER).map(([nyckel, kat]) => {
            const items = prioriterade.filter(p => p.kategori === nyckel);
            if (items.length === 0) return null;
            return (
              <div key={nyckel} style={{ marginBottom: '2.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem',
                              marginBottom: '1rem', paddingBottom: '0.5rem',
                              borderBottom: '1px solid var(--rule)', flexWrap: 'wrap' }}>
                  <div className="display" style={{ fontSize: '1.2rem' }}>{kat.label}</div>
                  <div className="smallcaps" style={{ color: 'var(--ink-mute)' }}>{kat.horisont}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {items.map(r => (
                    <div key={r.id} className="card" style={{ padding: '1.25rem 1.5rem',
                          borderLeft: `3px solid ${r.niva === 'lag' ? 'var(--danger)' : 'var(--warning)'}` }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.4rem' }}>
                        <span className="mono" style={{ color: 'var(--ink-mute)', fontSize: '0.85rem' }}>{r.nr}</span>
                        <div style={{ flex: 1, fontSize: '1rem', fontWeight: 500 }}>{r.title}</div>
                        <span className="mono" style={{ fontSize: '0.85rem',
                              color: r.niva === 'lag' ? 'var(--danger)' : 'var(--warning)' }}>
                          {Math.round(r.procent)}%
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginLeft: '2rem',
                                  lineHeight: 1.5, marginBottom: '0.5rem' }}>
                        {r.beskrivning}
                      </p>
                      <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--ink-mute)', marginLeft: '2rem' }}>
                        {r.paragraf} · {r.iso}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '2rem', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-mute)', maxWidth: '50ch' }}>
          Detta verktyg är en konceptuell prototyp framtagen som examensarbete och ersätter inte juridisk eller teknisk rådgivning.
        </p>
        <button className="btn-secondary" onClick={onStartOm}>Starta om bedömning</button>
      </div>
    </div>
  );
}

// =============================================================================
// HUVUDAPP
// =============================================================================

export default function NIS2ComplianceAssistant() {
  const [vy, setVy] = useState('intro');
  const [omfattning, setOmfattning] = useState({ sektor: null, anstallda: null, omsattning: null });
  const [svar, setSvar] = useState({});

  const startOm = () => {
    setOmfattning({ sektor: null, anstallda: null, omsattning: null });
    setSvar({});
    setVy('intro');
  };

  return (
    <div className="nis2-app">
      <style>{STIL}</style>
      <Header vy={vy} gaTillStart={() => setVy('intro')} />
      {vy === 'intro' && <IntroVy onStart={() => setVy('wizard')} />}
      {vy === 'wizard' && <WizardVy omfattning={omfattning} setOmfattning={setOmfattning}
                                     onNasta={() => setVy('gap')} onTillbaka={() => setVy('intro')} />}
      {vy === 'gap' && <GapVy svar={svar} setSvar={setSvar}
                              onKlar={() => setVy('resultat')} onTillbaka={() => setVy('wizard')} />}
      {vy === 'resultat' && <ResultatVy svar={svar} omfattning={omfattning} onStartOm={startOm} />}
      <footer style={{ borderTop: '1px solid var(--rule)', padding: '2rem', textAlign: 'center',
                       fontSize: '0.8rem', color: 'var(--ink-mute)', marginTop: '4rem' }}>
        <span className="paragraph-mark" style={{ marginRight: '0.5rem', color: 'var(--accent-warm)' }}>§</span>
        NIS2 Compliance Assistant — Examensarbete · Cybersäkerhetslagen (2025:1506)
      </footer>
    </div>
  );
}
