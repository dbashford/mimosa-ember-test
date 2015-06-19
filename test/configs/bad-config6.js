exports.config = {
  emberTest:{
    apps: [{
      testLocation: null,
      testAppFactory: null,
      stylesheetPaths: null,
      javascriptPaths: null,
      requireConfig: null
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