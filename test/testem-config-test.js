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
    expect( testemJSON.test_page ).to.eql(".mimosa/emberTest/tests/runner.html");
  });

});


describe("When starting up a two app application", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "testem-config-two-apps" );
  var et = env.dotEmberTest;
  var standardErr;

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "twoapps" );

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

  it( 'the testem configs will be written to the correct folder', function() {
    var assetPath1 = path.join ( et, "testem1.json" );
    var assetPath2 = path.join ( et, "testem2.json" );

    expect(fs.existsSync( assetPath1 ) ).to.be.true;
    expect(fs.existsSync( assetPath2 ) ).to.be.true;
  });

  it( 'the testem config contain the right information', function() {
    var assetPath1 = path.join ( et, "testem1.json" );
    var assetPath2 = path.join ( et, "testem2.json" );
    var testemJSON1 = JSON.parse( fs.readFileSync(assetPath1, "utf8" ) );
    var testemJSON2 = JSON.parse( fs.readFileSync(assetPath2, "utf8" ) );

    expect( testemJSON1.test_page ).to.eql(".mimosa/emberTest/blogger/tests/runner.html");
    expect( testemJSON2.test_page ).to.eql(".mimosa/emberTest/admin/tests/runner.html");
  });

});
