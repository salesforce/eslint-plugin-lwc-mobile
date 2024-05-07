import { RuleTester } from '@typescript-eslint/rule-tester';

import ruleEnforceFoorBar from '../../../lib/rules/enforce-foo-bar';

const ruleTester = new RuleTester({
    parser: '@typescript-eslint/parser'
});

ruleTester.run('@salesforce/lwc-mobile/enforce-foo-bar', ruleEnforceFoorBar, {
    valid: [
        {
            code: "const foo = 'bar';"
        }
    ],
    invalid: [
        {
            code: "const foo = 'baz';",
            output: 'const foo = "bar";',
            errors: [{ messageId: 'messageIdForFooMustBeBar' }]
        }
    ]
});
