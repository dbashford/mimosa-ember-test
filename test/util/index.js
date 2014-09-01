var fs = require( 'fs' )
  , path = require( 'path' )
  , wrench = require( 'wrench' )
  , rimraf = require( 'rimraf' )
  ;

exports.setupProjectData = function( projectName ) {
  var projectDirectory = path.join( __dirname, "..", projectName );
  var mimosaConfig = path.join( projectDirectory, "mimosa-config.js" );
  var publicDirectory = path.join( projectDirectory, "public" );
  var javascriptDirectory = path.join( publicDirectory, "javascripts" );

  return {
    projectName: projectName,
    projectDir: projectDirectory,
    publicDir: publicDirectory,
    javascriptDir: javascriptDirectory,
    mimosaConfig: mimosaConfig
  };
};

// setup specific for ember module import testing
exports.setupModuleData = function(  ) {

};

exports.setupProject = function( proj, inProjectName ) {
  // copy project skeleton in
  var inProjectPath = path.join( __dirname, "..", "projects", inProjectName );
  wrench.copyDirSyncRecursive( inProjectPath, proj.projectDir );

  // copy correct mimosa-config in
  var configInPath = path.join( __dirname, "..", "configs", proj.projectName + ".js" );
  var configText = fs.readFileSync( configInPath, "utf8" );
  fs.writeFileSync(proj.mimosaConfig, configText);
};

exports.cleanProject = function( proj ) {
  // clean out cache
  if ( fs.existsSync( proj.projectDir ) ) {
    rimraf.sync( proj.projectDir );
  }
};