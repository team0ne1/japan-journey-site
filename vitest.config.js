import { cloudflareTest } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  plugins: [cloudflareTest({
    wrangler: { configPath: './wrangler.jsonc' },
    remoteBindings: false,
    miniflare: { bindings: {
      APP_ORIGIN: 'https://trip.example.test',
      AUTH_SECRET: 'A'.repeat(43),
      SETUP_SECRET: 'B'.repeat(43),
    } },
  })],
  test: { include: ['tests/**/*.test.js'], fileParallelism: false, testTimeout: 20000 },
});
