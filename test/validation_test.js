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

  it( 'for testem-simple errors, 1', function() {
    var expected =
      " * testemSimple.configFile must be a string. \n";
    standardErr = standardErr.split("\n").splice(1).join("\n");
    expect( standardErr ).to.equal( expected );
  });
});

describe('Will NOT error out on start up', function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "defaults")
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

  it( 'for all of the defaults simply pasted into the config', function() {
    standardErr = standardErr.split("\n").splice(1).join("\n");
    // no module message means validation passed and moved on to compiling
    expect( standardErr ).to.contain( "No module has registered for extension" );
  });
});

describe('Will error out on start up', function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "bad-config2")
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

  it( 'when its all so so bad, 2', function() {
    var expected =
      " * emberTest.apps must be an array.\n" +
      " * emberTest.executeDuringBuild must be a boolean.\n" +
      " * emberTest.executeDuringWatch must be a boolean.\n" +
      " * emberTest.assetFolder must be a string.\n" +
      " * emberTest.testemConfig must be an object.\n" +
      " * emberTest.safeAssets must be an array.\n" +
      " * emberTest.emberAMDPath must be a string.\n" +
      " * emberTest.specConvention must be a RegExp. \n";
    standardErr = standardErr.split("\n").splice(1).join("\n");
    expect( standardErr ).to.equal( expected );
  });
});

describe('Will error out on start up', function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "bad-config3")
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

  it( 'when its all so so bad, 3', function() {
    var expected =
      " * emberTest.apps must contain at least one entry\n" +
      " * emberTest.executeDuringBuild must be a boolean.\n" +
      " * emberTest.executeDuringWatch must be a boolean.\n" +
      " * emberTest.assetFolder must be a string.\n" +
      " * emberTest.safeAssets must be an array of strings.\n" +
      " * emberTest.emberAMDPath must be a string.\n" +
      " * emberTest.specConvention must be a RegExp. \n";

    standardErr = standardErr.split("\n").splice(1).join("\n");
    expect( standardErr ).to.equal( expected );
  });
});


describe('Will error out on start up', function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "bad-config4")
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

  it( 'when no app data is provided, 4', function() {
    var expected =
      " * emberTest.apps.testLocation must be provided.\n" +
      " * emberTest.apps.testAppFactory must be provided. \n";

    standardErr = standardErr.split("\n").splice(1).join("\n");
    expect( standardErr ).to.equal( expected );
  });
});

describe('Will error out on start up', function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "bad-config5")
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

  it( 'when all app data is bad, 5', function() {
    var expected =
      " * emberTest.apps.requireConfig must be a function or an object\n" +
      " * emberTest.apps.testLocation must be a string.\n" +
      " * emberTest.apps.testAppFactory must be a string. \n";

    standardErr = standardErr.split("\n").splice(1).join("\n");
    expect( standardErr ).to.equal( expected );
  });
});