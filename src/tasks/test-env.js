"use strict";

var path  = require( "path" )
  , fs    = require( "fs" )
  , _     = require( "lodash" )
  , specs = require( "./test-specs" )
  , testRunnerTemplate
  , testMainTemplate
  , testVariablesTemplate
  , testVariablesLastOutput = {};

var _compileTemplate = function( templateName ) {
  var templatePath = path.resolve( __dirname, "../../assets/templates/" + templateName );
  var templateText = fs.readFileSync( templatePath );
  return _.template( templateText );
};

var _buildTestRunner = function( mimosaConfig, options, app ) {
  if ( !testRunnerTemplate ) {
    testRunnerTemplate = _compileTemplate( "runner.html.template" );
  }

  var file = path.join( mimosaConfig.emberTest.assetFolderFull, app.testLocation, "runner.html" );
  var output = testRunnerTemplate({
    testLocation: app.testLocation,
    stylesheetPaths: app.stylesheetPaths || []
  });

  fs.writeFileSync( file, output );
};

var _buildTestMain = function( mimosaConfig, options, app ) {
  if ( !testMainTemplate ) {
    testMainTemplate = _compileTemplate( "test-main.js.template" );
  }

  var file = path.join( mimosaConfig.emberTest.assetFolderFull, app.testLocation, "test-main.js" );
  var output = testMainTemplate({
    emberPath: mimosaConfig.emberTest.emberAMDPath,
    testApp: [ app.testLocation, app.testAppFactory ].join("/")
  });

  fs.writeFileSync( file, output );
};

exports.buildTestRunner = function( mimosaConfig, options, next ) {
  mimosaConfig.emberTest.apps.forEach( function( app ) {
    _buildTestRunner( mimosaConfig, options, app );
    _buildTestMain( mimosaConfig, options, app );
  });
  next();
};

exports.buildTestVariables = function( mimosaConfig, options, next ) {
  var mimosaRequire = mimosaConfig.installedModules["mimosa-require"];
  var mimosaRequireConfig = mimosaRequire.requireConfig();

  if ( !testVariablesTemplate ) {
    testVariablesTemplate = _compileTemplate( "test-variables.js.template" );
  }

  mimosaConfig.emberTest.apps.forEach( function( app ) {
    var requireConfig = app.requireConfig || mimosaRequireConfig;

    requireConfig.baseUrl = requireConfig.baseUrl || "/js";

    // sort require config
    // trying to avoid accidentally creating a diff in the output code
    var appRequireConfig = {};
    var sortedKeys = Object.keys( requireConfig );
    sortedKeys.sort();
    sortedKeys.forEach( function( k ) {
      appRequireConfig[k] = requireConfig[k];
    });

    var output = testVariablesTemplate({
      requireConfig: JSON.stringify( appRequireConfig, null, 2 ),
      specFiles: JSON.stringify( specs.specFiles( app.testLocation ).sort(), null, 2 )
    });

    var file = path.join( mimosaConfig.emberTest.assetFolderFull, app.testLocation, "test-variables.js" );
    if ( !testVariablesLastOutput[file] || testVariablesLastOutput[file] !== output ) {
      testVariablesLastOutput[file] = output;
      fs.writeFileSync( file, output );
    }
  });

  next();
};
