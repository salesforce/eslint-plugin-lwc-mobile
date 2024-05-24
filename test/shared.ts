import { RuleTester } from '@typescript-eslint/rule-tester';

const RULE_TESTER_CONFIG = {
    parser: '@graphql-eslint/eslint-plugin',
    parserOptions: {
        graphQLConfig: {}
    }
};

export const ruleTester = new RuleTester(RULE_TESTER_CONFIG);
