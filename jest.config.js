module.exports = {
    clearMocks: true,
    roots: ['<rootDir>/src'],
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'src'],
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
    testRegex: ".*\\/.*spec\\.ts$",
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },

    coverageDirectory: 'coverage',
    coverageReporters: ['cobertura', 'html', 'lcov', 'text', 'clover', 'text-summary'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/core/application/dto/**',
        '!src/**/*.module.ts',
        '!src/**/*.spec.ts',
        '!src/core/domain/entities/**',
        '!src/main.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1'
    },
    testResultsProcessor: "jest-sonar-reporter"
}