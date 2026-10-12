import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { env, exports } from 'cloudflare:workers';
import { reset, runInDurableObject } from 'cloudflare:test';
import { getForecast, japanDate, normalizeForecast, weatherResponse } from '../src/weather';
import { digest } from '../src/crypto';
const origin = 'https://trip.example.test';
const location = { id:'nara', name:'奈良', latitude:34.6827, longitude:135.8201 };
const now = Date.parse('2026-10-01T16:00:00Z');
function fixture(date = '2026-10-02') {
  return { current_units:{temperature_2m:'°C'},current:{time:date+'T01:00',temperature_2m:20,weather_code:1,is_day:1},hourly_units:{temperature_2m:'°C',precipitation_probability:'%'}, timezone:'Asia/Tokyo', utc_offset_seconds:32400, daily:{time:[date],sunrise:[date+'T05:55'],sunset:[date+'T17:40']},hourly:{time:Array.from({length:24},(_,i)=>date+'T'+String(i).padStart(2,'0')+':00'),temperature_2m:Array(24).fill(21),precipitation_probability:Array(24).fill(0),weather_code:Array(24).fill(0),is_day:Array(24).fill(1)} };
}
beforeEach(async () => { await reset(); });
afterEach(() => { vi.restoreAllMocks(); });
describe('daily weather', () => {
  it('uses Japan calendar boundaries and never requests past or distant forecasts', async () => {
    expect(japanDate(now)).toBe('2026-10-02');
    const fetcher = vi.spyOn(globalThis,'fetch');
    expect((await getForecast(location,'2026-10-01',origin,now)).status).toBe('past');
    expect((await getForecast(location,'2026-10-18',origin,now)).status).toBe('outside_forecast');
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('preserves real zero values and missing values and rejects malformed arrays and timezone', () => {
    const raw = fixture(); raw.hourly.temperature_2m[0]=null; raw.hourly.precipitation_probability[1]=null;
    const data = normalizeForecast(raw,now).days['2026-10-02'];
    expect(data.hours[0]).toMatchObject({temperature:null,precipitationProbability:0,code:0});
    expect(data.hours[1].precipitationProbability).toBeNull();
    expect(data.sunset).toBe('2026-10-02T17:40');
    raw.hourly.time.pop(); expect(()=>normalizeForecast(raw,now)).toThrow();
    expect(()=>normalizeForecast({...fixture(),timezone:'GMT'},now)).toThrow();
  });
  it('caches by location and Japan date; falls back to a labelled recent forecast on upstream failure', async () => {
    const fetcher = vi.spyOn(globalThis,'fetch').mockResolvedValueOnce(Response.json(fixture()));
    const first = await getForecast(location,'2026-10-02',origin,now);
    expect(first.status).toBe('ok'); expect(first.hours).toHaveLength(24); expect(first.current).toMatchObject({temperature:20,code:1}); expect(first.stale).toBe(false);
    const second = await getForecast(location,'2026-10-02',origin,now+59*60_000);
    expect(second.fetchedAt).toBe(first.fetchedAt); expect(fetcher).toHaveBeenCalledTimes(1);
    const requested = new URL(String(fetcher.mock.calls[0][0]));
    expect(requested.hostname).toBe('api.open-meteo.com'); expect(requested.searchParams.get('timezone')).toBe('Asia/Tokyo');
    expect(fetcher.mock.calls[0][1]).toMatchObject({ redirect: 'manual' });
    fetcher.mockRejectedValue(new Error('upstream down'));
    expect((await getForecast(location,'2026-10-02',origin,now+60*60_000)).stale).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(2); // Re-fetch exactly at one hour.
    await expect(getForecast(location,'2026-10-02',origin,now+7*3_600_000)).rejects.toThrow('weather_unavailable');
  });
  it('backs off after malformed responses without caching them as weather', async () => {
    const fetcher = vi.spyOn(globalThis,'fetch').mockResolvedValueOnce(Response.json({error:true})).mockResolvedValueOnce(Response.json(fixture()));
    await expect(getForecast(location,'2026-10-02',origin,now)).rejects.toThrow();
    await expect(getForecast(location,'2026-10-02',origin,now)).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(1);
    const cache = await caches.open('trip-weather-v1');
    await cache.delete(`${origin}/__weather-cache/v1/2026-10-02/${location.latitude}/${location.longitude}/retry`);
    expect((await getForecast(location,'2026-10-02',origin,now)).status).toBe('ok');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('rejects invalid day and cross-plan locations without fetching arbitrary coordinates', async () => {
    for (const query of ['day=99','day=6&plan=B&location=arima','day=1&location=__proto__','day=1&plan=X','day=0&location=unknown']) {
      expect((await weatherResponse(new URL(origin+'/api/weather?'+query))).status).toBe(400);
    }
  });
  it('keeps public location validation identical after session revocation', async () => {
    const token = 'W'.repeat(43), hash = await digest(token);
    const stub = env.TRIP_AUTH.getByName(env.TRIP_ID);
    await runInDurableObject(stub, (_, state) => {
      state.storage.sql.exec('INSERT OR REPLACE INTO records (key,value,expires) VALUES (?,?,?)', 'session:'+hash, JSON.stringify({userId:'leader',role:'leader',expires:Date.now()+60000,verifiedAt:Date.now(),created:Date.now()}), Date.now()+60000);
    });
    const request = () => exports.default.fetch(origin+'/api/weather?day=6&plan=B&location=arima', {headers:{Cookie:'__Host-trip_session='+token}});
    expect((await request()).status).toBe(400); // Reached the authenticated location validator.
    await runInDurableObject(stub, (_, state) => state.storage.sql.exec('DELETE FROM records WHERE key=?', 'session:'+hash));
    expect((await request()).status).toBe(400);
  });
  it('rejects oversized responses and never returns them as forecasts', async () => {
    vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response('x'.repeat(256001)));
    await expect(getForecast(location,'2026-10-02',origin,now)).rejects.toThrow('weather_unavailable');
  });
  it('validates anonymous weather requests and only accepts GET', async () => {
    const response = await exports.default.fetch(origin+'/api/weather?day=1');
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    expect((await exports.default.fetch(origin+'/api/weather?day=1',{method:'POST'})).status).toBe(405);
  });
});
