var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' )
  , fs = require( 'fs' );

describe("When starting up with one app application", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "one-app-test-runner" );
  var et = env.dotEmberTest;
  var standardErr;
  var assetPath = path.join ( et, "tests", "runner.html" );

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

  it( 'the test runner be written to the correct folder', function() {
    expect(fs.existsSync( assetPath) ).to.be.true;
  });

  it( 'the test runner contain the right information', function() {
    var runnerText = fs.readFileSync( assetPath, "utf8" )
    expect( runnerText.indexOf("sinon.js") ).to.be.above(500);
    expect( runnerText.indexOf("qunit.js") ).to.be.above(500);
    expect( runnerText.indexOf("test-variables.js") ).to.be.above(500);
  });
});

describe("When starting up with a two apps project", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "two-app-test-runner" );
  var et = env.dotEmberTest;
  var standardErr;
  var assetPath = path.join ( et, "blogger", "tests", "runner.html" );
  var assetPath2 = path.join ( et, "admin", "tests", "runner.html" );

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

  it( 'the test runners will be written to the correct folders', function() {
    expect(fs.existsSync( assetPath) ).to.be.true;
    expect(fs.existsSync( assetPath2) ).to.be.true;
  });

  it( 'the test runners contain the right information', function() {
    var runnerText = fs.readFileSync( assetPath, "utf8" )
    expect( runnerText.indexOf("sinon.js") ).to.be.above(500);
    expect( runnerText.indexOf("qunit.js") ).to.be.above(500);
    expect( runnerText.indexOf("test-variables.js") ).to.be.above(500);

    var runnerText2 = fs.readFileSync( assetPath2, "utf8" )
    expect( runnerText2.indexOf("sinon.js") ).to.be.above(500);
    expect( runnerText2.indexOf("qunit.js") ).to.be.above(500);
    expect( runnerText2.indexOf("test-variables.js") ).to.be.above(500);
  });
});

describe("When starting up with one app application", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "test-runner-stylesheet" );
  var et = env.dotEmberTest;
  var standardErr;
  var assetPath = path.join ( et, "tests", "runner.html" );

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

  it( 'the test runner will have references to the proper stylesheets', function() {
    var runnerText = fs.readFileSync( assetPath, "utf8" );
    expect( runnerText.indexOf("foo/bar/baz.css") ).to.eql(197);
    expect( runnerText.indexOf("uber/conf/rulez.css") ).to.eql(249);
  });

});

