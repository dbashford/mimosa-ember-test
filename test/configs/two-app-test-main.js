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
    }]
  },
  logger: {
    growl: {
      enabled: false
    }
  }
};

