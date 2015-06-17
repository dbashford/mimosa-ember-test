var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' )
  , fs = require( 'fs' );

var test = function( config, desc ) {

  describe(desc, function() {
    this.timeout(15000);

    var env = utils.setupProjectData( config );
    var et = env.dotEmberTest;

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

    it( 'will install all the appropriate files', function() {
      var paths = [
        "qunit.css",
        "qunit.js",
        "require.js",
        "sinon.js",
        "ember-qunit",
        "chai.js",
        "chai-qunit.js",
        path.join("ember-qunit", "main.js"),
        path.join("ember-qunit", "test.js")
      ].forEach( function( p ) {
        var assetPath = path.join( et, "vendor", p );
        expect(fs.existsSync( assetPath ) ).to.be.true;
      });
    });

    it( 'will install require.js in source', function(){
      var requirejsSourcePath = path.join( env.javascriptDir, "vendor", "requirejs", "require.js");
      requirejsSourcePath = requirejsSourcePath.replace("public","assets");
      expect(fs.existsSync( requirejsSourcePath) ).to.be.true;
    });

    it( 'will not install ember-data in source', function(){
      var emberDataPath = path.join( env.javascriptDir, "vendor", "ember-data", "ember-data.js");
      emberDataPath = emberDataPath.replace("public","assets");
      expect(fs.existsSync( emberDataPath ) ).to.be.false;
    });
  });
}

test(
  "lib-test-bower-first",
  "When bower executes and is configured BEFORE ember-test, ember-test");

test(
  "lib-test-bower-last",
  "When bower executes and is configured AFTER ember-test, ember-test");
