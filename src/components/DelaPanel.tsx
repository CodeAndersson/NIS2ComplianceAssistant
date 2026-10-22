import { useState } from 'react';
import { sparaBedomning, tillRequest, delningslank } from '../lib/api';
import type { Omfattning, Svarsmap } from '../types';

interface Props {
  omfattning: Omfattning;
  svar: Svarsmap;
  delningsId: string | null;
  setDelningsId: (id: string) => void;
}

type Status = { typ: 'vilar' } | { typ: 'sparar' } | { typ: 'klar' } | { typ: 'fel'; meddelande: string };

/** Sparar bedömningen på servern och visar en länk som kan delas med kollegor. */
export default function DelaPanel({ omfattning, svar, delningsId, setDelningsId }: Props) {
  const [status, setStatus] = useState<Status>({ typ: 'vilar' });
  const [kopierad, setKopierad] = useState(false);

  const spara = async () => {
    setStatus({ typ: 'sparar' });
    try {
      const svarFranServer = await sparaBedomning(tillRequest(omfattning, svar), delningsId);
      setDelningsId(svarFranServer.id);
      setStatus({ typ: 'klar' });
    } catch (e) {
      setStatus({ typ: 'fel', meddelande: e instanceof Error ? e.message : 'Något gick fel.' });
    }
  };

  const kopiera = async (lank: string) => {
    try {
      await navigator.clipboard.writeText(lank);
      setKopierad(true);
      setTimeout(() => setKopierad(false), 2000);
    } catch {
      // Urklipp kan vara blockerat — länken syns ändå och kan markeras manuellt.
    }
  };

  const lank = delningsId ? delningslank(delningsId) : null;

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '3rem' }}>
      <div className="smallcaps" style={{ color: 'var(--ink-mute)', marginBottom: '0.5rem' }}>Spara och dela</div>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1rem', maxWidth: '60ch' }}>
        Spara bedömningen på servern för att få en länk som du kan dela med t.ex. ledningsgruppen.
        Bara den som har länken kan öppna bedömningen.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn-primary" onClick={spara} disabled={status.typ === 'sparar'}>
          {status.typ === 'sparar' ? 'Sparar …' : delningsId ? 'Uppdatera sparad bedömning' : 'Spara och skapa länk'}
        </button>
        {lank && (
          <>
            <code className="mono" data-testid="delningslank" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{lank}</code>
            <button className="btn-ghost" onClick={() => kopiera(lank)}>{kopierad ? 'Kopierad!' : 'Kopiera länk'}</button>
          </>
        )}
      </div>
      {status.typ === 'fel' && (
        <p role="alert" style={{ color: 'var(--danger)', fontSize: '0.88rem', marginTop: '0.75rem' }}>{status.meddelande}</p>
      )}
    </div>
  );
}
