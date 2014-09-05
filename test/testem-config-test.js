var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' )
  , fs = require( 'fs' );

describe("When starting up a one app application", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "testem-config-one-app" );
  var et = env.dotEmberTest;
  var standardErr;

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "withbower" );

    var cwd = process.cwd();
    process.chdir( env.projectDir );
    exec( "mimosa build", function ( err, sout, serr ) {
      standardErr = serr;
      done();
      process.chdir(cwd);
    });
  });

  after(function() {
    utils.cleanProject( env );
  });

  it( 'the testem config will be written to the correct folder', function() {
    var assetPath = path.join ( et, "testem.json" );
    expect(fs.existsSync( assetPath) ).to.be.true;
  });

  it( 'the testem config contain the right information', function() {
    var assetPath = path.join ( et, "testem.json" );
    var testemJSON = JSON.parse( fs.readFileSync(assetPath, "utf8" ) );
    expect( testemJSON.test_page ).to.eql(".mimosa/emberTest/runner.html");
  });

});