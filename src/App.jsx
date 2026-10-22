import { useState } from 'react';
import Header from './components/Header.jsx';
import IntroVy from './components/IntroVy.jsx';
import WizardVy from './components/WizardVy.jsx';
import GapVy from './components/GapVy.jsx';
import ResultatVy from './components/ResultatVy.jsx';
import './styles/app.css';

const TOM_OMFATTNING = { sektor: null, anstallda: null, omsattning: null };

export default function App() {
  const [vy, setVy] = useState('intro');
  const [omfattning, setOmfattning] = useState(TOM_OMFATTNING);
  const [svar, setSvar] = useState({});

  const startOm = () => {
    setOmfattning(TOM_OMFATTNING);
    setSvar({});
    setVy('intro');
  };

  return (
    <div className="nis2-app">
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
