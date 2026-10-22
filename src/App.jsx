import Header from './components/Header.jsx';
import IntroVy from './components/IntroVy.jsx';
import WizardVy from './components/WizardVy.jsx';
import GapVy from './components/GapVy.jsx';
import ResultatVy from './components/ResultatVy.jsx';
import { useSparadBedomning } from './hooks/useSparadBedomning.js';
import './styles/app.css';

export default function App() {
  const { vy, omfattning, svar, setVy, setOmfattning, setSvar, startaOm } = useSparadBedomning();

  return (
    <div className="nis2-app">
      <Header vy={vy} gaTillStart={() => setVy('intro')} />
      {vy === 'intro' && <IntroVy onStart={() => setVy('wizard')} />}
      {vy === 'wizard' && <WizardVy omfattning={omfattning} setOmfattning={setOmfattning}
                                     onNasta={() => setVy('gap')} onTillbaka={() => setVy('intro')} />}
      {vy === 'gap' && <GapVy svar={svar} setSvar={setSvar}
                              onKlar={() => setVy('resultat')} onTillbaka={() => setVy('wizard')} />}
      {vy === 'resultat' && <ResultatVy svar={svar} omfattning={omfattning} onStartOm={startaOm} />}
      <footer style={{ borderTop: '1px solid var(--rule)', padding: '2rem', textAlign: 'center',
                       fontSize: '0.8rem', color: 'var(--ink-mute)', marginTop: '4rem' }}>
        <span className="paragraph-mark" style={{ marginRight: '0.5rem', color: 'var(--accent-warm)' }}>§</span>
        NIS2 Compliance Assistant — Examensarbete · Cybersäkerhetslagen (2025:1506) · Svaren sparas endast i din webbläsare
      </footer>
    </div>
  );
}
