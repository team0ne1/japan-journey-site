const encoder = new TextEncoder();
export const bytes = (value: string): Uint8Array<ArrayBuffer> => new Uint8Array(encoder.encode(value));
export function encode(value: Uint8Array): string {
  return btoa(String.fromCharCode(...value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function decode(value: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
}
export const token = () => encode(crypto.getRandomValues(new Uint8Array(32)));
export const validToken = (s: unknown): s is string => typeof s === 'string' && /^[A-Za-z0-9_-]{43}$/.test(s);
export async function digest(value: string): Promise<string> {
  return encode(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes(value))));
}
async function hmacKey(secret: string) {
  return crypto.subtle.importKey('raw', bytes(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
export async function mac(secret: string, value: string): Promise<string> {
  return encode(new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(secret), bytes(value))));
}
export async function checkMac(secret: string, value: string, signature: string): Promise<boolean> {
  return crypto.subtle.verify('HMAC', await hmacKey(secret), decode(signature), bytes(value));
}
export async function sameSecret(secret: string, supplied: string): Promise<boolean> {
  return checkMac(secret, supplied, await mac(secret, secret));
}
async function encryptionKey(secret: string) {
  const raw = await crypto.subtle.digest('SHA-256', bytes('pending-invites:v1:' + secret));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}
export async function seal(secret: string, value: string, member: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: bytes(member) }, await encryptionKey(secret), bytes(value));
  return encode(iv) + '.' + encode(new Uint8Array(encrypted));
}
export async function unseal(secret: string, value: string, member: string): Promise<string> {
  const [iv, encrypted] = value.split('.');
  return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: decode(iv), additionalData: bytes(member) }, await encryptionKey(secret), decode(encrypted)));
}
export function normalizeAnswer(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
}
