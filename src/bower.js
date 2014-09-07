"use strict";

var path = require( "path" )
  , fs = require( "fs" )
  , _ = require( "lodash" );

var _updateBowerConfig = function ( config ) {
  var b = config.bower
    , relativeVendorToAssets = path.relative( config.vendor.javascripts, config.emberTest.assetFolderFull );

  var libraryPlacementConfig = {
    qunit : {
      "qunit/qunit.js": relativeVendorToAssets + "/qunit.js",
      "qunit/qunit.css": relativeVendorToAssets + "/qunit.css"
    },
    requirejs: {
      "require.js": relativeVendorToAssets + "/require.js"
    },
    sinonjs: {
      "sinon.js": relativeVendorToAssets + "/sinon.js"
    },
    "ember-qunit": {
      "dist/amd": relativeVendorToAssets + "/ember-qunit"
    }
  };

  // unlikely
  if ( !b.copy ) {
    b.copy = {};
  }

  // will be inserting overrides
  if ( !b.copy.mainOverrides ) {
    b.copy.mainOverrides = {};
  }

  // if pathFull exists, then mimosa-bower has already done
  // its validation (earlier in list of modules), so any
  // validation-created objects need to be created now
  if ( b.bowerDir.pathFull ) {
    // will be inserting overridesObjects
    if ( !b.copy.overridesObjects ) {
      b.copy.overridesObjects = {};
    }
  }

  Object.keys( libraryPlacementConfig ).forEach( function( lib ) {
    if ( !b.copy.mainOverrides[lib] ) {
      // doesn't have mainOverrides, so create it
      b.copy.mainOverrides[lib] = [ libraryPlacementConfig[lib] ];
    } else {
      // search through mainOverrides, if not already there, add it
      // but don't just add otherwise could get dupes
      var hasEntry = b.copy.mainOverrides[lib].some( function( entry ) {
        return JSON.stringify( entry ) === JSON.stringify( libraryPlacementConfig[lib] );
      });
      if ( !hasEntry ) {
        b.copy.mainOverrides[lib].push( [ libraryPlacementConfig[lib] ] );
      }
    }

    // if pathFull is there, then bower has run already
    // need to update post-validation objects
    if ( b.bowerDir.pathFull ) {

      // if already overrides, do merge
      if ( b.copy.overridesObjects[lib] ) {
        b.copy.overridesObjects[lib] = _.extend( libraryPlacementConfig[lib], b.copy.overridesObjects[lib] );
      } else {
        b.copy.overridesObjects[lib] = libraryPlacementConfig[lib];
      }
    }


    if ( lib === "requirejs" ) {
      b.copy.mainOverrides[lib].unshift( "require.js" );
      if ( b.bowerDir.pathFull ) {
        if ( !b.copy.overridesArrays.requirejs ) {
          b.copy.overridesArrays.requirejs = [];
        }
        b.copy.overridesArrays.requirejs.push( "require.js" );
      }
    }

  });

  // need to exclude ember-data
  if (!b.copy.exclude) {
    b.copy.exclude = [];
  }
  var pathToEmberData = path.join( config.root, b.bowerDir.path, "ember-data", "ember-data.js" );
  b.copy.exclude.push( pathToEmberData );
};

exports.handleBower = function( config, errors ) {
  if ( config.emberTest.bowerTestAssets ) {
    var hasBower = config.modules.some( function( mod ) {
      return mod.indexOf("bower") === 0 || mod.indexOf("mimosa-bower") === 0;
    });

    if ( !hasBower ) {
      errors.push( "emberTest.bowerTestAssets is set to true, but you do not have the mimosa-bower module configured.");
    } else {
      var bowerJSONPath = path.join( config.root, "bower.json" );
      if ( fs.existsSync( bowerJSONPath ) ) {
        _updateBowerConfig( config );
        var bowerJSON;
        try {
          bowerJSON = require( bowerJSONPath );
        } catch (err) {
          errors.push( "ember-test, cannot require in bower.json, is it formatted correctly? " + err.message );
          return;
        }

        ["qunit", "requirejs", "sinonjs", "ember-qunit"].forEach( function( bowerLib ) {
          var dependencies = bowerJSON.dependencies || {};
          var devDependencies = bowerJSON.devDependencies || {};

          if ( !dependencies[bowerLib] && !devDependencies[bowerLib] ) {
            errors.push("emberTest.bowerTestAssets is set to true, but [[ " + bowerLib +
              " ]] is missing from your bower.json" );
          }
        });
      } else {
        errors.push( "emberTest.bowerTestAssets is set to true, but bower.json cannot be found at [[ " + bowerJSONPath + " ]]" );
      }
    }
  }
};
