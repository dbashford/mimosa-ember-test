var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' )
  , fs = require( 'fs' );

describe('For single a single app application', function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "one-app-modify-specs" );
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

  it( 'it will build the proper test specs', function() {
    var varsText = fs.readFileSync( assetPath, "utf8" )
    var window = {}
    eval( varsText );
    expect( window.Mimosa.EmberTest.specFiles ).to.be.an('array');
    expect( window.Mimosa.EmberTest.specFiles.length ).to.eql(2);
    expect( window.Mimosa.EmberTest.specFiles[0] ).to.eql("tests/acceptance/posts_test");
  });

  describe( 'and then after starting watch and adding a spec', function() {

    before(function(done) {
      var cwd = process.cwd();
      process.chdir( env.projectDir );
      var child = exec( "mimosa watch", function ( err, sout, serr ) {
        // won't get here
      });

      setTimeout(function(){
        var assetPath = path.join( env.javascriptDir, "tests", "acceptance", "new-acceptance_test.js")
          .replace("public", "assets");
        fs.writeFileSync( assetPath, "console.log('foo')" );

        setTimeout(function(){
          child.kill("SIGINT");
          process.chdir(cwd);
          done();
        }, 1000);

      }, 3500);
    });


    it( 'it will update the spec files properly', function() {
      var varsText = fs.readFileSync( assetPath, "utf8" )
      var window = {}
      eval( varsText );
      expect( window.Mimosa.EmberTest.specFiles ).to.be.an('array');
      expect( window.Mimosa.EmberTest.specFiles.length ).to.eql(3);
      expect( window.Mimosa.EmberTest.specFiles[0] ).to.eql("tests/acceptance/new-acceptance_test");
      expect( window.Mimosa.EmberTest.specFiles[1] ).to.eql("tests/acceptance/posts_test");
      expect( window.Mimosa.EmberTest.specFiles[2] ).to.eql("tests/unit/controllers/posts_test");
    });

    describe( 'and then after a spec is deleted', function() {

      before(function(done) {
        var cwd = process.cwd();
        process.chdir( env.projectDir );
        var child = exec( "mimosa watch", function ( err, sout, serr ) {
          // won't get here
        });

        setTimeout(function(){
          var assetPath = path.join( env.javascriptDir, "tests", "acceptance", "posts_test.js")
            .replace("public", "assets");
          fs.unlinkSync( assetPath );

          setTimeout(function(){
            child.kill("SIGINT");
            process.chdir(cwd);
            done();
          }, 1000);

        }, 3500);
      });


      it( 'the specs will not contain the deleted file', function() {
        var varsText = fs.readFileSync( assetPath, "utf8" )
        var window = {}
        eval( varsText );
        expect( window.Mimosa.EmberTest.specFiles ).to.be.an('array');
        expect( window.Mimosa.EmberTest.specFiles.length ).to.eql(2);
        expect( window.Mimosa.EmberTest.specFiles[0] ).to.eql("tests/acceptance/new-acceptance_test");
        expect( window.Mimosa.EmberTest.specFiles[1] ).to.eql("tests/unit/controllers/posts_test");
      });

    });

  });
});