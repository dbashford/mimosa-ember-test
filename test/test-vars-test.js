var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' )
  , fs = require( 'fs' );

describe("When starting up with one app application", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "one-app-test-vars" );
  var et = env.dotEmberTest;
  var assetPath = path.join ( et, "tests", "test-variables.js" );

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "withbower" );

    var cwd = process.cwd();
    process.chdir( env.projectDir );
    exec( "mimosa build", function ( err, sout, serr ) {
      done();
      process.chdir(cwd);
    });
  });

  after(function() {
    utils.cleanProject( env );
  });

  it( 'the test variables file be written to the correct folder', function() {
    expect( fs.existsSync( assetPath) ).to.be.true;
  });

  it( 'the test variables contain the right information', function() {
    var varsText = fs.readFileSync( assetPath, "utf8" )
    var window = {}
    eval( varsText );
    expect( window.Mimosa ).to.be.an('object');
    expect( window.Mimosa.EmberTest ).to.be.an('object');
    expect( window.Mimosa.EmberTest.specFiles ).to.be.an('array');
    expect( window.Mimosa.EmberTest.specFiles.length ).to.eql(2);
    expect( window.Mimosa.EmberTest.specFiles[0] ).to.eql("tests/acceptance/posts_test");
    expect( window.Mimosa.EmberTest.requireConfig ).to.be.an('object');
    expect( window.Mimosa.EmberTest.requireConfig.baseUrl ).to.be.an('string');
  });
});

describe("When starting up with a two apps project", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "two-apps-test-vars" );
  var et = env.dotEmberTest;
  var assetPath = path.join ( et, "blogger", "tests", "test-variables.js" );
  var assetPath2 = path.join ( et, "admin", "tests", "test-variables.js" );

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "twoapps" );

    var cwd = process.cwd();
    process.chdir( env.projectDir );
    exec( "mimosa build", function ( err, sout, serr ) {
      done();
      process.chdir(cwd);
    });
  });

  after(function() {
    utils.cleanProject( env );
  });

  it( 'the test-variables files will be written to the correct folders', function() {
    expect(fs.existsSync( assetPath) ).to.be.true;
    expect(fs.existsSync( assetPath2) ).to.be.true;
  });

  it( 'the test-variables files contain the right information', function() {
    var varsText = fs.readFileSync( assetPath, "utf8" )
    var window = {}
    eval( varsText );
    expect( window.Mimosa ).to.be.an('object');
    expect( window.Mimosa.EmberTest ).to.be.an('object');
    expect( window.Mimosa.EmberTest.specFiles ).to.be.an('array');
    expect( window.Mimosa.EmberTest.specFiles.length ).to.eql(2);
    expect( window.Mimosa.EmberTest.specFiles[0] ).to.eql("blogger/tests/acceptance/posts_test");
    expect( window.Mimosa.EmberTest.requireConfig ).to.be.an('object');
    expect( window.Mimosa.EmberTest.requireConfig.baseUrl ).to.be.an('string');

    window = {};
    var varsText2 = fs.readFileSync( assetPath2, "utf8" )
    eval( varsText2 );
    expect( window.Mimosa ).to.be.an('object');
    expect( window.Mimosa ).to.be.an('object');
    expect( window.Mimosa.EmberTest ).to.be.an('object');
    expect( window.Mimosa.EmberTest.specFiles ).to.be.an('array');
    expect( window.Mimosa.EmberTest.specFiles.length ).to.eql(2);
    expect( window.Mimosa.EmberTest.specFiles[0] ).to.eql("admin/tests/acceptance/posts_test");
    expect( window.Mimosa.EmberTest.requireConfig ).to.be.an('object');
    expect( window.Mimosa.EmberTest.requireConfig.baseUrl ).to.be.an('string');
  });
});

describe("When starting up with one app application", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "require-config-test-vars" );
  var et = env.dotEmberTest;
  var assetPath = path.join ( et, "tests", "test-variables.js" );

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "withbower" );

    var cwd = process.cwd();
    process.chdir( env.projectDir );
    exec( "mimosa build", function ( err, sout, serr ) {
      done();
      process.chdir(cwd);
    });
  });

  after(function() {
    utils.cleanProject( env );
  });

  it( 'the test variables contain the right information with require config override', function() {
    var varsText = fs.readFileSync( assetPath, "utf8" )
    var window = {}
    eval( varsText );
    expect( window.Mimosa ).to.be.an('object');
    expect( window.Mimosa.EmberTest ).to.be.an('object');
    expect( window.Mimosa.EmberTest.specFiles ).to.be.an('array');
    expect( window.Mimosa.EmberTest.specFiles.length ).to.eql(2);
    expect( window.Mimosa.EmberTest.specFiles[0] ).to.eql("tests/acceptance/posts_test");
    expect( window.Mimosa.EmberTest.requireConfig ).to.be.an('object');
    expect( window.Mimosa.EmberTest.requireConfig.baseUrl ).to.be.an('string');
    expect( Object.keys(window.Mimosa.EmberTest.requireConfig) ).to.eql(["baseUrl","foo","zed"]);
  });
});


describe("When starting up with one app application", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "require-config-function" );
  var et = env.dotEmberTest;
  var assetPath = path.join ( et, "tests", "test-variables.js" );

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "withbower" );

    var cwd = process.cwd();
    process.chdir( env.projectDir );
    exec( "mimosa build", function ( err, sout, serr ) {
      done();
      process.chdir(cwd);
    });
  });

  after(function() {
    utils.cleanProject( env );
  });

  it( 'the test variables contain the right information with require config function used', function() {
    var varsText = fs.readFileSync( assetPath, "utf8" )
    var window = {}
    eval( varsText );
    expect( window.Mimosa.EmberTest.requireConfig.yeah ).to.eql("OK");
  });
});