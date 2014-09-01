exports.config = {
  emberTest:{
    apps: [],
    emberAMDPath: null,
    executeDuringBuild: "true",
    executeDuringWatch: "false",
    safeAssets: [false, 1, "foo"],
    specConvention: null,
    assetFolder: null,
    testemConfig: null
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