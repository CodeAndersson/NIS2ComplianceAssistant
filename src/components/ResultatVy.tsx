import { useMemo } from 'react';
import { KATEGORIER } from '../data/omraden';
import { bedomOmfattning } from '../lib/omfattning';
import { beraknaScore, totalMognad, prioriteradeLuckor } from '../lib/score';
import { API_URL } from '../lib/api';
import DelaPanel from './DelaPanel';
import type { Atgardstyp, Omfattning, Svarsmap } from '../types';

interface Props {
  svar: Svarsmap;
  omfattning: Omfattning;
  onStartOm: () => void;
  delningsId: string | null;
  setDelningsId: (id: string) => void;
}

export default function ResultatVy({ svar, omfattning, onStartOm, delningsId, setDelningsId }: Props) {
  const resultat = useMemo(() => beraknaScore(svar), [svar]);
  const totalScore = totalMognad(resultat);
  const bedomning = bedomOmfattning(omfattning);
  const prioriterade = prioriteradeLuckor(resultat);

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

      {API_URL && (
        <DelaPanel omfattning={omfattning} svar={svar} delningsId={delningsId} setDelningsId={setDelningsId} />
      )}

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
          {(Object.entries(KATEGORIER) as [Atgardstyp, (typeof KATEGORIER)[Atgardstyp]][]).map(([nyckel, kat]) => {
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
