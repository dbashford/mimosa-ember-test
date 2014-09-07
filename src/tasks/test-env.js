"use strict";

var path  = require( "path" );
var fs    = require( "fs" );
var _     = require( "lodash" );
var specs = require( "./test-specs" );

var testRunnerTemplate,
    testMainTemplate,
    testVariablesTemplate,
    testVariablesLastOutput;

function _compileTemplate( templateName ) {
  var templatePath = path.resolve( __dirname, "../../assets/templates/" + templateName );
  var templateText = fs.readFileSync( templatePath );
  return _.template( templateText );
}

function _writeFile( mimosaConfig, file, output ) {
  fs.writeFile( file, output, function( err ) {
    if ( err ) {
      mimosaConfig.log.error( "ember-test: Error writing file [[ " + file + " ]]", err );
    }
  });
}

function _buildTestRunner( mimosaConfig, options, app ) {
  if (!testRunnerTemplate) {
    testRunnerTemplate = _compileTemplate( "runner.html.template" );
  }

  var file = path.join( mimosaConfig.emberTest.assetFolderFull, app.testLocation, "runner.html" );
  var output = testRunnerTemplate({
    testLocation: app.testLocation,
    stylesheetPaths: app.stylesheetPaths
  });

  _writeFile( mimosaConfig, file, output );
}

function _buildTestMain( mimosaConfig, options, app ) {
  if (!testMainTemplate) {
    testMainTemplate = _compileTemplate( "test-main.js.template" );
  }

  var file = path.join( mimosaConfig.emberTest.assetFolderFull, app.testLocation, "test-main.js" );
  var output = testMainTemplate({
    emberPath: mimosaConfig.emberTest.emberAMDPath,
    testApp: [ app.testLocation, app.testAppFactory ].join("/")
  });

  _writeFile( mimosaConfig, file, output );
}

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

  if (!testVariablesTemplate) {
    testVariablesTemplate = _compileTemplate( "test-variables.js.template" );
  }

  mimosaConfig.emberTest.apps.forEach( function( app ) {
    var requireConfig = app.requireConfig || mimosaRequireConfig;

    requireConfig.baseUrl = requireConfig.baseUrl || "/js";

    // sort require config
    var appRequireConfig = {};
    _.sortBy( Object.keys( requireConfig ), function( k ) {
      return -(k.length);
    }).forEach( function( k ) {
      appRequireConfig[k] = requireConfig[k];
    });

    var output = testVariablesTemplate({
      requireConfig: JSON.stringify( appRequireConfig, null, 2 ),
      specFiles: JSON.stringify( specs.specFiles( app.testLocation ).sort(), null, 2 )
    });

    if (!testVariablesLastOutput || testVariablesLastOutput !== output ) {
      testVariablesLastOutput = output;

      var file = path.join( mimosaConfig.emberTest.assetFolderFull, app.testLocation, "test-variables.js" );
      _writeFile( mimosaConfig, file, output );
    }
  });

  next();
};
