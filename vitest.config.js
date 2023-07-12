import { defineConfig } from 'vitest/config'

const config = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ["src/**/*.js"],
      exclude: ["/lib/", "/node_modules/"],
      branches: 80,
      functions: 90,
      lines: 90,
      statements: -10,
    },
    testTimeout: 30000
  }
});

export default config;
