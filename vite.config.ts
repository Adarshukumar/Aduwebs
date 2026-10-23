import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react(), tailwindcss()];
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- optional local-only plugin
    // @ts-ignore
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {
    /* optional local-only plugin — expected to be absent in CI */
  }

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
    preview: {
      // The sandbox proxies the preview through a generated host name.
      allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
    },
    server: {
      allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
      host: '0.0.0.0',
    },
    build: {
      // Long-lived vendor chunks: a copy edit never invalidates React again.
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return;
            if (
              id.includes('react-dom') ||
              id.includes('/react/') ||
              id.includes('react-router') ||
              id.includes('scheduler')
            ) {
              return 'react';
            }
            if (id.includes('animejs')) return 'anime';
            if (id.includes('lenis')) return 'lenis';
          },
        },
      },
    },
  };
})
