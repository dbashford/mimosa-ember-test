QUnit.config.autostart = false;

require.config(Mimosa.EmberTest.requireConfig);

require(['ember'], function(Ember) {
  require.config({ 'baseUrl': '/ember-test' });
  require(['vendor/ember-qunit/main'], function(EmberQUnit) {
    EmberQUnit.globalize();

    require.config({ 'baseUrl': '/js' });
    require(['blogger/tests/create_test_app', '../testem'], function(testApp) {
      testApp = testApp['default'] || testApp;
      setResolver(Ember.DefaultResolver.create({ namespace: testApp() }));

      require(Mimosa.EmberTest.specFiles, function() {
        QUnit.start();
      });
    });
  });
});
