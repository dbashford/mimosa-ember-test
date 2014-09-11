"use strict";

var fs = require( "fs" )
  , path = require( "path" )
  , wrench = require( "wrench" )
  , assetsDir = path.join( __dirname, "..", "..", "assets", "vendor" );

var _writeFile = function( inPath, outPath ) {
  var dirname = path.dirname( outPath );
  if ( !fs.existsSync( dirname ) ) {
    wrench.mkdirSyncRecursive( dirname, 0x1ff );
  }
  var fileText = fs.readFileSync( inPath, "utf8" );
  fs.writeFileSync( outPath, fileText );
};

exports.writeStaticAssets = function( mimosaConfig, options, next ) {
  var emberTest = mimosaConfig.emberTest;
  var outputDir = path.join( emberTest.assetFolderFull, "vendor" );

  var assets = fs.readdirSync( assetsDir ).filter( function( asset ) {
    return emberTest.safeAssets.indexOf( asset ) === -1;
  });

  assets.forEach( function( asset ) {
    var assetPath = path.join( assetsDir, asset );
    var statInFile = fs.statSync( assetPath );
    var filesToCopy = [];

    // build list of vendor assets to to copy
    if ( statInFile.isDirectory() ) {
      wrench.readdirSyncRecursive( assetPath ).forEach( function( filename ) {
        var inPath = path.join( assetPath, filename );
        var outPath = path.join( outputDir, asset, filename );
        filesToCopy.push( { in: inPath, out: outPath, stat: fs.statSync( assetPath ) });
      });
    } else {
      filesToCopy.push( { in: assetPath, out: path.join( outputDir, asset ), stat: statInFile } );
    }

    // ensure each file to copy in actually needs to be copied
    filesToCopy.forEach( function( file ) {
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
