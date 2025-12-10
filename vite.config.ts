import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173
  },
  // no plugins for now — temporary workaround for ESM plugin resolution issue on this machine
});