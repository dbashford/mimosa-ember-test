exports.config = {
  modules: [
    'ember-test', 'require', 'bower', 'copy'
  ],
  emberTest: {
    apps: [{
      testLocation: "tests",
      testAppFactory: "create_test_app",
      javascriptPaths: [],
      stylesheetPaths: [],
      requireConfig: {}
    }],
    executeDuringBuild: false
  },
  logger: {
    growl: {
      enabled: false
    }
  }
};
