"use strict";

var path = require( "path" )
  , fs = require( "fs" )

  , wrench = require( "wrench" )
  , _ = require( "lodash" )

  , config = require( "./config" )
  , staticAssets = require( "./tasks/static-assets" )
  , testemConfig = require( "./tasks/testem-config" )
  , testEnv = require( "./tasks/test-env" )
  , testSpecs = require( "./tasks/test-specs" );

var _ensureDirectories = function( mimosaConfig, options, next ) {
  var assetFolder = mimosaConfig.emberTest.assetFolderFull;

  var dirs = [].concat( assetFolder,
    _.pluck( mimosaConfig.emberTest.apps, "testLocation" )
    .map( function( testLocation ) {
      return path.join( assetFolder, testLocation );
    })
  );

  dirs.forEach( function( dir ) {
    if ( !fs.existsSync( dir ) ) {
      wrench.mkdirSyncRecursive( dir, 0x1ff );
    }
  });

  next();
};

var registration = function( mimosaConfig, register ) {
  var js = mimosaConfig.extensions.javascript;

  register( ["postBuild"], "init", _ensureDirectories );
  if ( !mimosaConfig.emberTest.bowerTestAssets ) {
    register( ["postBuild"], "init", staticAssets.writeStaticAssets );
  }
  register( ["postBuild"], "init", testemConfig.writeTestemConfig );
  register( ["postBuild"], "init", testEnv.buildTestRunner );
  register( ["postBuild"], "init", testEnv.buildTestVariables );

  register( ["buildFile"], "init", testSpecs.buildSpec, js );
  register( ["add", "update"], "afterCompile", testSpecs.buildSpec, js );
  register( ["remove"], "afterDelete", testSpecs.removeSpec, js );

  register( ["add","update","remove"], "afterWrite", testEnv.buildTestVariables, js );

   if (
       ( mimosaConfig.emberTest.executeDuringBuild && mimosaConfig.isBuild ) ||
       ( mimosaConfig.emberTest.executeDuringWatch && mimosaConfig.isWatch ) ) {
     var testemSimple = require( "mimosa-testem-simple" );
     testemSimple.registration( mimosaConfig, register );
   }
};

module.exports = {
  registration:    registration,
  defaults:        config.defaults,
  placeholder:     config.placeholder,
  validate:        config.validate,
  registerCommand: require( "./command/test" )
};
