"use strict";

var path = require( "path" )
  , fs = require( "fs" )
  , logger = null;

var bash =
  "#!/bin/bash\n" +
  "if [ \"$1\" == ci ]; then\n" +
  "  testem ci --file \"CONFIG_FILE\"\n" +
  "else\n" +
  "  testem --file \"CONFIG_FILE\"\n" +
  "fi";

var bat =
  "@echo off\n" +
  "if \"%1\" == \"ci\" (\n" +
  "  testem ci --file \"CONFIG_FILE\"\n" +
  ") else (\n" +
  "  testem --file \"CONFIG_FILE\"\n" +
  ")";

var _writeBash = function ( configFile ) {
  var b = bash.replace( /CONFIG_FILE/g, configFile );
  var outPath = path.join( process.cwd(), "test.sh" );
  fs.writeFileSync( outPath, b, { mode:0x1ff } );
  return outPath;
};

var _writeBat = function ( configFile ) {
  var b = bat.replace( /CONFIG_FILE/g, configFile );
  var outPath = path.join( process.cwd(), "test.bat" );
  fs.writeFileSync( outPath, b, { mode:0x1ff } );
  return outPath;
};


var _test = function( config, opts ) {
  if ( !config.testemSimple ) {
    return logger.error( "testscript command used, but mimosa-ember-test not configured as project module." );
  }

  var relativePath = path.relative( config.root, config.testemSimple.configFile );
  var outPath;
  if ( opts.windows || ( !opts.bash && process.platform === "win32" ) ) {
    outPath = _writeBat( relativePath );
  } else {
    outPath = _writeBash( relativePath );
  }

  logger.success( "Wrote test execution script to [[ " + outPath + " ]]" );
  logger.info( "To execute the test script, you will need to have testem installed globally. npm install -g testem" );
};

var register = function( program, retrieveConfig ) {
  program
    .command( "testscript" )
    .description( "Create a script in the root directory that will launch testem tests" )
    .option( "-b, --bash",    "force the generation of a bash script" )
    .option( "-w, --windows", "force the generation of a windows script" )
    .action( function( opts ) {
      retrieveConfig( false, false, function( config ) {
        logger = config.log;
        _test( config, opts );
      });
    }).on( "--help", function() {
      logger.green( " This command will create a script to launch testem tests directly." );
      logger.green( " Use this script this command generates when debugging/writing tests." );
      logger.blue( "\n $ mimosa testscript\n" );
    });
};

module.exports = register;
