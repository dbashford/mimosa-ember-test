exports.config = {
  emberTest:{
    apps: [{
      testLocation: "tests",
      testAppFactory: "foo",
      stylesheetPaths: ["foo", "bar"]
    }]
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