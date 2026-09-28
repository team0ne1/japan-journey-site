import { afterEach, describe, expect, it, vi } from 'vitest';
import { hoursInfo, mapsUrl, placeDetails, searchPlaces, withTimeout } from '../web/shopping-places.js';
afterEach(() => { vi.unstubAllGlobals(); });
describe('shopping Google Places integration', () => {
  it('distinguishes unknown hours and closure, preferring current holiday hours', () => {
    expect(hoursInfo({})).toEqual({ label: 'Google 未提供营业时间', days: [] });
    expect(hoursInfo({ regularOpeningHours: { weekdayDescriptions: [] } }).days).toEqual([]);
    expect(hoursInfo({ businessStatus: 'CLOSED_PERMANENTLY' }).label).toBe('已永久停业');
    expect(hoursInfo({ businessStatus: 'CLOSED_TEMPORARILY' }).label).toBe('暂时停业');
    const regular = { weekdayDescriptions: ['星期一: 10:00–20:00'] };
    expect(hoursInfo({ regularOpeningHours: regular })).toEqual({ label: '常规营业时间', days: regular.weekdayDescriptions });
    expect(hoursInfo({ regularOpeningHours: regular, currentOpeningHours: { weekdayDescriptions: ['星期一: 休息'] } })).toEqual({ label: '近期营业时间', days: ['星期一: 休息'] });
  });
  it('searches Japan using Places (New), requesting details only after selection', async () => {
    const searchByText = vi.fn().mockResolvedValue({ places: [{ id: 'ChIJ_example', displayName: '店铺' }] });
    const fetchFields = vi.fn().mockResolvedValue({});
    const options = [];
    class Place { constructor(value) { options.push(value); } fetchFields = fetchFields; static searchByText = searchByText; }
    vi.stubGlobal('window', { TripGoogleMap: { places: async () => ({ Place }) } });
    expect(await searchPlaces('大阪 相机')).toEqual([{ id: 'ChIJ_example', displayName: '店铺' }]);
    expect(searchByText.mock.calls[0][0]).toMatchObject({ textQuery: '大阪 相机', region: 'jp', language: 'zh-CN' });
    expect(searchByText.mock.calls[0][0].fields).not.toContain('regularOpeningHours');
    await placeDetails('ChIJ_example');
    expect(options).toEqual([{ id: 'ChIJ_example', requestedLanguage: 'zh-CN', requestedRegion: 'jp' }]);
    expect(fetchFields.mock.calls[0][0].fields).toContain('currentOpeningHours');
    expect(fetchFields.mock.calls[0][0].fields).toContain('regularOpeningHours');
  });
  it('propagates API failures and bounds stalled calls for retryable UI', async () => {
    vi.stubGlobal('window', { TripGoogleMap: { places: async () => { throw new Error('REQUEST_DENIED'); } } });
    await expect(searchPlaces('大阪')).rejects.toThrow('REQUEST_DENIED');
    await expect(placeDetails('ChIJ_example')).rejects.toThrow('REQUEST_DENIED');
    await expect(withTimeout(new Promise(() => {}), 5)).rejects.toThrow('超时');
    await expect(withTimeout(Promise.resolve('ok'), 5)).resolves.toBe('ok');
  });
  it('builds a safe Google fallback URL even when detail requests fail', () => {
    const url = new URL(mapsUrl('ChIJ_example', '相机 & 相纸'));
    expect(url.origin).toBe('https://www.google.com');
    expect(url.searchParams.get('query_place_id')).toBe('ChIJ_example');
    expect(url.searchParams.get('query')).toBe('相机 & 相纸');
  });
});
