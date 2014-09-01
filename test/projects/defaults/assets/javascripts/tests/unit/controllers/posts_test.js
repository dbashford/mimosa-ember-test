moduleFor('controller:post', "Unit - PostController");

test('#init', function() {
  expect(1);

  var controller = this.subject();
  equal(controller.get('isEditing'), false, "`isEditing` is false by default");
});

test('#edit', function() {
  expect(1);

  var controller = this.subject();
  controller.send('edit');

  equal(controller.get('isEditing'), true, "Sets `isEditing` to true");
});

test('#doneEdit', function() {
  expect(1);

  var controller = this.subject();
  controller.set('isEditing', true);
  controller.send('doneEditing');

  equal(controller.get('isEditing'), false, "Sets `isEditing` to false");
});
