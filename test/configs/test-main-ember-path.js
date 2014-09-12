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
    emberAMDPath: "emberrrr"
  },
  logger: {
    growl: {
      enabled: false
    }
  }
};
