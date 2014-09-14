exports.config = {
  modules: [
    'ember-test',
    'bower',
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
