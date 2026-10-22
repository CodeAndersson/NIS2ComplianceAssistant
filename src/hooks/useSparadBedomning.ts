import { useEffect, useState } from 'react';
import { laddaTillstand, sparaTillstand, rensaTillstand, TOMT_TILLSTAND, type Lagring } from '../lib/lagring';
import type { Tillstand } from '../types';

function hamtaStorage(): Lagring | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
}

/** Håller bedömningens tillstånd och sparar det automatiskt i localStorage. */
export function useSparadBedomning() {
  const [tillstand, setTillstand] = useState<Tillstand>(() => laddaTillstand(hamtaStorage()));

  useEffect(() => {
    sparaTillstand(hamtaStorage(), tillstand);
  }, [tillstand]);

  const uppdatera = <K extends keyof Tillstand>(falt: K) => (varde: Tillstand[K]) =>
    setTillstand(t => ({ ...t, [falt]: varde }));

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
