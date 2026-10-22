import { describe, it, expect, vi } from 'vitest';
import { sparaBedomning, hamtaBedomning, taBortBedomning, tillRequest, franResponse, arGiltigtId, delningslank, ApiFel, type BedomningsResponse } from '../api';

const svar: BedomningsResponse = {
  id: '3f2b6c1e-8a4d-4f7e-9b1a-2c3d4e5f6a7b',
  sector: 'Energi', employees: '50-249', turnover: '10-50',
  answers: { '1.1': 'ja' },
  scope: { status: 'omfattad', category: 'viktig', explanation: '' },
  createdAt: '2026-10-22T12:00:00Z', updatedAt: '2026-10-22T12:00:00Z',
};

function fejkFetch(status: number, body: unknown) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch & ReturnType<typeof vi.fn>;
}

describe('api', () => {
  it('mappar mellan frontendens och API:ts fältnamn åt båda hållen', () => {
    const omfattning = { sektor: 'Energi', anstallda: '50-249' as const, omsattning: '10-50' as const };
    const request = tillRequest(omfattning, { '1.1': 'ja' });
    expect(request).toEqual({ sector: 'Energi', employees: '50-249', turnover: '10-50', answers: { '1.1': 'ja' } });
    expect(franResponse({ ...svar, ...request })).toEqual({ omfattning, svar: { '1.1': 'ja' } });
  });

  it('skapar med POST när id saknas och uppdaterar med PUT när id finns', async () => {
    const fetcher = fejkFetch(200, svar);
    await sparaBedomning(tillRequest({ sektor: null, anstallda: null, omsattning: null }, {}), null, { baseUrl: 'http://api', fetcher });
    await sparaBedomning(tillRequest({ sektor: null, anstallda: null, omsattning: null }, {}), svar.id, { baseUrl: 'http://api', fetcher });

    expect(fetcher.mock.calls[0]).toEqual(['http://api/api/assessments', expect.objectContaining({ method: 'POST' })]);
    expect(fetcher.mock.calls[1]).toEqual([`http://api/api/assessments/${svar.id}`, expect.objectContaining({ method: 'PUT' })]);
  });

  it('kastar ApiFel med tydligt meddelande vid 404', async () => {
    const fel = await hamtaBedomning(svar.id, { baseUrl: 'http://api', fetcher: fejkFetch(404, {}) }).catch(e => e);
    expect(fel).toBeInstanceOf(ApiFel);
    expect(fel.status).toBe(404);
    expect(fel.message).toBe('Bedömningen hittades inte.');
  });

  it('ber användaren vänta vid 429 (rate limit)', async () => {
    const fel = await hamtaBedomning(svar.id, { baseUrl: 'http://api', fetcher: fejkFetch(429, {}) }).catch(e => e);
    expect(fel).toBeInstanceOf(ApiFel);
    expect(fel.message).toMatch(/Vänta en minut/);
  });

  it('tar bort med DELETE och klarar ett tomt 204-svar', async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 204 })) as unknown as typeof fetch & ReturnType<typeof vi.fn>;
    await expect(taBortBedomning(svar.id, { baseUrl: 'http://api', fetcher })).resolves.toBeUndefined();
    expect(fetcher.mock.calls[0]).toEqual([`http://api/api/assessments/${svar.id}`, expect.objectContaining({ method: 'DELETE' })]);
  });

  it('validerar id:n och bygger delningslänkar', () => {
    expect(arGiltigtId(svar.id)).toBe(true);
    expect(arGiltigtId('../../etc/passwd')).toBe(false);
    expect(arGiltigtId(null)).toBe(false);
    expect(delningslank(svar.id, { origin: 'https://nis2.example', pathname: '/' }))
      .toBe(`https://nis2.example/?bedomning=${svar.id}`);
  });
});
