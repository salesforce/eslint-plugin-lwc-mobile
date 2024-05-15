/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { ESLintUtils } from '@typescript-eslint/utils';
import { version, homepage } from '../../package.json';

export default ESLintUtils.RuleCreator(
    (name) => `${homepage}/blob/v${version}/lib/docs/${name}.md`
);
