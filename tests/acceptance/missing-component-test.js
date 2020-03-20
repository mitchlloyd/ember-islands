import { findAll, visit } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

let application, originalError, errors;

module('Acceptance: Dealing with missing components in production', function(hooks) {
  hooks.beforeEach(function() {
    // Put some static content on the page before the Ember application loads.
    // This mimics server-rendered content.
    document.getElementById('ember-testing').innerHTML = `
      <div data-component='oops-not-component' data-attrs='{"title": "Component Title"}'></div>
      <div data-component='top-level-component'></div>
    `;

    // Replace Ember's Logger.error with a fake that records the errors.
    originalError = Ember.Logger.error;
    errors = [];
    Ember.Logger.error = (message) => {
      errors.push(message);
    };

    application = startApp();
  });

  hooks.afterEach(function() {
    Ember.Logger.error = originalError;

    run(application, 'destroy');
    document.getElementById('ember-testing').innerHTML = '';
  });

  test('rendering the found component', async function(assert) {
    assert.expect(2);
    await visit('/');

    assert.equal(findAll('p:contains(top level component)').length, 1, "The top level component was rendered");
    assert.deepEqual(errors, [`ember-islands could not find a component named "oops-not-component" in your Ember application.`], 'Logs an error');
  });
});
