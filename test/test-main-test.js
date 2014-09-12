var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' )
  , fs = require( 'fs' );

describe("When starting up with one app application", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "one-app-test-main" );
  var et = env.dotEmberTest;
  var standardErr;
  var assetPath = path.join ( et, "tests", "test-main.js" );

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

  it( 'the test main file be written to the correct folder', function() {
    expect( fs.existsSync( assetPath) ).to.be.true;
  });

  it( 'the test main contain the right information', function() {
    var mainText = fs.readFileSync( assetPath, "utf8" )
    expect( mainText.indexOf("['ember']") ).to.be.above(50);
    expect( mainText.indexOf("'tests/create_test_app'") ).to.be.above(50);
  });
});


describe("When starting up with a two apps project", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "two-app-test-main" );
  var et = env.dotEmberTest;
  var standardErr;
  var assetPath = path.join ( et, "blogger", "tests", "test-main.js" );
  var assetPath2 = path.join ( et, "admin", "tests", "test-main.js" );

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

  it( 'the test-main files will be written to the correct folders', function() {
    expect(fs.existsSync( assetPath) ).to.be.true;
    expect(fs.existsSync( assetPath2) ).to.be.true;
  });

  it( 'the test-main files contain the right information', function() {
    var mainText = fs.readFileSync( assetPath, "utf8" )
    expect( mainText.indexOf("['ember']") ).to.be.above(50);
    expect( mainText.indexOf("'blogger/tests/create_test_app'") ).to.be.above(51);

    var mainText2 = fs.readFileSync( assetPath2, "utf8" )
    expect( mainText2.indexOf("['ember']") ).to.be.above(52);
    expect( mainText2.indexOf("'admin/tests/create_test_app'") ).to.be.above(53);
  });
});


describe("When starting up with one app application", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "test-main-ember-path" );
  var et = env.dotEmberTest;
  var standardErr;
  var assetPath = path.join ( et, "tests", "test-main.js" );

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

  it( 'the test main contains the right ember path', function() {
    var mainText = fs.readFileSync( assetPath, "utf8" )
    expect( mainText.indexOf("['ember']") ).to.eql(-1);
    expect( mainText.indexOf("['emberrrr']") ).to.be.above(50);
  });
});