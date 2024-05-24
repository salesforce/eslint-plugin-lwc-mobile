/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { RuleTester } from '@typescript-eslint/rule-tester';

import { rule, APEX_IMPORT_RULE_ID } from '../../../src/rules/apex/apex-import';
import { createScopedModuleRuleName } from '../../../src/util/createScopedModuleRuleName';

const ruleTester = new RuleTester({
    parser: '@typescript-eslint/parser'
});

ruleTester.run(createScopedModuleRuleName(APEX_IMPORT_RULE_ID), rule, {
    valid: [
        {
            code: `
            import { LightningElement, wire } from 'lwc';
            import getContactList from 'ContactController.getContactList';

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
            }
            `
        }
    ],
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
            }
            `,
            errors: [{ messageId: APEX_IMPORT_RULE_ID }]
        }
    ]
});
