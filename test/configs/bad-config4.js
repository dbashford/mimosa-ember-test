exports.config = {
  emberTest:{
    bowerTestAssets: true,
    apps: [{}],
    executeDuringBuild: true,
    executeDuringWatch: false,
    safeAssets: ["foo","bar","baz"],
    specConvention: /[_-](spec|test)\.js$/,
    assetFolder: ".mimosa/emberTest",
    testemConfig: {}
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