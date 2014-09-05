"use strict";

var path = require( "path" )
  , fs = require( "fs" )

  , wrench = require( "wrench" )
  , _ = require( "lodash" )
  , testemSimple = require( "mimosa-testem-simple" )

  , config = require( "./config" )
  , staticAssets = require( "./tasks/static-assets" )
  , writeTestem = require( "./tasks/testem-config" )

  , specFiles = []
  , requireConfig = {}
  , mimosaRequire = null
  , lastOutputString = null
  , logger = null;

var _ensureDirectory = function( mimosaConfig, options, next ) {
  var folder = mimosaConfig.emberTest.assetFolderFull;
  if ( !fs.existsSync( folder ) ) {
    wrench.mkdirSyncRecursive( folder, 0x1ff );
  }
  next();
};



var _buildRequireConfig = function( mimosaConfig, options, next ) {

  requireConfig = mimosaConfig.emberTest.requireConfig || mimosaRequire.requireConfig();

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

var __specs = function( mimosaConfig, options, manipulateSpecs ) {
  options.files.forEach( function( file ) {
    if ( mimosaConfig.emberTest.specConvention.test( file.outputFileName ) ) {
      var specPath = file.outputFileName.replace( mimosaConfig.watch.compiledJavascriptDir + path.sep, "" );
      specPath = specPath.replace( path.extname( specPath ), "" );
      specPath = specPath.split( path.sep ).join( "/" );
      manipulateSpecs( specPath );
    }
  });
};

var _buildSpecs = function( mimosaConfig, options, next ) {
  __specs( mimosaConfig, options, function( specPath ) {
    if( specFiles.indexOf( specPath ) === -1 ) {
      specFiles.push( specPath );
    }
  });

  next();
};

var _removeSpec = function( mimosaConfig, options, next ) {
  __specs( mimosaConfig, options, function( specPath ) {
    var specFileLoc = specFiles.indexOf( specPath );
    if( specFileLoc > -1 ) {
      specFiles.splice( specFileLoc, 1 );
    }
  });
  next();
};

var registration = function( mimosaConfig, register ) {

  logger = mimosaConfig.log;
  var e = mimosaConfig.extensions;

  register( ["postBuild"], "init", _ensureDirectory );

  if ( !mimosaConfig.emberTest.bowerTestAssets ) {
    register( ["postBuild"], "init", staticAssets.writeStaticAssets );
  }

  // register( ["postBuild"], "init", writeTestem.writeTestemConfig );

  /*

  register( ["postBuild"], "init", _buildRequireConfig );
  register( ["add","update","remove"], "afterWrite", _buildRequireConfig, e.javascript );

  register( ["add","update"], "afterCompile", _buildSpecs, e.javascript );
  register( ["buildFile"], "init", _buildSpecs, e.javascript );

  register( ["remove"], "afterDelete", _removeSpec, e.javascript );

  if (
      ( mimosaConfig.emberTest.executeDuringBuild && mimosaConfig.isBuild ) ||
      ( mimosaConfig.emberTest.executeDuringWatch && mimosaConfig.isWatch ) ) {
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
