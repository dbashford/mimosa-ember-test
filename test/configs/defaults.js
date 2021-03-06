exports.config = {
  emberTest:{
    bowerTestAssets: true,
    apps: [{
      testLocation: "tests",
      testAppFactory: "create_test_app",
      javascriptPaths: [],
      stylesheetPaths: [],
      requireConfig: null
    }],
    emberAMDPath: "ember",
    executeDuringBuild: false,
    executeDuringWatch: false,
    safeAssets: [],
    specConvention: /[_-](spec|test)\.js$/,
    assetFolder: ".mimosa/emberTest",
    testemConfig: {
      "launch_in_dev": ["Firefox", "Chrome"],
      "launch_in_ci": ["PhantomJS"]
    }
  },
  modules: [
    'ember-test',
    'bower',
    "require"
  ],
  logger: {
    growl: {
      enabled: false
    }
  }
};
