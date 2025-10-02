# @salesforce/eslint-plugin-lwc-mobile

## Installation

To add this plugin to your package/project, install it with your favorite Node.js package manager.

### yarn

```sh
$ yarn add --dev @salesforce/eslint-plugin-lwc-mobile
```

### npm

```sh
$ npm install --save-dev @salesforce/eslint-plugin-lwc-mobile
```

## Configuration

### ESLint &gt;= 9

The default configurations are now in the flat config format supported by ESLint 9 and beyond. To include `recommendedConfigs ` in your flat config, spread it into your configuration array. Note that `recommendedConfigs` is a collection of preset configs and must be expanded accordingly.:

```javascript
// eslint.config.mjs
import js from '@eslint/js';
import lwcMobilePlugin from "@salesforce/eslint-plugin-lwc-mobile";

export default [
    { plugins: { "@salesforce/lwc-mobile": lwcMobilePlugin } },
    js.configs.recommended,
    ...lwcMobilePlugin.recommendedConfigs,
];
```

### ESLint &lt; 9
Configurations for legacy ESLint have moved to `-legacy` extensions. Here's an example snippet of a `.eslintrc.json` configuration file, that will configure the `eslint-plugin-lwc-mobile` plugin. Extending the `plugin:@salesforce/lwc-mobile/recommended-legacy` ESLint configuration will enable static analysis on all `.js` files used in your Lightning web components.

```json
{
    "extends": ["eslint:recommended", "plugin:@salesforce/lwc-mobile/recommended-legacy"]
}
```
