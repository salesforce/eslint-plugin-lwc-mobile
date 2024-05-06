/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { RuleTester } = require('eslint');
const { RULE_TESTER_CONFIG } = require('../shared');

const allRules = require('../../../../lib/index');
const runtTester = new RuleTester(RULE_TESTER_CONFIG);

runtTester.run('@salesforce/lwc-mobile/import-apex', allRules.rules['import-apex'], {
    valid: [
        {
            code: "import getContactList from '@salesforce/apex/ContactController.getContactList';"
        }
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
        {
            code: "import getContactList from '@salesforce/apex/ContactController.getContactList';",
            output: "import getContactList from '@salesforce/apex/ContactController.getContactList';",
            errors: 1
        }
    ]
});
