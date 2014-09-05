exports.config = {
  emberTest:{
    bowerTestAssets:1,
    apps: 1,
    emberAMDPath: 1,
    executeDuringBuild: 1,
    executeDuringWatch: 1,
    safeAssets: 1,
    specConvention: 1,
    assetFolder: 1,
    testemConfig: 1
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