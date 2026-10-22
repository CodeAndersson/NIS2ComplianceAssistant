import { useState } from 'react';
import { OMRADEN } from '../data/omraden.js';
import { SVARSTYP } from '../lib/score.js';

export default function GapVy({ svar, setSvar, onKlar, onTillbaka }) {
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
