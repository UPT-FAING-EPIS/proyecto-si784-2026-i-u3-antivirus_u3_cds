export default {
  testEnvironment: 'node',
  transform: {},
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov'],
  collectCoverageFrom: [
    'bot.js'
  ],
  testMatch: ['**/tests/unit/**/*.spec.js']
};
