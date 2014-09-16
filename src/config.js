"use strict";

var path = require( "path" )
  , fs = require( "fs" )
  , _ = require( "lodash" )
  , testemSimple = require( "mimosa-testem-simple" )
  , bower = require( "./bower" );

exports.defaults = function() {
  var defs = testemSimple.defaults();

  defs.emberTest = {
    bowerTestAssets: true,
    apps: [{
      testLocation: "tests",
      testAppFactory: "create_test_app",
      stylesheetPaths: [],
      requireConfig: null
    }],
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
  };

  return defs;
};

exports.placeholder = function() {
  var ph = testemSimple.placeholder().replace( "testem.json", ".mimosa/emberTest/testem.json" ) +
    "\n\n  emberTest:                  # Configuration for the ember-test module\n" +
    "    bowerTestAssets: true         # Whether or not to use bower to bring in test assets\n" +
    "                                  # like qunit, sinon, require.js and ember-qunit\n" +
    "    apps:[{                       # configuration for each ember app in your project\n" +
    "      testLocation: \"tests\"       # The path, relative to watch.javascriptDir where this\n" +
    "                                  # ember app's test assets live.\n" +
    "      testAppFactory: \"create_test_app\"  # Location, relative to testLocation, where a file\n" +
    "                                  # exporting a function capable of generating a test-ready\n" +
    "                                  # version of this ember app is located\n" +
    "      stylesheetPaths: []         # Paths to stylesheets necessary to properly run integration\n" +
    "                                  # tests for this app. Example: \"/public/stylesheets/vendor.css\"\n" +
    "      requireConfig: null         # RequireJS configuration. By default the mimosa-require\n" +
    "                                  # module is used by mimosa-ember-test to derive a\n" +
    "                                  # requirejs config. But if that derived config isn't right\n" +
    "                                  # a config can be pasted here. This parameter takes either\n" +
    "                                  # an object which overrides the requirejs config, or a function\n" +
    "                                  # which takes the inferred config as input which allow it to be\n" +
    "                                  # modified before it is used/included\n" +
    "    }]\n" +
    "    emberAMDPath: \"ember\"       # AMD path to ember.\n" +
    "    executeDuringBuild            # If true the tests will get executed during build.\n" +
    "    executeDuringWatch            # If true the tests will get executed during watch\n" +
    "                                  # with each file change.\n" +
    "    specConvention: /[_-](spec|test)\.js$/ # Convention for how test specs are named\n" +
    "    assetFolder: \".mimosa/emberTest\"     # Path from the root of the project to the folder that\n" +
    "                                  # will contain all the testing assets that the emberTest\n" +
    "                                  # module maintains and writes. If the folder does not exist\n" +
    "                                  # it will be created.\n" +
    "    safeAssets: []                # An array of file names ember-test will not overwrite.\n" +
    "                                  # By default ember-test overwrites any file it outputs.\n" +
    "                                  # So, for instance, if you have a specific version of\n" +
    "                                  # \"mocha.js\" you need to use, this setting should be [\"mocha.js\"]\n" +
    "    testemConfig:                 # Pass through values for the testem.json configuration.\n" +
    "                                  # The module will write the testem.json for you\n" +
    "      \"launch_in_dev\": [\"Firefox\", \"Chrome\"] # In dev mode launches in Firefox and Chrome\n" +
    "      \"launch_in_ci\": [\"PhantomJS\"]          # In CI mode uses PhantomJS (must be installed)\n";

  return ph;
};

var _determineIfRequireModuleNeeded = function( config, errors ) {
  var hasRequire = config.modules.some( function( mod ) {
    mod = mod.split("@").shift();
    return mod === "require" || mod === "mimosa-require";
  });

  // nothing to check
  if ( hasRequire ) {
    return;
  }

  var hasAppWithNoRequire = config.emberTest.apps.some( function( app ) {
    return !app.requireConfig;
  });

  if ( hasAppWithNoRequire ) {
    var msg = "mimosa-ember-test is configured but cannot be used unless mimosa-require" +
      " is installed or each emberTest.app has a requireConfig specified.";
    errors.push( msg );
  }
};

exports.validate = function( config, validators ) {

  var errors = [];

  // ember-test wraps testem-simple, need to validate both
  // can't just call testemsimple validate because config file
  // might not exist and that is ok
  if ( validators.ifExistsIsObject( errors, "testemSimple config", config.testemSimple ) ) {
    validators.ifExistsIsNumber( errors, "testemSimple.port", config.testemSimple.port );
    validators.ifExistsIsString( errors, "testemSimple.configFile", config.testemSimple.configFile );

    if ( config.testemSimple.watch ) {
      if ( Array.isArray( config.testemSimple.watch ) ) {
        var newFolders = [];
        config.testemSimple.watch.forEach( function( folder ) {
          if ( typeof folder === "string" ) {
            var newFolderPath = validators.determinePath( folder, config.root );
            if ( fs.existsSync( newFolderPath ) ) {
              newFolders.push( newFolderPath );
            }
          } else {
            errors.push( "testemSimple.watch must be an array of strings." );
          }
        });
        config.testemSimple.watch =  newFolders;
      } else {
        errors.push( "testemSimple.watch must be an array." );
      }
    }

    validators.ifExistsFileExcludeWithRegexAndString( errors, "testemSimple.exclude", config.testemSimple, config.root );
  }

  if ( validators.ifExistsIsObject(errors, "emberTest config", config.emberTest ) ) {
    var et = config.emberTest;

    if ( validators.ifExistsIsArrayOfObjects( errors, "emberTest.apps", et.apps ) ) {
      if ( !et.apps.length ) {
        errors.push( "emberTest.apps must contain at least one entry." );
      } else {
        et.apps.forEach( function( app ) {

          if ( app.requireConfig ) {
            var o = app.requireConfig;
            if ( typeof o !== "function" && (typeof o !== "object" || Array.isArray( o ) ) ) {
              errors.push( "emberTest.apps.requireConfig must be a function or an object." );
            }
          }

          var testLocationGood = false;
          if ( !app.testLocation ) {
            errors.push( "emberTest.apps.testLocation must be provided." );
          } else {
            if ( validators.ifExistsIsString( errors, "emberTest.apps.testLocation", app.testLocation ) ) {
              app.testLocationFull = path.join( config.watch.sourceDir, config.watch.javascriptDir, app.testLocation );
              if ( !fs.existsSync( app.testLocationFull ) ) {
                errors.push( "emberTest.apps.testLocation does not exist, resolved to " + app.testLocationFull + "." );
              } else {
                testLocationGood = true;
              }
            }
          }

          if ( !app.testAppFactory ) {
            errors.push( "emberTest.apps.testAppFactory must be provided." );
          } else {
            if ( validators.ifExistsIsString( errors, "emberTest.apps.testAppFactory", app.testAppFactory ) ) {
              if ( testLocationGood ) {
                app.testAppFactoryFull = path.join( app.testLocationFull, app.testAppFactory + ".js" );
                if ( !fs.existsSync( app.testAppFactoryFull ) ) {
                  errors.push( "emberTest.apps.testAppFactory does not exist, resolved to " + app.testAppFactoryFull + ".");
                }
              }
            }
          }

          validators.ifExistsIsArrayOfStrings( errors, "emberTest.apps.stylesheetPaths", app.stylesheetPaths );
        });
      }
    }

    validators.isBoolean( errors, "emberTest.executeDuringBuild", et.executeDuringBuild );
    validators.isBoolean( errors, "emberTest.executeDuringWatch", et.executeDuringWatch );
    if ( validators.isString( errors, "emberTest.assetFolder", et.assetFolder ) ) {
      et.assetFolderFull = path.join( config.root, et.assetFolder );
    }
    validators.ifExistsIsObject( errors, "emberTest.testemConfig", et.testemConfig );
    validators.ifExistsIsArrayOfStrings( errors, "emberTest.safeAssets", et.safeAssets );
    validators.isString( errors, "emberTest.emberAMDPath", et.emberAMDPath );
    validators.isRegex( errors, "emberTest.specConvention", et.specConvention );

    validators.isBoolean( errors, "emberTest.bowerTestAssets", et.bowerTestAssets );
  }

  if ( errors.length === 0 ) {
    // Update the testemSimple config
    var testLocations = _.pluck( et.apps, "testLocation" );
    config.testemSimple.configFile = testLocations.map( function( testLocation ) {
      return path.join( et.assetFolderFull, testLocation, "testem.json" );
    });

    bower.handleBower( config, errors );
    _determineIfRequireModuleNeeded( config, errors );
  }

  return errors;
};
