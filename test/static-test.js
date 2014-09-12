var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' )
  , fs = require( 'fs' );

describe("When using module-stored static assets", function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "static-install" );
  var et = env.dotEmberTest;

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "defaults" );

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

  it( 'will install all the appropriate files', function() {
    var paths = [
      "qunit.css",
      "qunit.js",
      "require.js",
      "sinon.js",
      "ember-qunit",
      path.join("ember-qunit", "main.js"),
      path.join("ember-qunit", "test.js")
    ].forEach( function( p ) {
        var assetPath = path.join( et, "vendor", p );
        expect(fs.existsSync( assetPath ) ).to.be.true;
      });
  });

});
