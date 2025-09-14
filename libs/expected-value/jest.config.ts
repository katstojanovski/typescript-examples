export default {
  displayName: 'expected-value',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  collectCoverage: true,
  coverageReporters: ['text'],
  moduleFileExtensions: ['ts', 'js', 'html'],
};
