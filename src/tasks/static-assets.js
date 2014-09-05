"use strict";

var fs = require( "fs" )
  , path = require( "path" )
  , allAssets = [
    "qunit.css",
    "require.min.js",
    "qunit.js",
    "sinon.js",
    "ember-qunit"].map( function (asset) {
    return path.join( __dirname, "..", "assets", asset );
  });

var _writeFile = function( inPath, outPath ) {
  var fileText = fs.readFileSync( inPath, "utf8" );
  fs.writeFileSync( outPath, fileText );
};

exports.writeStaticAssets = function( mimosaConfig, options, next ) {
  var tr = mimosaConfig.emberTest;

  allAssets.filter( function ( asset ) {
    return tr.safeAssets.indexOf( path.basename( asset ) ) === -1;
  }).forEach( function( asset ) {
    var fileName = path.basename( asset );
    var outFile = path.join( tr.assetFolderFull, fileName );
    if( fs.existsSync( outFile ) ) {
      var statInFile = fs.statSync( asset );
      var statOutFile = fs.statSync( outFile );
      if ( statInFile.mtime > statOutFile.mtime ) {
        _writeFile( asset, outFile );
      }
    } else {
      _writeFile( asset, outFile );
    }
  });

  next();
};
