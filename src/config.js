"use strict";

var path = require( "path" )
  , fs = require( "fs" )
  , testemSimple = require( "mimosa-testem-simple" );

exports.defaults = function() {
  var defs = testemSimple.defaults();

  defs.emberTest = {
    apps: [{
      testLocation: "tests",
      testAppFactory: "create_test_app",
      testPrerequisitePaths: [],
      stylesheetPaths: [],
      requireConfig: null
    }],
    emberAMDPath: "ember",
    executeDuringBuild: true,
    executeDuringWatch: false,
    safeAssets: [],
    specConvention: /[_-](spec|test)\.js$/,
    assetFolder: ".mimosa/emberTest",
    testemConfig: {
      "launch_in_dev": ["Firefox", "Chrome"],
      "launch_in_ci": ["PhantomJS"]
    }
  };

  return defs;
};

exports.placeholder = function() {
  var ph = testemSimple.placeholder().replace( "testem.json", ".mimosa/emberTest/testem.json" ) +
    "\n\n  emberTest:                  # Configuration for the ember-test module\n" +
    "    apps:[{                       # configuration for each ember app in your project\n" +
    "      testLocation: \"tests\"       # The path, relative to watch.javascriptDir where this\n" +
    "                                  # ember app's test assets live.\n" +
    "      testAppFactory: \"create_test_app\"  # Location, relative to testLocation, where a file\n" +
    "                                  # exporting a function capable of generating a test-ready\n" +
    "                                  # version of this ember app is located\n" +
    "      testPrerequisitePaths: []   # AMD paths to files that need to be imported prior to tests\n" +
    "                                  # being run. While these files can export something, ember-test\n" +
    "                                  # will only require in the files and not doing anything with them\n" +
    "      stylesheetPaths: []         # Paths to stylesheets necessary to properly run integration\n" +
    "                                  # tests for this app. Example: \"/public/stylesheets/vendor.css\"\n" +
    "      requireConfig: null         # RequireJS configuration. By default the mimosa-require\n" +
    "                                  # module is used by mimosa-ember-test to derive a\n" +
    "                                  # requirejs config.  But if that derived config isn't right\n" +
    "                                  # a config can be pasted here. This parameter takes either\n" +
    "                                  # an object which overrides the requirejs config, or a function\n" +
    "                                  # which takes the inferred config as input and can return a\n" +
    "                                  # modified config\n" +
    "    }]\n" +
    "    emberAMDPath: \"ember\"       # AMD path to ember.\n" +
    "    executeDuringBuild            # If true the tests will get executed during build.\n" +
    "    executeDuringWatch            # If true the tests will get executed during watch\n" +
    "                                  # with each file change.\n" +
    "    specConvention: /[_-](spec|test)\.js$/ # Convention for how test specs are named\n" +
    "    assetFolder: \".mimosa/emberTest\"     # Path from the root of the project to the folder that\n" +
    "                                  # will contain all the testing assets that the emberTest\n" +
    "                                  # module maintains and writes. If the folder does not exist\n" +
    "                                  # it will be created.\n" +
    "    safeAssets: []                # An array of file names ember-test will not overwrite.\n" +
    "                                  # By default ember-test overwrites any file it outputs.\n" +
    "                                  # So, for instance, if you have a specific version of\n" +
    "                                  # \"mocha.js\" you need to use, this setting should be [\"mocha.js\"]\n" +
    "    testemConfig:                 # Pass through values for the testem.json configuration.\n" +
    "                                  # The module will write the testem.json for you\n" +
    "      \"launch_in_dev\": [\"Firefox\", \"Chrome\"] # In dev mode launches in Firefox and Chrome\n" +
    "      \"launch_in_ci\": [\"PhantomJS\"]          # In CI mode uses PhantomJS (must be installed)\n";

  return ph;
};

exports.validate = function( config, validators ) {

  var errors = [];

  // ember-test wraps testem-simple, need to validate both
  // can't just call testemsimple validate because config file
  // might not exist and that is ok
  if ( validators.ifExistsIsObject( errors, "testemSimple config", config.testemSimple ) ) {
    validators.ifExistsIsNumber( errors, "testemSimple.port", config.testemSimple.port );
    validators.ifExistsIsString( errors, "testemSimple.configFile", config.testemSimple.configFile );

    if ( config.testemSimple.watch ) {
      if ( Array.isArray( config.testemSimple.watch ) ) {
        var newFolders = [];
        config.testemSimple.watch.forEach( function( folder ) {
          if ( typeof folder === "string" ) {
            var newFolderPath = validators.determinePath( folder, config.root );
            if ( fs.existsSync( newFolderPath ) ) {
              newFolders.push( newFolderPath );
            }
          } else {
            errors.push( "testemSimple.watch must be an array of strings." );
          }
        });
        config.testemSimple.watch =  newFolders;
      } else {
        errors.push( "testemSimple.watch must be an array." );
      }
    }

    validators.ifExistsFileExcludeWithRegexAndString( errors, "testemSimple.exclude", config.testemSimple, config.root );
  }

  if ( validators.ifExistsIsObject(errors, "emberTest config", config.emberTest ) ) {
    validators.ifExistsIsBoolean( errors, "emberTest.executeDuringBuild", config.emberTest.executeDuringBuild );
    validators.ifExistsIsBoolean( errors, "emberTest.executeDuringWatch", config.emberTest.executeDuringWatch );
    if ( validators.ifExistsIsString( errors, "emberTest.assetFolder", config.emberTest.assetFolder ) ) {
      config.emberTest.assetFolderFull = path.join( config.root, config.emberTest.assetFolder );
    }
    validators.ifExistsIsObject( errors, "emberTest.testemConfig", config.emberTest.testemConfig );
    validators.ifExistsIsObject( errors, "emberTest.requireConfig", config.emberTest.requireConfig );
    validators.ifExistsIsArrayOfStrings( errors, "emberTest.safeAssets", config.emberTest.safeAssets );

    config.testemSimple.configFile = path.join( config.emberTest.assetFolderFull, "testem.json" );
  }

  return errors;
};
