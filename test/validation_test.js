var  exec = require('child_process').exec
, utils = require( './util' )

describe('Will error out on start up', function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "bad-config1")
  var standardErr;

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "defaults" );

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

  it( 'for testem-simple errors', function() {
    var expected =
      " * testemSimple.configFile must be a string. \n";
    standardErr = standardErr.split("\n").splice(1).join("\n");
    expect( standardErr ).to.equal( expected );
  });
});