'use strict';
window.TripGoogleMap = (() => {
  let sdk;
  const point = pair => ({ lat: pair[0], lng: pair[1] });
  function loadSDK(config) {
    if (sdk) return sdk;
    sdk = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const fail = error => { clearTimeout(timer); script.remove(); reject(error); };
      const timer = setTimeout(() => fail(new Error('Google 地图连接超时，请稍后重试。')), 20000);
      window.tripMapsReady = () => { clearTimeout(timer); resolve(); };
      window.gm_authFailure = () => {
        clearTimeout(timer);
        window.dispatchEvent(new Event('trip:maps-auth-failed'));
        fail(new Error('Google 地图暂不可用，请使用行程中的分段导航。'));
      };
      script.onerror = () => fail(new Error('暂时无法连接 Google 地图，请使用行程中的分段导航。'));
      const params = new URLSearchParams({ key: config.apiKey, loading: 'async', callback: 'tripMapsReady', v: 'quarterly', language: 'zh-CN', region: 'JP', auth_referrer_policy: 'origin' });
      script.src = 'https://maps.googleapis.com/maps/api/js?' + params;
      script.async = true;
      script.nonce = document.querySelector('script[nonce]')?.nonce || '';
      script.referrerPolicy = 'strict-origin';
      document.head.append(script);
    });
    sdk = sdk.catch(error => { sdk = undefined; throw error; });
    return sdk;
  }
  return class TripGoogleMap {
    static async places() {
      const response = await fetch('/api/maps-config', { credentials: 'same-origin', signal: AbortSignal.timeout(12000) });
      const config = await response.json();
      if (!response.ok) throw new Error(config.error || 'Google 地图尚未启用。');
      await loadSDK(config);
      return google.maps.importLibrary('places');
    }
    constructor(element, errorElement) {
      this.element = element;
      this.errorElement = errorElement;
      this.markers = new Map();
      this.lines = [];
      this.data = { version: 1, segments: [] };
      this.revision = 0;
      window.addEventListener('trip:maps-auth-failed', () => this.fail('Google 地图暂不可用，请使用行程中的分段导航。'));
    }
    fail(message) {
      this.errorElement.textContent = message;
      this.errorElement.hidden = false;
      if (!this.map) {
        this.element.replaceChildren();
        const p = document.createElement('p');
        p.className = 'map-loading';
        p.textContent = '地图暂未就绪，地点与交通说明仍可在行程中查看。';
        this.element.append(p);
      }
    }
    async init(places) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      let config;
      try {
        const response = await fetch('/api/maps-config', { credentials: 'same-origin', signal: controller.signal });
        config = await response.json();
        if (!response.ok || !config.apiKey || !config.mapId) throw new Error('Google 地图尚未启用；行程和分段导航可以正常使用。');
      } finally { clearTimeout(timeout); }
      await loadSDK(config);
      const [{ Map: GoogleMap, InfoWindow }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('maps'), google.maps.importLibrary('marker'),
      ]);
      this.Marker = AdvancedMarkerElement;
      this.element.replaceChildren();
      this.map = new GoogleMap(this.element, {
        center: { lat: 34.85, lng: 135.5 }, zoom: 9, minZoom: 5, maxZoom: 19,
        mapId: config.mapId, gestureHandling: 'cooperative', mapTypeControl: false,
        streetViewControl: false, fullscreenControl: true, clickableIcons: false,
      });
      this.popup = new InfoWindow({ maxWidth: 340 });
      this.errorElement.hidden = true;
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(this.element);
      // The one route-file request is independent of the Google routing API.
      const routeController = new AbortController();
      const routeTimeout = setTimeout(() => routeController.abort(), 10000);
      try {
        const response = await fetch('routes.json', { credentials: 'same-origin', signal: routeController.signal });
        if (!response.ok) throw new Error('routes');
        this.data = TripRouteData.validate(await response.json(), places);
      } catch {
        this.fail('预存路线暂不可用；当前以虚线显示游览顺序。');
      } finally { clearTimeout(routeTimeout); }
    }
    clear() {
      this.revision++;
      this.popup?.close();
      for (const marker of this.markers.values()) marker.map = null;
      for (const { line } of this.lines) { google.maps.event.clearInstanceListeners(line); line.setMap(null); }
      this.markers.clear();
      this.lines = [];
    }
    addPlace({ id, position, number, title, hotel, html, onClick }) {
      const pin = document.createElement('span');
      pin.className = 'trip-map-marker' + (hotel ? ' is-hotel' : '');
      pin.textContent = number;
      const marker = new this.Marker({ map: this.map, position: point(position), title, gmpClickable: true, zIndex: 10 });
      marker.append(pin);
      marker.addEventListener('gmp-click', onClick);
      marker.tripContent = html;
      this.markers.set(id, marker);
    }
    addLine({ path, mode, color, schematic, html, leg }) {
      const dotted = schematic || mode === 'walk' || mode === 'shuttle';
      const line = new google.maps.Polyline({
        map: this.map, path: path.map(point), strokeColor: color,
        strokeOpacity: dotted ? 0 : 0.9, strokeWeight: dotted ? 14 : 4, zIndex: 2,
        icons: [
          ...(dotted ? [{ icon: { path: google.maps.SymbolPath.CIRCLE, scale: schematic ? 1.8 : 2, fillColor: color, fillOpacity: .9, strokeOpacity: 0 }, offset: '0', repeat: schematic ? '12px' : '8px' }] : []),
          { icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, strokeColor: '#fff', strokeWeight: 1, strokeOpacity: 1, fillColor: color, fillOpacity: 1 }, offset: '55%' },
        ],
      });
      line.addListener('click', event => {
        this.highlight(leg);
        this.popup.setContent(html);
        this.popup.setPosition(event.latLng || point(path[Math.floor(path.length / 2)]));
        this.popup.open({ map: this.map, shouldFocus: false });
      });
      this.lines.push({ line, path, leg, dotted });
    }
    highlight(leg) {
      for (const entry of this.lines) {
        const selected = entry.leg === leg;
        const icons = entry.line.get('icons').map(sequence => ({ ...sequence, icon: { ...sequence.icon, scale: sequence.icon.path === google.maps.SymbolPath.CIRCLE ? (selected ? 2.6 : 1.8) : (selected ? 3.8 : 3) } }));
        entry.line.setOptions({ icons, strokeWeight: entry.dotted ? 14 : selected ? 7 : 4, zIndex: selected ? 5 : 2 });
      }
    }
    focusPlace(id) {
      const marker = this.markers.get(id);
      if (!marker) return;
      this.fitRequest = null;
      this.fitSerial = (this.fitSerial || 0) + 1;
      this.map.panTo(marker.position);
      this.map.setZoom(Math.max(this.map.getZoom() || 14, 14));
      this.popup.setContent(marker.tripContent);
      this.popup.open({ map: this.map, anchor: marker, shouldFocus: false });
    }
    fit(positions) {
      this.fitRequest = positions;
      if (!this.map || !positions.length || !this.element.clientWidth || !this.element.clientHeight) return;
      const serial = this.fitSerial = (this.fitSerial || 0) + 1;
      const bounds = new google.maps.LatLngBounds();
      positions.forEach(p => bounds.extend(point(p)));
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        if (serial === this.fitSerial && this.map.getZoom() > 15) this.map.setZoom(15);
      });
      this.map.fitBounds(bounds, 38);
    }
    resize() {
      if (!this.map || !this.element.clientWidth || !this.element.clientHeight) return;
      const size = `${this.element.clientWidth}:${this.element.clientHeight}`;
      if (size === this.lastSize) return;
      this.lastSize = size;
      if (this.fitRequest) this.fit(this.fitRequest);
    }
  };
})();
