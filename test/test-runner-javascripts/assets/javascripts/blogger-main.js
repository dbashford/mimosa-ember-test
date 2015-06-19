require(['common'], function() {
  require(['app'], function(App) {
    window.App = App['default'].create();
  });
});
