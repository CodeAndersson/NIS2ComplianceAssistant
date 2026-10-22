
export default function Header({ vy, gaTillStart }) {
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
