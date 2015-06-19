exports.config = {
  emberTest:{
    apps: [{
      testLocation: "tests",
      testAppFactory: "create_test_app",
      stylesheetPaths: ["foo", "bar"],
      javascriptPaths: ["foo", "bar"]
    }, {}]
  },
  modules: [
    'ember-test'
  ],
  logger: {
    growl: {
      enabled: false
    }
  }
};