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
  currentTestemConfig.routes["/ember-test"] = mimosaConfig.emberTest.assetFolder;

  // merge in testemConfig from mimosaConfig settings
  currentTestemConfig = _.extend( currentTestemConfig, mimosaConfig.emberTest.testemConfig );

  return currentTestemConfig;
};

exports.writeTestemConfig = function( mimosaConfig, options, next ) {
  var currentTestemConfig = {};
  if ( fs.existsSync( mimosaConfig.testemSimple.configFile ) ) {
    try {
      currentTestemConfig = require( mimosaConfig.testemSimple.configFile );
    } catch ( err ) {
      mimosaConfig.log.fatal( "Problem reading testem config, ", err );
      throw new Error( "Problem reading testem config, ", err );
    }
  }

  var baseTestemConfig = _craftBaseTestemConfig( mimosaConfig, _.clone( currentTestemConfig ) );

  mimosaConfig.emberTest.apps.forEach( function( app ) {
    var testDir = path.join( mimosaConfig.emberTest.assetFolder, app.testLocation );
    var testemConfig = _.extend(
      baseTestemConfig, { "test_page": path.join( testDir, "runner.html" ) } );
    var testemConfigPretty = JSON.stringify( testemConfig, null, 2 );
    var fileName = path.join( testDir, "testem.json" );
    fs.writeFileSync( fileName, testemConfigPretty );
  });

  next();
};
