'use strict';

const RULE_TESTER_CONFIG = {
    parser: require.resolve('@babel/eslint-parser'),
    parserOptions: {
        requireConfigFile: false,
        sourceType: 'module',
        babelOptions: {
            parserOpts: {
                plugins: [['decorators', { decoratorsBeforeExport: false }]]
            }
        }
    },
    plugins: ['@salesforce/lwc-gmobile']
};

module.exports = {
    RULE_TESTER_CONFIG
};