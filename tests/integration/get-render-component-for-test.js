import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

import getRenderComponentFor from 'ember-islands/get-render-component-for';

var renderComponent;
var application;

module('Integration: Finding Components', {
  beforeEach: function() {
    application = startApp();
    renderComponent = getRenderComponentFor(application);
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('Appends a component to an element', function(assert) {
  Ember.run(function() {
    renderComponent('top-level-component', {}, '#qunit-fixture');
  });
  assert.equal($('#top-level-component').length, 1, 'component was rendered');
});

test("Provides usefull error message when a component can't be found", function(assert) {
  assert.throws(function() {
    renderComponent('unknown-component', {}, '#qunit-fixture');
  }, /could not find a component/, "Threw the correct error message");
});
