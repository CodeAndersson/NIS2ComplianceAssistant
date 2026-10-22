import Header from './components/Header';
import IntroVy from './components/IntroVy';
import WizardVy from './components/WizardVy';
import GapVy from './components/GapVy';
import ResultatVy from './components/ResultatVy';
import { useEffect, useState } from 'react';
import { useSparadBedomning } from './hooks/useSparadBedomning';
import { API_URL, arGiltigtId, franResponse, hamtaBedomning } from './lib/api';
import './styles/app.css';

export default function App() {
  const {
    vy, omfattning, svar, delningsId,
    setVy, setOmfattning, setSvar, setDelningsId, laddaIn, startaOm,
  } = useSparadBedomning();
  const [laddningsfel, setLaddningsfel] = useState<string | null>(null);

  // Öppnar en delad bedömning från en länk av typen ?bedomning=<id>.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('bedomning');
    if (!API_URL || !arGiltigtId(id)) return;

    let avbruten = false;
    hamtaBedomning(id)
      .then(r => { if (!avbruten) laddaIn({ vy: 'resultat', ...franResponse(r), delningsId: r.id }); })
      .catch(e => { if (!avbruten) setLaddningsfel(e instanceof Error ? e.message : 'Kunde inte hämta bedömningen.'); });
    return () => { avbruten = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- körs bara en gång vid start
  }, []);

  return (
    <div className="nis2-app">
      <Header vy={vy} gaTillStart={() => setVy('intro')} />
      {laddningsfel && (
        <div role="alert" style={{ maxWidth: '900px', margin: '1.5rem auto 0', padding: '0 2rem', color: 'var(--danger)' }}>
          Den delade bedömningen kunde inte öppnas: {laddningsfel}
        </div>
      )}
      {vy === 'intro' && <IntroVy onStart={() => setVy('wizard')} />}
      {vy === 'wizard' && <WizardVy omfattning={omfattning} setOmfattning={setOmfattning}
                                     onNasta={() => setVy('gap')} onTillbaka={() => setVy('intro')} />}
      {vy === 'gap' && <GapVy svar={svar} setSvar={setSvar}
                              onKlar={() => setVy('resultat')} onTillbaka={() => setVy('wizard')} />}
      {vy === 'resultat' && <ResultatVy svar={svar} omfattning={omfattning} onStartOm={startaOm}
                                         delningsId={delningsId} setDelningsId={setDelningsId} />}
      <footer style={{ borderTop: '1px solid var(--rule)', padding: '2rem', textAlign: 'center',
                       fontSize: '0.8rem', color: 'var(--ink-mute)', marginTop: '4rem' }}>
        <span className="paragraph-mark" style={{ marginRight: '0.5rem', color: 'var(--accent-warm)' }}>§</span>
        NIS2 Compliance Assistant — Examensarbete · Cybersäkerhetslagen (2025:1506) · Svaren sparas i din webbläsare om du inte själv väljer att dela dem
      </footer>
    </div>
  );
}
