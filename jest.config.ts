/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import type { Config } from 'jest';

const config: Config = {
    displayName: 'Unit Tests',
    setupFilesAfterEnv: ['jest-extended', 'jest-chain'],
    preset: 'ts-jest',
    testMatch: ['<rootDir>/test/**/*.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    },
    testResultsProcessor: 'jest-sonar-reporter',
    testPathIgnorePatterns: ['/node_modules/', '<rootDir>/lib/', '<rootDir>/test/shared.ts'],
    moduleDirectories: ['node_modules'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts', '!src/index.ts', '!src/configs/*.ts'],
    coverageDirectory: 'reports/coverage',
    moduleNameMapper: {
        '^@graphql-eslint/eslint-plugin/(.*)$':
            '<rootDir>/node_modules/@graphql-eslint/eslint-plugin/$1',
        '^@typescript-eslint/rule-tester$':
            '<rootDir>/node_modules/@typescript-eslint/rule-tester/dist/index.js'
    },
    maxWorkers: 1,
    reporters: [
        'default',
        [
            'jest-junit',
            {
                suiteName: 'Unit Tests',
                output: './reports/junit/jest-results.xml'
            }
        ]
    ]
};

export default config;
