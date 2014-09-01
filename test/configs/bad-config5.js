exports.config = {
  emberTest:{
    apps: [{
      testLocation: 1,
      testAppFactory: 1,
      stylesheetPaths: 1,
      requireConfig: 1
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