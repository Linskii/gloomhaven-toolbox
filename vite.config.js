import { defineConfig } from 'vite';

// Set base to your repo name for GitHub Pages, e.g. '/gloomhaven-toolbox/'.
// Override via VITE_BASE env if hosting at a different path.
export default defineConfig({
  base: process.env.VITE_BASE || '/gloomhaven-toolbox/',
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
});
