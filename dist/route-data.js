'use strict';
// Persisted geometry only. This module never calls a routing service.
window.TripRouteData = (() => {
  const modes = new Set(['walk', 'rail', 'bus', 'shuttle']);
  const coordinate = p => Array.isArray(p) && p.length === 2 &&
    Number.isFinite(p[0]) && Math.abs(p[0]) <= 90 && Number.isFinite(p[1]) && Math.abs(p[1]) <= 180;
  function validate(data, places) {
    if (data?.version !== 1 || !Array.isArray(data.segments)) throw new Error('Invalid route file');
    const keys = new Set();
    for (const segment of data.segments) {
      const key = `${segment.plan}:${segment.day}:${segment.toStep}`;
      if (!['A', 'B', 'shared'].includes(segment.plan) || !Number.isInteger(segment.day) || segment.day < 1 || segment.day > 7 ||
          typeof segment.toStep !== 'string' || !segment.toStep || keys.has(key) ||
          !places[segment.from] || !places[segment.to] || !Array.isArray(segment.parts) || !segment.parts.length ||
          !['independent', 'google-routes'].includes(segment.source) || !segment.sourceNote?.trim()) throw new Error('Invalid route segment: ' + key);
      keys.add(key);
      if (segment.source === 'google-routes') {
        const captured = Date.parse(segment.capturedAt), expires = Date.parse(segment.expiresAt);
        if (!Number.isFinite(captured) || !Number.isFinite(expires) || expires <= captured || expires - captured > 30 * 86400000)
          throw new Error('Google route requires a maximum 30-day retention window: ' + key);
      }
      for (const part of segment.parts) {
        if (!modes.has(part.mode) || typeof part.label !== 'string' || !Array.isArray(part.path) || part.path.length < 2 || !part.path.every(coordinate))
          throw new Error('Invalid route geometry: ' + key);
      }
    }
    return data;
  }
  function find(data, day, plan, previous, next, now = Date.now()) {
    const candidates = (data?.segments || []).filter(s => s.day === day && s.toStep === next.commentId && (s.plan === plan || s.plan === 'shared'));
    const saved = candidates.find(s => s.plan === plan) || candidates[0];
    if (!saved || saved.from !== previous.id || saved.to !== next.id) return { segment: null, reason: 'missing' };
    if (saved.source === 'google-routes' && (now >= Date.parse(saved.expiresAt) || now < Date.parse(saved.capturedAt)))
      return { segment: null, reason: 'expired' };
    return { segment: saved, reason: null };
  }
  return { validate, find };
})();
