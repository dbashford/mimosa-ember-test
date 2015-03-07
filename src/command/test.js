"use strict";

var path = require( "path" )
  , fs = require( "fs" )
  , _ = require( "lodash" )
  , logger = null;

var _writeScript = function ( ext, configFiles ) {
  var templatePath = path.resolve( __dirname, "test." + ext + ".template" );
  var templateText = fs.readFileSync( templatePath );
  var compiledTemplate = _.template( templateText );

  var content = compiledTemplate( { configFiles: configFiles, $: "$" } );
  var outPath = path.join( process.cwd(), "test." + ext );
  fs.writeFileSync( outPath, content, { mode:0x1ff } );

  return outPath;
};

var _test = function( config, opts ) {
  if ( !config.testemSimple ) {
    return logger.error( "testscript command used, but mimosa-ember-test not configured as project module." );
  }

  var relativePaths = config.testemSimple.configFile.map( function( configFile ) {
    return path.relative( config.root, configFile );
  });

  var outPath;
  if ( opts.windows || ( !opts.bash && process.platform === "win32" ) ) {
    outPath = _writeScript("bat", relativePaths );
  } else {
    outPath = _writeScript("sh", relativePaths );
  }

  logger.success( "Wrote test execution script to [[ " + outPath + " ]]" );
  logger.info( "To execute the test script, you will need to have testem installed globally. npm install -g testem" );
};

var register = function( program, _logger, retrieveConfig ) {
  logger = _logger;
  program
    .command( "testscript" )
    .description( "Create a script in the root directory that will launch testem tests" )
    .option( "-b, --bash",    "force the generation of a bash script" )
    .option( "-w, --windows", "force the generation of a windows script" )
    .action( function( opts ) {
      var retrieveConfigOpts = {
        mdebug: false,
        buildFirst: false
      };
      retrieveConfig( retrieveConfigOpts, function( config ) {
        _test( config, opts );
      });
    }).on( "--help", function() {
      logger.green( " This command will create a script to launch testem tests directly." );
      logger.green( " Use this script this command generates when debugging/writing tests." );
      logger.blue( "\n $ mimosa testscript\n" );
    });
};

module.exports = register;
