module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,

  moduleFileExtensions: ['ts', 'js', 'json'],

  testMatch: ['**/?(*.)+(spec|test).ts'],

  transform: {
    '^.+\\.ts$': 'ts-jest'
  },

  moduleDirectories: ['node_modules', 'src']
};