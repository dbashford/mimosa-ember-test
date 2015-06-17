var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' )
  , fs = require( 'fs' );

describe("When building with one app application", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "testem-simple" );
  var et = env.dotEmberTest;
  var standardOut;

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "fullproj" );

    var cwd = process.cwd();
    process.chdir( env.projectDir );
    exec( "mimosa build", function ( err, sout, serr ) {
      standardOut = sout;
      done();
      process.chdir(cwd);
    });
  });

  after(function() {
    utils.cleanProject( env );
  });

  it( 'the tests will be executed', function() {
    console.log(standardOut)
    expect( standardOut.indexOf("# tests 4\n# pass  4\n# fail  0") ).to.be.above(5000)
  });
});