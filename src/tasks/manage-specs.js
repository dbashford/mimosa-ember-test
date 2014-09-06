"use strict";

// TODO
// Currently this code manages specs as an array of strings, but each testLocation needs
// its own list so this code need to keep list of specs per app.testLocation.
// build/remove need to be updated to deal with different data structure.
// Then need new function for other modules can pull specs by testLocation,
// like when test-variables are written

var path = require( "path" )
  , specFiles = [];

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

exports.buildSpecs = function( mimosaConfig, options, next ) {
  __specs( mimosaConfig, options, function( specPath ) {
    if( specFiles.indexOf( specPath ) === -1 ) {
      specFiles.push( specPath );
    }
  });
  next();
};

exports.removeSpec = function( mimosaConfig, options, next ) {
  __specs( mimosaConfig, options, function( specPath ) {
    var specFileLoc = specFiles.indexOf( specPath );
    if( specFileLoc > -1 ) {
      specFiles.splice( specFileLoc, 1 );
    }
  });
  next();
};
