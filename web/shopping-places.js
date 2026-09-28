export function mapsUrl(id, title = '店铺') {
  return 'https://www.google.com/maps/search/?' + new URLSearchParams({ api: '1', query: title, query_place_id: id });
}
export function hoursInfo(place) {
  if (place.businessStatus === 'CLOSED_PERMANENTLY') return { label: '已永久停业', days: [] };
  if (place.businessStatus === 'CLOSED_TEMPORARILY') return { label: '暂时停业', days: [] };
  const current = place.currentOpeningHours?.weekdayDescriptions;
  const regular = place.regularOpeningHours?.weekdayDescriptions;
  const days = current?.length ? current : regular?.length ? regular : [];
  return { label: days.length ? (current?.length ? '近期营业时间' : '常规营业时间') : 'Google 未提供营业时间', days };
}
export async function withTimeout(promise, ms = 20000) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Google 地图连接超时，请重试。')), ms); })]);
  } finally { clearTimeout(timer); }
}
export async function searchPlaces(query) {
  const { Place } = await withTimeout(window.TripGoogleMap.places());
  const { places } = await withTimeout(Place.searchByText({ textQuery: query, fields: ['id', 'displayName', 'formattedAddress', 'attributions'], language: 'zh-CN', region: 'jp', maxResultCount: 6, locationBias: { lat: 34.8, lng: 135.5 } }));
  return places;
}
export async function placeDetails(id) {
  const { Place } = await withTimeout(window.TripGoogleMap.places());
  const place = new Place({ id, requestedLanguage: 'zh-CN', requestedRegion: 'jp' });
  await withTimeout(place.fetchFields({ fields: ['displayName', 'formattedAddress', 'businessStatus', 'regularOpeningHours', 'currentOpeningHours', 'attributions'] }));
  return place;
}
