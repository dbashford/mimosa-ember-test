exports.config = {
  modules: [
    'ember-test', 'require', 'bower'
  ],
  emberTest: {
    apps: [{
      testLocation: "blogger/tests",
      testAppFactory: "create_test_app"
    }, {
      testLocation: "admin/tests",
      testAppFactory: "create_test_app"
    }],
    executeDuringBuild: false
  },
  logger: {
    growl: {
      enabled: false
    }
  }
};

