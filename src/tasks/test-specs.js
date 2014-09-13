"use strict";

var path = require( "path" )
  , specFiles = {};

var _specPath = function( root, filename ) {
  var specPath = path.relative( root, filename );
  specPath = specPath.replace( path.extname( specPath ), "" );
  specPath = specPath.split( path.sep ).join( "/" );
  return specPath;
};

var _run = function( mimosaConfig, options, manipulateSpec ) {
  var root = mimosaConfig.watch.compiledJavascriptDir;
  var apps = mimosaConfig.emberTest.apps;
  var specConvention = mimosaConfig.emberTest.specConvention;

  options.files.forEach( function( file ) {
    var filename = file.outputFileName;
    if ( specConvention.test( filename ) ) {
      apps.forEach( function( app ) {
        if ( filename.indexOf( path.join( root, app.testLocation ) + path.sep ) === 0 ) {
          manipulateSpec( _specPath( root, filename ), app.testLocation );
        }
      });
    }
  });
};

exports.buildSpec = function( mimosaConfig, options, next ) {
  _run( mimosaConfig, options, function( specPath, testLocation ) {
    var files = specFiles[testLocation] = specFiles[testLocation] || [];
    if ( files.indexOf( specPath ) === -1 ) {
      files.push( specPath );
    }
  });
  next();
};

exports.removeSpec = function( mimosaConfig, options, next ) {
  _run( mimosaConfig, options, function( specPath, testLocation ) {
    var files = specFiles[testLocation];
    if ( files ) {
      var specFileLoc = files.indexOf( specPath );
      if ( specFileLoc > -1 ) {
        files.splice( specFileLoc, 1 );
      }
    }
  });
  next();
};

exports.specFiles = function( testLocation ) {
  return specFiles[testLocation] || [];
};
