/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { RuleTester } from '@typescript-eslint/rule-tester';

import apexImport from '../../../src/rules/apex/apex-import';

const ruleTester = new RuleTester({
    parser: '@typescript-eslint/parser'
});

ruleTester.run('@salesforce/lwc-mobile/apex/apex-import', apexImport, {
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
            errors: [{ messageId: 'message' }]
        }
    ]
});
