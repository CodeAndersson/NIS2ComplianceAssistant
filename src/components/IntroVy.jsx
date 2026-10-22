import { useState } from 'react';
import { INCIDENT_FRISTER } from '../data/incidentfrister.js';

export default function IntroVy({ onStart }) {
  const [visaKallor, setVisaKallor] = useState(false);

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
        <button className="btn-ghost" onClick={() => setVisaKallor(v => !v)} aria-expanded={visaKallor}>
          Källor och underlag
        </button>
      </div>
      {visaKallor && (
        <div className="card kallor fade-up">
          Cybersäkerhetslagen (2025:1506), Cybersäkerhetsförordningen (2025:1507), Prop. 2025/26:28,
          MCFFS 2026:1 och NIS2-direktivet (EU 2022/2555).
        </div>
      )}

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
