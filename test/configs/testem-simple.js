exports.config = {
  modules: [
    // 'bower',
    'require',

    'ember-module-import',
    'ember-test',
    'bower',
    'copy',
    'es6-module-transpiler',
    'ember-handlebars'
  ],
  emberTest: {
    apps: [{
      testLocation: "tests",
      testAppFactory: "create_test_app"
    }]
  },
  logger: {
    growl: {
      enabled: false
    }
  },
  emberHandlebars: {
    emberPath: "ember",
    helpers:["blogger/helpers/helpers"]
  },
  emberModuleImport: {
    apps: [{
      namespace: "blogger",
      manifestFile: "modules",
      additional: ["router"]
    }]
  },
  template: {
    nameTransform: /.*\/templates\//,
    writeLibrary: false,
  },
  bower: {
    copy: {
      mainOverrides: {
        showdown: ["compressed/showdown.js"],
        bootstrap: ["dist/css/bootstrap.css", "dist/js/bootstrap.js"]
      }
    }
  },
};
