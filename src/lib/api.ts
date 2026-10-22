import type { Anstallda, Omfattning, Omsattning, Svarsmap } from '../types';

/** Bas-URL till API:t. Saknas den körs appen utan backend. */
export const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || undefined;

export interface BedomningsRequest {
  sector: string | null;
  employees: Anstallda | null;
  turnover: Omsattning | null;
  answers: Svarsmap;
}

export interface BedomningsResponse extends BedomningsRequest {
  id: string;
  scope: { status: string; category: string | null; explanation: string };
  createdAt: string;
  updatedAt: string;
}

export class ApiFel extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiFel';
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const arGiltigtId = (id: string | null | undefined): id is string => !!id && UUID.test(id);

export function tillRequest(omfattning: Omfattning, svar: Svarsmap): BedomningsRequest {
  return {
    sector: omfattning.sektor,
    employees: omfattning.anstallda,
    turnover: omfattning.omsattning,
    answers: svar,
  };
}

export function franResponse(r: BedomningsResponse): { omfattning: Omfattning; svar: Svarsmap } {
  return {
    omfattning: { sektor: r.sector, anstallda: r.employees, omsattning: r.turnover },
    svar: r.answers,
  };
}

async function anrop<T>(fetcher: typeof fetch, url: string, init?: RequestInit): Promise<T> {
  const res = await fetcher(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    throw new ApiFel(res.status, res.status === 404 ? 'Bedömningen hittades inte.' : `Servern svarade med fel (${res.status}).`);
  }
  return res.json() as Promise<T>;
}

/** Skapar en ny bedömning på servern, eller uppdaterar den om ett id redan finns. */
export function sparaBedomning(
  request: BedomningsRequest,
  id: string | null,
  { baseUrl = API_URL, fetcher = fetch }: { baseUrl?: string; fetcher?: typeof fetch } = {},
): Promise<BedomningsResponse> {
  if (!baseUrl) throw new Error('Inget API är konfigurerat (VITE_API_URL).');
  return id
    ? anrop(fetcher, `${baseUrl}/api/assessments/${id}`, { method: 'PUT', body: JSON.stringify(request) })
    : anrop(fetcher, `${baseUrl}/api/assessments`, { method: 'POST', body: JSON.stringify(request) });
}

export function hamtaBedomning(
  id: string,
  { baseUrl = API_URL, fetcher = fetch }: { baseUrl?: string; fetcher?: typeof fetch } = {},
): Promise<BedomningsResponse> {
  if (!baseUrl) throw new Error('Inget API är konfigurerat (VITE_API_URL).');
  return anrop(fetcher, `${baseUrl}/api/assessments/${id}`);
}

export function delningslank(id: string, location: Pick<Location, 'origin' | 'pathname'> = window.location): string {
  return `${location.origin}${location.pathname}?bedomning=${id}`;
}
