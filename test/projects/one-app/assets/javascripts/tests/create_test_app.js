import Ember from 'ember';
import Application from 'app';

export default function(attrs) {
  var App;

  var attributes = Ember.merge({
    rootElement: '#ember-testing',
    LOG_ACTIVE_GENERATION: false,
    LOG_VIEW_LOOKUPS: false
  }, attrs);

  Ember.run(function() {
    App = Application.create(attributes);

    App.Router.reopen({
      location: 'none'
    });

    App.setupForTesting();
    App.injectTestHelpers();
  });

  return App;
}
