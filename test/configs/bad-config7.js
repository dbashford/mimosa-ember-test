exports.config = {
  emberTest:{
    apps: [{
      testLocation: "foo",
      testAppFactory: "foo",
      javascriptPaths: [1, 2],
      stylesheetPaths: [1, 2],
      requireConfig: {}
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