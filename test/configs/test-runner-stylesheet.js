exports.config = {
  modules: [
    'ember-test', 'require', 'bower'
  ],
  emberTest: {
    apps: [{
      testLocation: "tests",
      testAppFactory: "create_test_app",
      stylesheetPaths: ["foo/bar/baz.css", "uber/conf/rulez.css"]
    }],
    executeDuringBuild: false
  },
  logger: {
    growl: {
      enabled: false
    }
  }
};
