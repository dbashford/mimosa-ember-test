exports.config = {
  emberTest:{
    apps: [{
      testLocation: null,
      testAppFactory: null,
      stylesheetPaths: null,
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