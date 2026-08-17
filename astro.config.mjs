import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://workinozaukee.org',
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
