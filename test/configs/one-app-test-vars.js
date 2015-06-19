exports.config = {
  modules: [
    'ember-test', 'require', 'bower', 'copy'
  ],
  emberTest: {
    apps: [{
      testLocation: "tests",
      testAppFactory: "create_test_app",
      stylesheetPaths: [],
      javascriptPaths: [],
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
