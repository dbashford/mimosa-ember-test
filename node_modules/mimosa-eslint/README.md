mimosa-eslint
===========

## Overview

This is a ESLint module for the Mimosa build tool. It will perform static code analysis on your JavaScript code.

For more information regarding ESLint, see http://eslint.org

For more information regarding Mimosa, see http://mimosa.io

## Usage

Add `'eslint'` to your list of modules.  That's all!  Mimosa will install the module for you when you start `mimosa watch` or `mimosa build`.

## Functionality

This module will run the ESLint static analysis tool over your JavaScript code during `mimosa watch` and `mimosa build`.

You can provide rule overrides directly through this module's configuration or with an external `.json` config file.

This module lets ESLint's own error formatters handle formatting the errors. ESLint has several formatters to choose from. You can configure which you'd like this module to use.

## Default Config

```javascript
eslint: {
  exclude: [],
  vendor: false,
  rulesdir: null,
  format: "stylish",
  options: {}
}
```

* `exclude`: array of strings or regexes that match files to not eslint, strings are paths that can be relative to the `watch.sourceDir` or absolute.
* `vendor`: whether or not to ESLint vendor code
* `rulesdir`: path to a directory with custom rules to be added to the built-in rules that come with ESLint. The built-in rules can be found on the [ESLint website](http://eslint.org/docs/rules/). The source for those rules can be found [in the ESLint GitHub repo](https://github.com/eslint/eslint/tree/master/lib/rules).
* `format`: A pass-through to ESLint's `formatter` setting. The formatter chosen effects how ESLint's output appears on the console. The default, `stylish`, is ESLint's default formatter.
* `options`: This can be either a string or an object.  If a string it is a path to your ESLint configuration file. The default ESLint configuration can be found [in the ESLint GH](https://github.com/eslint/eslint/blob/master/conf/eslint.json). If `options` is an object it is the actual ESLint configuration inlined in the mimosa-config.

## Example Config

Look no further than this Mimosa module for an example of how to include and configure ESLint in your Mimosa project. This is the config snippet for this module.

```javascript
eslint: {
  options: {
    rules: {
      "no-global-strict": 0,
      "no-underscore-dangle": 0
    },
    env: {
      node:true
    }
  }
}
```

It includes turning on the `node` environment and updating some rules.  `no-global-strict` is turned off because this is node code.  `no-underscore-dangle` (using something like `_functionName`) is also turned off cause I'm dangly with my underscores.

## Inline Config

ESLint also lets you turn off warnings/errors with comments in your code.  That is also done [in the code of this module](https://github.com/dbashford/mimosa-eslint/blob/master/src/index.js#L17).

```javascript
if ( output ) {
  /* eslint no-console:0 */
  console.log( output );
}
```

In this case `no-console` is turned off for just this line.  I want to `console` there, but not anywhere else.
