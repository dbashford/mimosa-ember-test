"use strict";

var fs = require( "fs" )
  , path = require( "path" )
  , _ = require( "lodash" );

var _craftBaseTestemConfig = function ( mimosaConfig, currentTestemConfig ) {
  // add routes
  if ( !currentTestemConfig.routes ) {
    currentTestemConfig.routes = {};
  }
  var jsDir = path.relative( mimosaConfig.root, mimosaConfig.watch.compiledJavascriptDir );
  currentTestemConfig.routes["/js"] = jsDir.split( path.sep ).join( "/" );
  currentTestemConfig.routes["/js2"] = mimosaConfig.emberTest.assetFolder;

  // merge in testemConfig from mimosaConfig settings
  currentTestemConfig = _.extend( currentTestemConfig, mimosaConfig.emberTest.testemConfig );

  return currentTestemConfig;
};

exports.writeTestemConfig = function( mimosaConfig, options, next ) {
  var currentTestemConfig = {};
  if( fs.existsSync( mimosaConfig.testemSimple.configFile ) ) {
    try {
      currentTestemConfig = require( mimosaConfig.testemSimple.configFile );
    } catch ( err ) {
      mimosaConfig.log.fatal( "Problem reading testem config, ", err );
      throw new Error( "Problem reading testem config, ", err );
    }
  }

  var baseTestemConfig = _craftBaseTestemConfig( mimosaConfig, _.clone( currentTestemConfig ) );

  // write runner per-app
  var moreThanOne = mimosaConfig.emberTest.apps.length > 1;
  mimosaConfig.emberTest.apps.forEach( function( app, i ) {

    if ( !moreThanOne ) {
      i = "";
    } else {
      i += 1;
    }

    // add test runner page
    /*eslint camelcase:0 */
    var testemConfig = _.extend(
      baseTestemConfig,
      { test_page: mimosaConfig.emberTest.assetFolder + "/runner" + i + ".html" } );

    var testemConfigPretty = JSON.stringify( testemConfig, null, 2 );

    if( JSON.stringify( currentTestemConfig, null, 2 ) !== testemConfigPretty ) {
      mimosaConfig.log.debug( "Writing testem configuration to [[ " + mimosaConfig.testemSimple.configFile + " ]]" );
      var fileName = mimosaConfig.testemSimple.configFile;
      if ( moreThanOne ) {
        var ext = path.extname( mimosaConfig.testemSimple.configFile );
        fileName = fileName.replace( ext, i + ext );
      }
      fs.writeFileSync( fileName, testemConfigPretty );
    }
  });

  next();
};
