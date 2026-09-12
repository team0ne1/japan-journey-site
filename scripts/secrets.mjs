import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
const values = {
  AUTH_SECRET: randomBytes(32).toString('base64url'),
  SETUP_SECRET: randomBytes(32).toString('base64url'),
};
if (process.argv.includes('--local')) {
  writeFileSync('.dev.vars', `APP_ORIGIN="http://localhost:8787"\nAUTH_SECRET="${values.AUTH_SECRET}"\nSETUP_SECRET="${values.SETUP_SECRET}"\n`, { mode: 0o600, flag: 'wx' });
  console.log('Created private .dev.vars for local development. Never upload or commit it.');
} else {
  console.log('Copy these two separate secrets into Cloudflare. Save them in your password manager.');
  for (const [name, value] of Object.entries(values)) console.log(`${name}=${value}`);
  console.log('Do not share screenshots, terminal output, or these values with members.');
}
