"use strict";

var fs = require( "fs" )
  , path = require( "path" )
  , wrench = require( "wrench" )
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
    var filesToCheck = [];

    var fileName = path.basename( asset );
    var outFile = path.join( tr.assetFolderFull, fileName );
    var statInFile = fs.statSync( asset );
    if ( statInFile.isDirectory() ) {
      wrench.readdirSyncRecursive( asset ).forEach( function( f ) {
        var fullPath = path.join( asset, f );
        var out = path.join( tr.assetFolderFull, path.basename( fullPath ) );
        filesToCheck.push( {in:fullPath, out:out, stat:fs.statSync( fullPath )} );
      });
    } else {
      filesToCheck.push( {in:asset, out:outFile, stat:statInFile} );
    }

    filesToCheck.forEach( function( file ) {
      if ( fs.existsSync( outFile ) ) {
        var statOutFile = fs.statSync( outFile );
        if ( file.stat.mtime > statOutFile.mtime ) {
          _writeFile( file.in, file.out );
        }
      } else {
        _writeFile( file.in, file.out );
      }
    });
  });

  next();
};
