import { SEKTORER_BILAGA_1, SEKTORER_BILAGA_2, SEKTOR_MYNDIGHET } from '../data/sektorer';
import { bedomOmfattning } from '../lib/omfattning';
import type { Anstallda, Omfattning, Omsattning } from '../types';

interface Props {
  omfattning: Omfattning;
  setOmfattning: (omfattning: Omfattning) => void;
  onNasta: () => void;
  onTillbaka: () => void;
}

const ANSTALLDA_VAL: { val: Anstallda; label: string }[] = [
  { val: 'under-50', label: 'Färre än 50' },
  { val: '50-249', label: '50 – 249' },
  { val: '250+', label: '250 eller fler' },
];

const OMSATTNING_VAL: { val: Omsattning; label: string }[] = [
  { val: 'under-10', label: 'Under 10 MEUR' },
  { val: '10-50', label: '10 – 50 MEUR' },
  { val: '50+', label: 'Över 50 MEUR' },
];

export default function WizardVy({ omfattning, setOmfattning, onNasta, onTillbaka }: Props) {
  const klar = Boolean(omfattning.sektor && omfattning.anstallda && omfattning.omsattning);
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
          {ANSTALLDA_VAL.map(o => (
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
          {OMSATTNING_VAL.map(o => (
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
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--rule-soft)' }}>
              <div className="smallcaps" style={{ color: 'var(--ink-mute)', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                Behörig sektorsmyndighet
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '0.35rem' }}>
                {SEKTOR_MYNDIGHET[omfattning.sektor].myndighet}
              </div>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Tillsyn och incidentrapportering enligt cybersäkerhetslagen (2025:1506) och cybersäkerhetsförordningen (2025:1507).
                Myndigheten för civilt försvar (MCF) har samordnande ansvar och utfärdar tvärsektoriella föreskrifter (MCFFS 2026:1).
                Webbplats: <span className="mono" style={{ color: 'var(--accent)' }}>{SEKTOR_MYNDIGHET[omfattning.sektor].webb}</span>
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
