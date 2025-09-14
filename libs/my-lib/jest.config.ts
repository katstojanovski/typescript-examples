export default {
  displayName: 'my-lib',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  collectCoverage: true,
  coverageReporters: ['text'],
  moduleFileExtensions: ['ts', 'js', 'html'],
};
