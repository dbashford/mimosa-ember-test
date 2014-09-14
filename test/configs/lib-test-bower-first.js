exports.config = {
  modules: [
    'bower',
    'ember-test',
    'require'
  ],
  logger: {
    growl: {
      enabled: false
    }
  },
  emberTest: {
    executeDuringBuild: false
  }
};
