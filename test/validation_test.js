var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' );

describe('Will NOT error out on start up', function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "defaults" );
  var standardErr;

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "withbower" );

    var cwd = process.cwd();
    process.chdir( env.projectDir );
    exec( "mimosa build", function ( err, sout, serr ) {
      console.log(sout)
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

var test = function( config, itDesc, expected, project ) {

  if ( !project ){ project = "defaults"; }

  describe('Will error out on start up', function() {
    this.timeout(15000);

    var env = utils.setupProjectData( config );
    var standardErr;

    before(function(done){
      utils.cleanProject( env );
      utils.setupProject( env, project );

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

    it( itDesc, function() {
      standardErr = standardErr.split("\n").splice(1).join("\n");
      expect( standardErr ).to.equal( expected );
    });
  });
};

var expected1 =
  " * testemSimple.configFile must be a string. \n";
test("bad-config1", "for testem-simple errors, 1", expected1);

var expected2 =
  " * emberTest.apps must be an array.\n" +
  " * emberTest.executeDuringBuild must be a boolean.\n" +
  " * emberTest.executeDuringWatch must be a boolean.\n" +
  " * emberTest.assetFolder must be a string.\n" +
  " * emberTest.testemConfig must be an object.\n" +
  " * emberTest.safeAssets must be an array.\n" +
  " * emberTest.emberAMDPath must be a string.\n" +
  " * emberTest.specConvention must be a RegExp.\n" +
  " * emberTest.bowerTestAssets must be a boolean. \n";
test("bad-config2", "when its all so so bad, 2", expected2);

var expected3 =
  " * emberTest.apps must contain at least one entry.\n" +
  " * emberTest.executeDuringBuild must be a boolean.\n" +
  " * emberTest.executeDuringWatch must be a boolean.\n" +
  " * emberTest.assetFolder must be a string.\n" +
  " * emberTest.safeAssets must be an array of strings.\n" +
  " * emberTest.emberAMDPath must be a string.\n" +
  " * emberTest.specConvention must be a RegExp.\n" +
  " * emberTest.bowerTestAssets must be a boolean. \n";
test("bad-config3", "when its all so so bad, 3", expected3);

var expected4 =
  " * emberTest.apps.testLocation must be provided.\n" +
  " * emberTest.apps.testAppFactory must be provided. \n";
test("bad-config4", "when no app data is provided, 4", expected4);

var expected5 =
  " * emberTest.apps.requireConfig must be a function or an object.\n" +
  " * emberTest.apps.testLocation must be a string.\n" +
  " * emberTest.apps.testAppFactory must be a string.\n" +
  " * emberTest.apps.stylesheetPaths must be an array. \n";
test("bad-config5", "when all app data is bad, 5", expected5);

var expected6 =
  " * emberTest.apps.testLocation must be provided.\n" +
  " * emberTest.apps.testAppFactory must be provided. \n";
test("bad-config6", "when all app data is null, 6", expected6);

var expected7 =
  " * emberTest.apps.testLocation does not exist, resolved to " + path.join(__dirname, 'bad-config7/assets/javascripts/foo') + ".\n" +
  " * emberTest.apps.stylesheetPaths must be an array of strings. \n";
test("bad-config7", "when paths are bad, 7", expected7);

var expected8 =
  " * emberTest.apps.testAppFactory does not exist, resolved to " + path.join(__dirname, 'bad-config8/assets/javascripts/tests/foo.js') + ". \n";
test("bad-config8", "when paths are bad, 8", expected8);

var expected9 =
  " * emberTest.apps.testLocation must be provided.\n" +
  " * emberTest.apps.testAppFactory must be provided. \n";
test("bad-config9", "when a 2nd app isn't configured right, 9", expected9);

var expectedNoBower =
  " * emberTest.bowerTestAssets is set to true, but you do not have the mimosa-bower module configured. \n";
test("no-bower", "when bower is configured in emberTest but not configured for project", expectedNoBower);

var expectedNoBowerJSON =
  " * emberTest.bowerTestAssets is set to true, but bower.json cannot be found at \u001b[36mbower.json\u001b[0m \n";
test("with-bower", "when bower is configured in emberTest bower.json can't be found", expectedNoBowerJSON);

var expectedBadBowerJSON =
  " * ember-test, cannot require in bower.json, is it formatted correctly? " +
  path.join(__dirname + "/bad-bower/bower.json") + ": Unexpected token } \n";
test("bad-bower", "when bower.json is found but not correctly formatted", expectedBadBowerJSON, "badbower");

var expectedBowerMissingLib =
  " * emberTest.bowerTestAssets is set to true, but \u001b[36msinonjs\u001b[0m is missing from your bower.json \n";
test("bower-missing-lib", "when bower is configured in emberTest but not configured for project", expectedBowerMissingLib, "missinglib");

var noRequireConfigured =
  " * mimosa-ember-test is configured but cannot be used unless mimosa-require is installed or each emberTest.app has a requireConfig specified. \n";
test("but-no-require", "when require is configured and no requireConfigs specified", noRequireConfigured);

// should only be bower error
var noRequireWithAppConfig =
  " * emberTest.bowerTestAssets is set to true, but you do not have the mimosa-bower module configured. \n";
test("no-require-with-app-config", "when require is not configured and requireConfigs are specified (with only a bower error)", noRequireWithAppConfig);

