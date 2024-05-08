/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import eslint from "@eslint/js";
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
    ...tsEslint.configs.stylistic,

    {
        rules: {
            "strict": ["error", "global"],
            "@typescript-eslint/no-extra-non-null-assertion": "off"
        }
    }
);