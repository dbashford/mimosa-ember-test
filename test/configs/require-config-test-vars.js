exports.config = {
  modules: [
    'ember-test', 'require', 'bower', 'copy'
  ],
  emberTest: {
    apps: [{
      testLocation: "tests",
      testAppFactory: "create_test_app",
      stylesheetPaths: [],
      requireConfig: {
        zed:"zed",
        foo:"bar",
        baseUrl: "/javascript"
      }
    }],
    executeDuringBuild: false
  },
  logger: {
    growl: {
      enabled: false
    }
  }
};
