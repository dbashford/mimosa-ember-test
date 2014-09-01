mimosa-ember-test
===========

## Overview

This is a [Mimosa](http://mimosa.io) module that integrates a qunit/testem test scaffold into your RequireJS-enabled Mimosa application.

Client JavaScript testing requires a good deal of configuration to set up, as well as plenty of research and trial and error before you can start writing tests. The goal of this module is to keep the amount of configuration you need to create to a minimum.  Out of the box it requires no configuration. The module writes its own configuration derived from your project. Include the module and start writing tests!

This module incorporates [QUnit](http://qunitjs.com/), [ember-qunit](https://github.com/rwjblue/ember-qunit), [Sinon](http://sinonjs.org/), [Testem](https://github.com/airportyh/testem) and [PhantomJS](http://phantomjs.org/).

For more information regarding Mimosa, see http://mimosa.io

NOTE: This module requires Mimosa `2.3.9` to function properly, if this is an issue, please file a GitHub request to address.

## Usage

* `npm install -g phantomjs` (If you are on Windows, this will not install phantomjs properly. You will need to [download phantomjs from the site](http://phantomjs.org/download.html) and add the executable to your `PATH`)
* Add `'ember-test'` to your list of modules.  Mimosa will install the module for you when you start up.
* Write tests!  By default `ember-test` considers any file compiled/copied to `watch.compiledDir` that ends with `-spec.js`, `_spec.js`, `-test.js` or `_test.js` a test.

## Functionality

`ember-test` will create a series of assets it needs for testing in `.mimosa/emberTest` at the root of your project.  That includes `runner.html`, `qunit.js`, `qunit.css`, `sinon.js`, and a copy of `require.js`.  It also includes a file for kicking off tests, and a file declaring your test files and requirejs config that is dynamically generated based on your code.

`ember-test` also generates a `testem.json` config file for configuring the test running.  By default that testem is configured to run all your qunit tests in a PhantomJS headless browser.

When running `mimosa build` starts up `ember-test` will write all the assets and execute your tests. If all the tests pass, a message will say as much on the console and you will not be notified any other way.  If tests fail,  the console will have the details of the test failure and a Growl message will get sent letting you know a test has broken.

## Command

### mimosa testscript

The `testscript` command will drop a platform appropriate script in the root of your project that you can use to execute your testem tests directly.  If you are writing tests or doing heavy test debugging, you will want to interact with testem directly and the script lets you do that.

You will want to run this in conjunction with mimosa running (`mimosa watch`), so that you tests get compiled/copied to the correct location and the configuration gets updated.  To run both `watch` and execute your tests, try `mimosa watch & ./test.sh`.

The script will be named test.[bat/sh]. The script takes a single option of ci.  When ci is passed in, testem will run in ci mode.

```
mimosa testscript
```

```
test.sh
test.sh ci
```

## Default Config

```javascript
emberTest: {
  executeDuringBuild: true,
  executeDuringWatch: false,
  safeAssets: [],
  specConvention: /[_-](spec|test)\.js$/,
  assetFolder:".mimosa/emberTest",
  testemConfig: {
    "launch_in_dev": ["Firefox", "Chrome"],
    "launch_in_ci": ["PhantomJS"]
  },
  requireConfig: null
}

testemSimple: {
  configFile: emberTest.assetFolder + "testem.json",
  port: null,
  watch: [],
  exclude:[],
}
```

* `executeDuringBuild`: Determines whether mimosa will automatically execute the tests during build.
* `executeDuringWatch`: Determines whether mimosa will automatically execute the tests during watch as files are changed.  Defaults to being off as ember tests can run slowly.
* `safeAssets`: You may choose to alter the assets that Mimosa writes, for instance to use your own version of qunit.  Mimosa by default will overwrite the files in this folder.  If you don't want your file overwritten, add the name of the file to this array.  Just the name, no paths necessary.
* `specConvention`: This is the regex `ember-test` uses to identify your tests. It'll run this regex against every compiled file to determine if it is indeed a test and if it is, `ember-test` will include it in the list of tests to be run.
*  `assetFolder`: This is the folder `ember-test` places its assets.
*  `testemConfig`: This is testem's configuration.  `ember-test` uses this default, which just defines the browsers to run the tests in, and then amplifies it with a few other computed properties
*  `requireConfig` This is the configuration used by require.js in your tests.  By default `ember-test` derives this from your project.  To see what it derives, look at `.mimosa/emberTest/test-variables.js`.
* `testemSimple`: this module wraps the [mimosa-testem-simple](https://github.com/dbashford/mimosa-testem-simple) module. It overrides the `testemSimple.configFile` property to point at `assetFolder` + `testem.json`.  The other testem-simple config can be updated/modified directly. See the [config for testem-simple](https://github.com/dbashford/mimosa-testem-simple#default-config) to see how you can use it via ember-test.
