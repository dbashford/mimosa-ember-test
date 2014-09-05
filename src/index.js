"use strict";

var path = require( "path" )
  , fs = require( "fs" )

  , wrench = require( "wrench" )
  , _ = require( "lodash" )
  , testemSimple = require( "mimosa-testem-simple" )

  , config = require( "./config" )
  , staticAssets = require( "./tasks/static-assets" )

  , specFiles = []
  , requireConfig = {}
  , mimosaRequire = null
  , lastOutputString = null
  , testVariablesPath = null
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



var __craftTestemConfig = function ( mimosaConfig, currentTestemConfig ) {
  /*eslint camelcase:0 */
  currentTestemConfig.test_page = mimosaConfig.emberTest.assetFolder + "/runner.html";
  if ( !currentTestemConfig.routes ) {
    currentTestemConfig.routes = {};
  }
  var jsDir = path.relative( mimosaConfig.root, mimosaConfig.watch.compiledJavascriptDir );
  currentTestemConfig.routes["/js"] = jsDir.split( path.sep ).join( "/" );
  return _.extend( currentTestemConfig, mimosaConfig.emberTest.testemConfig );
};

var _writeTestemConfig = function( mimosaConfig, options, next ) {
  var currentTestemConfig = {};
  if( fs.existsSync( mimosaConfig.testemSimple.configFile ) ) {
    try {
      currentTestemConfig = require( mimosaConfig.testemSimple.configFile );
    } catch ( err ) {
      logger.fatal( "Problem reading testem config, ", err );
      throw new Error( "Problem reading testem config, ", err );
    }
  }

  var testemConfig = __craftTestemConfig( mimosaConfig, _.clone( currentTestemConfig ) );
  var testemConfigPretty = JSON.stringify( testemConfig, null, 2 );

  if( JSON.stringify( currentTestemConfig, null, 2 ) !== testemConfigPretty ) {
    logger.debug( "Writing testem configuration to [[ " + mimosaConfig.testemSimple.configFile + " ]]" );
    fs.writeFileSync( mimosaConfig.testemSimple.configFile, testemConfigPretty );
  }

  next();
};

var registration = function( mimosaConfig, register ) {

  logger = mimosaConfig.log;
  var e = mimosaConfig.extensions;

  register( ["postBuild"], "init", _ensureDirectory );

  if ( !mimosaConfig.emberTest.bowerTestAssets ) {
    register( ["postBuild"], "init", staticAssets.writeStaticAssets );
  }

  /*

  register( ["postBuild"], "init", _writeTestemConfig );
  register( ["postBuild"], "init", _buildRequireConfig );

  register( ["add","update"], "afterWrite", _buildRequireConfig, e.javascript );
  register( ["remove"], "afterWrite", _buildRequireConfig, e.javascript );

  register( ["add","update"], "afterCompile", _buildSpecs, e.javascript );
  register( ["buildFile"], "init", _buildSpecs, e.javascript );
  register( ["remove"], "afterDelete", _removeSpec, e.javascript );

  testVariablesPath = path.join( mimosaConfig.emberTest.assetFolderFull, "test-variables.js" );

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
