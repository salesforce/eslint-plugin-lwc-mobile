'use strict';

const base = require('./configs/base');
const recommended = require('./configs/recommended');

const enforceFooBar = require('./rules/enforce-foo-bar');

module.exports = {
    rules: {
        'enforce-foo-bar': enforceFooBar,
    },
    config: {
        base,
        recommended
    }

}