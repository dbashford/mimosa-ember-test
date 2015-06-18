import Ember from 'ember';
import createApp from 'tests/create_test_app';

var App;

QUnit.module('Acceptances - Posts', {
  beforeEach: function() {
    App = createApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

QUnit.test("displays all recent posts", function(assert) {
  assert.expect(1);

  visit('/posts');

  andThen(function() {
    var header = find('thead:contains("Recent Posts")');
    var posts = find('tbody > tr', header.closest('table'));

    assert.equal(posts.length, 2, "There are two recent posts.");
  });
});
