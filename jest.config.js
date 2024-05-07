/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

module.exports = {
    displayName: 'Unit Tests',
    setupFilesAfterEnv: ['jest-extended', 'jest-chain'],
    preset: "ts-jest",
    testMatch: [
        '<rootDir>/test/plugin.ts',
        '<rootDir>/test/lib/rules/**/*.ts',
        '!**/test/lib/rules/shared.ts'
    ],
    moduleFileExtensions: ['ts', 'js', 'json'],
    testResultsProcessor: 'jest-sonar-reporter',
    testPathIgnorePatterns: ['/node_modules/', '<rootDir>/lib/'],
    moduleDirectories: ['node_modules'],
    collectCoverage: true,
    collectCoverageFrom: ['lib/**/*.ts'],
    coverageDirectory: 'reports/coverage',
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
