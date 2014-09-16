mimosa-ember-test
===========

## Overview

This is a [Mimosa](http://mimosa.io) module that integrates a qunit/testem test scaffold into your RequireJS/EmberJS Mimosa application.

Client JavaScript testing requires a good deal of configuration to set up, as well as plenty of research and trial and error before you can start writing tests. Ember.js apps require a bit more than other apps to get set up correctly.

The goal of this module is to keep the amount of configuration you need to create to a minimum.  Out of the box it requires no configuration. The module writes its own configuration derived from your project. Include the module and start writing tests.

This module incorporates [QUnit](http://qunitjs.com/), [ember-qunit](https://github.com/rwjblue/ember-qunit), [Sinon](http://sinonjs.org/), [Testem](https://github.com/airportyh/testem) and [PhantomJS](http://phantomjs.org/).

For more information regarding Mimosa, see http://mimosa.io

NOTE: This module requires Mimosa `2.3.14` to function properly, if this is an issue, please file a GitHub request to address.

## Usage

* `npm install -g phantomjs` (If you are on Windows, this will not install phantomjs properly. You will need to [download phantomjs from the site](http://phantomjs.org/download.html) and add the executable to your `PATH`)
* Add `'ember-test'` to your list of modules.  Mimosa will install the module for you when you start up.
* Check the [default config](https://github.com/dbashford/mimosa-ember-test#default-config) to verify it syncs with your app.  If it doesn't, you'll have a few things to configure/update.
* Write tests!  By default `ember-test` considers any file compiled/copied to `watch.compiledDir` that ends with `-spec.js`, `_spec.js`, `-test.js` or `_test.js` a test.

## Functionality

`ember-test` does all of its work in the `.mimosa/emberTest` folder (location configurable). It wants to keep all the scaffolding, test setup and test libraries out of your application.

### Vendor Assets

`ember-test` expects [QUnit](http://qunitjs.com/),  [ember-qunit](https://github.com/rwjblue/ember-qunit), [Sinon](http://sinonjs.org/), and require.js to be available. `ember-test` fabricates test runners and test scaffolding that depends on those libraries.

By default, `ember-test` will use Bower to incorporate those vendor test assets.  This module understands how [mimosa-bower](https://github.com/dbashford/mimosa-bower) works, and coordinates with mimosa-bower to get these specific tests assets into the right location inside `.mimosa/emberTest`.  If you do not change the default away from Bower, `ember-test` will verify you have a `bower.json` and check that file to make sure the right libraries are present.  If they are _not_, `ember-test` will stop Mimosa from starting up with a validation error.

If you prefer to not use Bower, set `bowerTestAssets` to `false` and `ember-test` will copy in versions of the vendor files that [it maintains](https://github.com/dbashford/mimosa-ember-test/tree/master/assets/vendor).

### Generated Test Assets

`ember-test` also generates test scaffold assets for each app configured in your project.  Those assets include

* `testem.json` file which configures how testem runs
* `runner.html` which is the file loaded in the browser to start the tests
* `test-main.js` which uses require.js to load both the vendor testing assets and the application tests before then kicking off the tests
* `test-variables.js` which contains JavaScript variables for your require.js config and an array of paths to your tests.

### Running

When `mimosa build` starts up `ember-test` will write all the assets and execute your tests. If all the tests pass, a message will indicate that on the console and you will not be notified any other way.  If tests fail,  the console will have the details of the test failure and a Growl message will get sent letting you know a test has broken.

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
  apps: [{
    testLocation: "tests",
    testAppFactory: "create_test_app",
    stylesheetPaths: [],
    requireConfig: null
  }],
  bowerTestAssets: true,
  emberAMDPath: "ember",
  executeDuringBuild: true,
  executeDuringWatch: false,
  safeAssets: [],
  specConvention: /[_-](spec|test)\.js$/,
  assetFolder: ".mimosa/emberTest",
  testemConfig: {
    "launch_in_dev": ["Firefox", "Chrome"],
    "launch_in_ci": ["PhantomJS"]
  }
}

testemSimple: {
  configFile: emberTest.assetFolder + "testem.json",
  port: null,
  watch: [],
  exclude:[],
}
```

#####apps `array of objects`
The configuration for all the ember applications in your project.  Can be just a single app.
#####apps.testLocation `string`
The path, relative to `watch.javascriptDir` where this ember app's test assets live
#####apps.testAppFactory `string`
The path, relative to `testLocation`, where a file exporting a function capable of generating a test-ready version of this ember app is located
#####apps.requireConfig `object or function`
The configuration used by require.js in your tests for this app. By default this does not need to be provided. `ember-test` will derive this from your project. To see what it derives, look at `.mimosa/emberTest/test-variables.js`. If an object is provided, it will be used instead of the derived config. If a function is provided, that function will be called and provided the derived config. This gives you a chance to just tweak a few properties if that is all that is needed.
#####bowerTestAssets `boolean`
When set to `true` this module will attempt to use mimosa-bower to load in vendor test assets
#####emberAMDPath `string`
The AMD path for ember. This is often aliased to `"ember"`, so that is the default
#####executeDuringBuild `boolean`
Determines whether mimosa will automatically execute the tests during build.
#####executeDuringWatch `boolean`
Determines whether mimosa will automatically execute the tests during watch as files are changed. Once a decent number of tests exist for your project, you may not want this to be set to `true` as tests can take awhile.
#####safeAssets `array of file names`
You may choose to alter the assets that Mimosa writes, for instance to use your own version of qunit.  Mimosa by default will overwrite the files in this folder.  If you don't want your file overwritten, add the name of the file to this array.  Just the name, no paths necessary.
#####specConvention `regex`
This is the regex `ember-test` uses to identify your tests. It'll run this regex against every compiled file to determine if it is indeed a test and if it is, `ember-test` will include it in the list of tests to be run.
#####assetFolder `string`
The folder `ember-test` places its assets. It is relative to the root of your project.
#####testemConfig `object`
Testem configuration that `ember-test` uses as default. This default defines the browsers to run the tests in. `ember-test` amplifies this with a few other computed properties
#####testemSimple `object`
`ember-test` wraps the [mimosa-testem-simple](https://github.com/dbashford/mimosa-testem-simple) module. It overrides the `testemSimple.configFile` property to point the `testem.json` files it creates.  The other testem-simple config can be updated/modified directly. The [config for testem-simple](https://github.com/dbashford/mimosa-testem-simple#default-config) allows you to tweak how testem is run.