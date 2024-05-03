/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { RuleTester } = require('eslint');
const { RULE_TESTER_CONFIG } = require('./shared');

const allRules = require('../../../lib/index');
const runtTester = new RuleTester(RULE_TESTER_CONFIG);

runtTester.run('@salesforce/lwc-mobile/enforce-foo-bar', allRules.rules['enforce-foo-bar'], {
    valid: [
        {
            code: "const foo = 'bar';"
        }
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
        {
            code: "const foo = 'baz';",
            output: 'const foo = "bar";',
            errors: 1
        }
    ]
});
