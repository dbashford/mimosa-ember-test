"use strict";

var fs = require( "fs" )
  , path = require( "path" )
  , wrench = require( "wrench" )
  , assetsDir = path.join( __dirname, "..", "..", "assets" )
  , allAssets = [
    "qunit.css",
    "require.js",
    "qunit.js",
    "sinon.js",
    "ember-qunit"].map( function (asset) {
    return path.join( assetsDir, asset );
  });

var _writeFile = function( inPath, outPath ) {
  var dirname = path.dirname( outPath );
  if ( !fs.existsSync( dirname ) ) {
    wrench.mkdirSyncRecursive( dirname, 0x1ff );
  }
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
        var out = path.join( tr.assetFolderFull, path.basename ( asset ), path.basename( fullPath ) );
        filesToCheck.push( {in:fullPath, out:out, stat:fs.statSync( fullPath )} );
      });
    } else {
      filesToCheck.push( {in:asset, out:outFile, stat:statInFile} );
    }

    filesToCheck.forEach( function( file ) {
      if ( fs.existsSync( file.out ) ) {
        var statOutFile = fs.statSync( file.out );
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
