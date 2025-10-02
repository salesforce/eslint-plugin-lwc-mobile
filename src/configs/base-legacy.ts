/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { Linter } from 'eslint';

export = {
    plugins: ['@salesforce/lwc-mobile', '@graphql-eslint']
} satisfies Linter.BaseConfig;
