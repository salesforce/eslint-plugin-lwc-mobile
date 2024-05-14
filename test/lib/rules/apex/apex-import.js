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

runtTester.run('@salesforce/lwc-mobile/apex-import', allRules.rules['apex-import'], {
    valid: [],
    invalid: [
        {
            code: `
                import { LightningElement, wire } from 'lwc';
                import getContactList from '@salesforce/apex/ContactController.getContactList';

                export default class ApexWireMethodToFunction extends LightningElement {
                    contacts;
                    error;

                    @wire(getContactList)
                    wiredContacts({ error, data }) {
                        if (data) {
                            this.contacts = data;
                            this.error = undefined;
                        } else if (error) {
                            this.error = error;
                            this.contacts = undefined;
                        }
                    }
                }ß
            `,
            errors: [
                {
                    message: `Importing apex modules can have issue for offline.`
                }
            ]
        },
    ],
});
