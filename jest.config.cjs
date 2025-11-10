// jest.config.cjs
// Configuración de Jest para JARVIS Testing System

module.exports = {
  // Entorno de pruebas
  testEnvironment: 'node',

  // Patrones de tests
  testMatch: [
    '**/test-*.cjs',
    '**/test-*.js',
    '**/*.test.cjs',
    '**/*.test.js',
    '**/__tests__/**/*.js',
    '**/__tests__/**/*.cjs'
  ],

  // Ignorar directorios
  testPathIgnorePatterns: [
    '/node_modules/',
    '/web-interface/frontend/',
    '/dist/',
    '/build/',
    '/coverage/'
  ],

  // Coverage
  collectCoverageFrom: [
    'core/**/*.cjs',
    'core/**/*.js',
    'web-interface/backend/**/*.cjs',
    '!core/**/*.test.{js,cjs}',
    '!**/node_modules/**',
    '!**/test-*.{js,cjs}'
  ],

  coverageDirectory: 'coverage',

  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'json-summary',
    'lcov'
  ],

  // Thresholds
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },

  // Timeouts
  testTimeout: 30000,

  // Reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-reports',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true
    }]
  ],

  // Configuración de módulos
  moduleFileExtensions: ['js', 'cjs', 'json'],

  // Transformaciones
  transform: {},

  // Verbose
  verbose: true,

  // Detección de handles abiertos
  detectOpenHandles: true,

  // Force exit
  forceExit: true,

  // Max workers
  maxWorkers: '50%'
};
