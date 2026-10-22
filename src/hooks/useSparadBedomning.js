import { useEffect, useState } from 'react';
import { laddaTillstand, sparaTillstand, rensaTillstand, TOMT_TILLSTAND } from '../lib/lagring.js';

function hamtaStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
}

/** Håller bedömningens tillstånd och sparar det automatiskt i localStorage. */
export function useSparadBedomning() {
  const [tillstand, setTillstand] = useState(() => laddaTillstand(hamtaStorage()));

  useEffect(() => {
    sparaTillstand(hamtaStorage(), tillstand);
  }, [tillstand]);

  const uppdatera = falt => varde => setTillstand(t => ({ ...t, [falt]: varde }));

  return {
    ...tillstand,
    setVy: uppdatera('vy'),
    setOmfattning: uppdatera('omfattning'),
    setSvar: uppdatera('svar'),
    startaOm: () => {
      rensaTillstand(hamtaStorage());
      setTillstand(TOMT_TILLSTAND);
    },
  };
}
