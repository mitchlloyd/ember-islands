import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

let application, originalAssert, originalError, errors;

module('Acceptance: Dealing with missing components in production', {
  beforeEach: function() {
    // Put some static content on the page before the Ember application loads.
    // This mimics server-rendered content.
    document.getElementById('ember-testing').innerHTML = `
      <div data-component='oops-not-component' data-attrs='{"title": "Component Title"}'></div>
      <div data-component='top-level-component'></div>
    `;

    // Replace Ember's `assert` function with a no-op. This mirrors Ember's
    // behavior in production mode.
    originalAssert = Ember.assert;
    Ember.assert = () => {};

    // Replace Ember's Logger.error with a fake that records the errors.
    originalError = Ember.Logger.error;
    errors = [];
    Ember.Logger.error = (message) => {
      errors.push(message);
    };

    application = startApp();
  },

  afterEach: function() {
    Ember.assert = originalAssert;
    Ember.Logger.error = originalError;

    Ember.run(application, 'destroy');
    document.getElementById('ember-testing').innerHTML = '';
  }
});

test('rendering the found component', function(assert) {
  assert.expect(2);
  visit('/');

  andThen(function() {
    assert.equal(find('p:contains(top level component)').length, 1, "The top level component was rendered");
    assert.deepEqual(errors, [`ember-islands could not find a component named "oops-not-component" in your Ember application.`], 'Logs an error');
  });
});
