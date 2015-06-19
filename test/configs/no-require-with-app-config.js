exports.config = {
  modules: [
    'ember-test'
  ],
  emberTest: {
    apps: [{
      testLocation: "tests",
      testAppFactory: "create_test_app",
      javascriptPaths: [],
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

