import { moduleFor, test } from "ember-qunit";

moduleFor('controller:post', "Unit - PostController");

test('#init', function(assert) {
  assert.expect(1);

  var controller = this.subject();
  assert.equal(controller.get('isEditing'), false, "`isEditing` is false by default");
});

test('#edit', function(assert) {
  assert.expect(1);

  var controller = this.subject();
  controller.send('edit');

  assert.equal(controller.get('isEditing'), true, "Sets `isEditing` to true");
});

test('#doneEdit', function(assert) {
  assert.expect(1);

  var controller = this.subject();
  controller.set('isEditing', true);
  controller.send('doneEditing');

  assert.equal(controller.get('isEditing'), false, "Sets `isEditing` to false");
});
