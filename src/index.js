"use strict";

var path = require( "path" )
  , fs = require( "fs" )

  , wrench = require( "wrench" )
  , _ = require( "lodash" )

  , config = require( "./config" )
  , staticAssets = require( "./tasks/static-assets" )
  , testemConfig = require( "./tasks/testem-config" )
  , specs = require( "./tasks/manage-specs" )

  , specFiles = []
  , lastOutputString = null;

var _ensureDirectory = function( mimosaConfig, options, next ) {
  var folder = mimosaConfig.emberTest.assetFolderFull;
  if ( !fs.existsSync( folder ) ) {
    wrench.mkdirSyncRecursive( folder, 0x1ff );
  }
  next();
};

var _buildTestVariables = function( mimosaConfig, options, next ) {

  var requireConfig = mimosaConfig.emberTest.requireConfig ||
    mimosaConfig.installedModules.mimosaRequire.requireConfig();

  if( !requireConfig.baseUrl ) {
    requireConfig.baseUrl = "/js";
  }

  // sort require config
  var newRequireConfig = {};
  _.sortBy( Object.keys( requireConfig ), function( k ) {
    return -(k.length);
  }).forEach( function( k ) {
    newRequireConfig[k] = requireConfig[k];
  });

  var requireConfigString = JSON.stringify( newRequireConfig, null, 2 );
  var specFilesString = JSON.stringify( specFiles.sort(), null, 2 );
  var outputString =
    "window.MIMOSA_TEST_REQUIRE_CONFIG = " + requireConfigString + "\n" +
    "window.MIMOSA_TEST_SPECS = " + specFilesString + "\n";

  if ( !lastOutputString || lastOutputString !== outputString ) {
    lastOutputString = outputString;
    var testVariablesPath = path.join( mimosaConfig.emberTest.assetFolderFull, "test-variables.js" );
    fs.writeFileSync( testVariablesPath, outputString );
  }

  next();
};

var registration = function( mimosaConfig, register ) {
  var js = mimosaConfig.extensions.javascript;

  register( ["postBuild"], "init", _ensureDirectory );
  if ( !mimosaConfig.emberTest.bowerTestAssets ) {
    register( ["postBuild"], "init", staticAssets.writeStaticAssets );
  }
  register( ["postBuild"], "init", testemConfig.writeTestemConfig );

  register( ["add", "update"], "afterCompile", specs.buildSpec, js );
  register( ["buildFile"], "init", specs.buildSpec, js );
  register( ["remove"], "afterDelete", specs.removeSpec, js );

  /*

  register( ["postBuild"], "init", _buildTestVariables );
  register( ["add","update","remove"], "afterWrite", _buildTestVariables, e.javascript );

  if (
      ( mimosaConfig.emberTest.executeDuringBuild && mimosaConfig.isBuild ) ||
      ( mimosaConfig.emberTest.executeDuringWatch && mimosaConfig.isWatch ) ) {
    testemSimple = require( "mimosa-testem-simple" )
    testemSimple.registration( mimosaConfig, register );
  }

  */
};

module.exports = {
  registration:    registration,
  defaults:        config.defaults,
  placeholder:     config.placeholder,
  validate:        config.validate,
  registerCommand: require( "./command/test" )
};
