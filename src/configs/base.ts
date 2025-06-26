/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { Linter, ESLint } from 'eslint';
import { rules, flatConfigs, processors } from '@graphql-eslint/eslint-plugin';

const config: Linter.Config = {
    plugins: {
        '@graphql-eslint': {
            rules,
            configs: flatConfigs['operations-recommended'],
            processors
        } as ESLint.Plugin
    }
};

export = config;
