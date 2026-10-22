export type Vy = 'intro' | 'wizard' | 'gap' | 'resultat';

export type Svarstyp = 'ja' | 'delvis' | 'nej';
/** Svar per fråga, nycklat på fråge-id (t.ex. "1.1"). */
export type Svarsmap = Record<string, Svarstyp>;

export type Anstallda = 'under-50' | '50-249' | '250+';
export type Omsattning = 'under-10' | '10-50' | '50+';

export interface Omfattning {
  sektor: string | null;
  anstallda: Anstallda | null;
  omsattning: Omsattning | null;
}

export type Verksamhetskategori = 'vasentlig' | 'viktig';

export interface Bedomning {
  status: 'omfattad' | 'ej-omfattad';
  kategori: Verksamhetskategori | null;
  forklaring: string;
}

export type Atgardstyp = 'policy' | 'process' | 'teknik';

export interface Fraga {
  id: string;
  text: string;
}

export interface Omrade {
  id: number;
  nr: string;
  kategori: Atgardstyp;
  title: string;
  paragraf: string;
  artikel: string;
  iso: string;
  beskrivning: string;
  fragor: Fraga[];
}

export type Mognadsniva = 'hog' | 'medel' | 'lag';

export interface OmradesResultat extends Omrade {
  procent: number;
  niva: Mognadsniva;
  besvarade: number;
  totalt: number;
}

export interface Tillstand {
  vy: Vy;
  omfattning: Omfattning;
  svar: Svarsmap;
  /** Id för en bedömning som sparats på servern, om den har delats. */
  delningsId: string | null;
}
