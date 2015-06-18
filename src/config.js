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

var _determineIfRequireModuleNeeded = function( config, errors ) {
  var hasRequire = config.modules.some( function( mod ) {
    mod = mod.split("@").shift();
    return mod === "require" || mod === "mimosa-require";
  });

  // nothing to check
  if ( hasRequire ) {
    if (config.require.safeDeps) {
      config.require.safeDeps.push("ember-qunit");
    }
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
