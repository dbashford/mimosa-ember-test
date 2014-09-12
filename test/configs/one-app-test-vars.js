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
    }]
  },
  logger: {
    growl: {
      enabled: false
    }
  }
};
