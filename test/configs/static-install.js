exports.config = {
  modules: [
    'ember-test', 'require'
  ],
  emberTest:{
    bowerTestAssets: false,
    executeDuringBuild: false
  },
  logger: {
    growl: {
      enabled: false
    }
  }
};

