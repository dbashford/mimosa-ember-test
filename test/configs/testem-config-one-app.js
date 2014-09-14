exports.config = {
  modules: [
    'ember-test', 'require', 'bower'
  ],
  emberTest: {
    apps: [{
      testLocation: "tests",
      testAppFactory: "create_test_app",
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

