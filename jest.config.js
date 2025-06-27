const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    ...tsJestTransformCfg,
  },
  transformIgnorePatterns: ['/node_modules/(?!(ol|rbush|quickselect|earcut|quick-lru|pbf|.*\\.mjs$))'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
};