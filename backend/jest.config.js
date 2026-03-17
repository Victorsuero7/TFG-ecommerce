export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  runInBand: true,
  globalTeardown: './test/global-teardown.ts',
  globalSetup: './test/global-setup.ts',    // ← crea schema ANTES de todo

};