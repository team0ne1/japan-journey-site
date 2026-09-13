import { WEATHER_DAYS } from './weather-days';
type Location = { id: string; name: string; latitude: number; longitude: number };
type Hour = { time: string; temperature: number | null; precipitationProbability: number | null; code: number | null; isDay: number | null };
type Current = { time: string; temperature: number | null; code: number | null; isDay: number | null };
type Forecast = { fetchedAt: string; current: Current; days: Record<string, { sunrise: string | null; sunset: string | null; hours: Hour[] }> };
const FRESH_MS = 60 * 60_000;
const STALE_MS = 6 * 60 * 60_000;
export const japanDate = (now: number) => new Date(now + 9 * 3_600_000).toISOString().slice(0, 10);
const numberOrNull = (v: unknown) => typeof v === 'number' && Number.isFinite(v) ? v : null;
const record = (v: unknown): Record<string, unknown> => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('weather_schema');
  return v as Record<string, unknown>;
};
const array = (v: unknown): unknown[] => { if (!Array.isArray(v)) throw new Error('weather_schema'); return v; };
export function normalizeForecast(raw: unknown, now: number): Forecast {
  const data = record(raw), current = record(data.current), hourly = record(data.hourly), daily = record(data.daily);
  if (record(data.current_units).temperature_2m !== '°C') throw new Error('weather_units');
  if (record(data.hourly_units).temperature_2m !== '°C' || record(data.hourly_units).precipitation_probability !== '%') throw new Error('weather_units');
  if (data.timezone !== 'Asia/Tokyo' || data.utc_offset_seconds !== 32400) throw new Error('weather_timezone');
  const times = array(hourly.time), dates = array(daily.time);
  const temp = array(hourly.temperature_2m), rain = array(hourly.precipitation_probability), code = array(hourly.weather_code), daylight = array(hourly.is_day);
  const rises = array(daily.sunrise), sets = array(daily.sunset);
  if (!times.length || times.length > 384 || !dates.length || dates.length > 16 || [temp, rain, code, daylight].some(a => a.length !== times.length) || rises.length !== dates.length || sets.length !== dates.length) throw new Error('weather_schema');
  const days: Forecast['days'] = {};
  dates.forEach((date, i) => {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Object.hasOwn(days, date)) throw new Error('weather_date');
    const solar = (v: unknown) => typeof v === 'string' && v.startsWith(date + 'T') && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v) ? v : null;
    days[date] = { sunrise: solar(rises[i]), sunset: solar(sets[i]), hours: [] };
  });
  times.forEach((time, i) => {
    if (typeof time !== 'string' || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):00$/.test(time)) throw new Error('weather_time');
    const day = days[time.slice(0, 10)];
    if (!day || day.hours.some(h => h.time === time)) throw new Error('weather_time');
    const probability = numberOrNull(rain[i]);
    day.hours.push({ time, temperature: numberOrNull(temp[i]), precipitationProbability: probability !== null && probability >= 0 && probability <= 100 ? probability : null, code: numberOrNull(code[i]), isDay: daylight[i] === 0 || daylight[i] === 1 ? daylight[i] : null });
  });
  for (const day of Object.values(days)) {
    if (day.hours.length !== 24) throw new Error('weather_hours');
    day.hours.sort((a, b) => a.time.localeCompare(b.time));
  }
  if (typeof current.time !== 'string' || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):(?:[0-5]\d)$/.test(current.time)) throw new Error('weather_current');
  return { fetchedAt: new Date(now).toISOString(), current: { time: current.time, temperature: numberOrNull(current.temperature_2m), code: numberOrNull(current.weather_code), isDay: current.is_day === 0 || current.is_day === 1 ? current.is_day : null }, days };
}
async function readForecast(response: Response): Promise<unknown> {
  if (!response.ok || !response.body) throw new Error('weather_upstream');
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let length = 0;
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    length += value.length;
    if (length > 256_000) { await reader.cancel(); throw new Error('weather_size'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
export async function getForecast(location: Location, date: string, origin: string, now = Date.now()) {
  const today = japanDate(now);
  const ahead = (Date.parse(date) - Date.parse(today)) / 86_400_000;
  const base = { date, location: { id: location.id, name: location.name }, timezone: 'Asia/Tokyo' };
  if (ahead < 0 || ahead > 15) return { ...base, status: ahead < 0 ? 'past' : 'outside_forecast', sunrise: null, sunset: null, hours: [] };
  // Only public meteorological data enters the edge cache, never cookies or itinerary content.
  const cache = await caches.open('trip-weather-v1');
  const key = new Request(`${origin}/__weather-cache/v1/${today}/${location.latitude}/${location.longitude}`);
  let cached: Forecast | null = null;
  try { const response = await cache.match(key); cached = response ? await response.json<Forecast>() : null; }
  catch { console.warn(JSON.stringify({ event: 'weather_cache_read_failed' })); }

  const age = cached ? now - Date.parse(cached.fetchedAt) : Infinity;
  const result = (forecast: Forecast, stale: boolean) => {
    const day = forecast.days[date];
    if (!day) throw new Error('weather_missing_day');
    return { ...base, status: 'ok', ...day, current: date === today ? forecast.current : null, fetchedAt: forecast.fetchedAt, stale };
  };
  if (cached?.days[date] && age >= 0 && age < FRESH_MS) return result(cached, false);
  const failureKey = new Request(key.url + '/retry');
  const fallback = () => {
    if (cached?.days[date] && age >= 0 && age < STALE_MS) return result(cached, true);
    throw new Error('weather_unavailable');
  };
  let backingOff = false;
  try { backingOff = Boolean(await cache.match(failureKey)); } catch { /* Cache is best effort. */ }
  if (backingOff) return fallback();
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.search = new URLSearchParams({ latitude: String(location.latitude), longitude: String(location.longitude), timezone: 'Asia/Tokyo', forecast_days: '16', current: 'temperature_2m,weather_code,is_day', hourly: 'temperature_2m,precipitation_probability,weather_code,is_day', daily: 'sunrise,sunset', temperature_unit: 'celsius' }).toString();
    // Workers intentionally does not implement redirect: 'error'. Manual mode
    // keeps redirects from being followed; readForecast rejects every 3xx.
    const response = await fetch(url, { signal: AbortSignal.timeout(8000), redirect: 'manual' });
    const forecast = normalizeForecast(await readForecast(response), now);
    const output = result(forecast, false);
    try { await cache.put(key, Response.json(forecast, { headers: { 'Cache-Control': 'public, max-age=21600' } })); }
    catch { console.warn(JSON.stringify({ event: 'weather_cache_write_failed' })); }
    return output;
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown';
    console.warn(JSON.stringify({ event: 'weather_fetch_failed', reason }));
    // A short failure cooldown also applies to manual retries and repeated page loads.
    try { await cache.put(failureKey, new Response('retry later', { headers: { 'Cache-Control': 'public, max-age=60' } })); } catch { /* Best effort. */ }
    return fallback();
  }
}
export async function weatherResponse(url: URL): Promise<Response> {
  const key = `${url.searchParams.get('day')}:${url.searchParams.get('plan') ?? 'A'}`;
  if (!Object.hasOwn(WEATHER_DAYS, key)) return Response.json({ error: '行程日期或方案不正确。' }, { status: 400 });
  const day = WEATHER_DAYS[key as keyof typeof WEATHER_DAYS];
  const locationId = url.searchParams.get('location') ?? day.locations[0].id;
  const location = day.locations.find(item => item.id === locationId);
  if (!location) return Response.json({ error: '请选择当天行程中的天气地点。' }, { status: 400 });
  const date = day.date ?? japanDate(Date.now());
  try { return Response.json(await getForecast(location, date, url.origin)); }
  catch { return Response.json({ error: '天气暂时无法获取，请稍后重试。' }, { status: 503, headers: { 'Retry-After': '60' } }); }
}
