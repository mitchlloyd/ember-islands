import { findAll, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { env } from 'ember-islands/utils/get-render-component';

module('Acceptance: Dealing with missing components in production', function(hooks) {
  setupApplicationTest(hooks);
  const failedAssertions = [];
  const errorMessages = [];
  const originalAssert = env.assert;
  const originalLogError = env.logError;

  env.assert = function(message, value) {
    if (!value) {
      failedAssertions.push(message);
    }
  }

  env.logError = function(message) {
    errorMessages.push(message);
  }

  hooks.beforeEach(function() {
    // Put some static content on the page before the Ember application loads.
    // This mimics server-rendered content.
    document.getElementById('ember-testing').innerHTML = `
      <div data-component='oops-not-component' data-attrs='{"title": "Component Title"}'></div>
      <div data-component='top-level-component'></div>
    `;
  });

  hooks.after(function() {
    env.assert = originalAssert;
    env.logError = originalLogError;
  })

  test('rendering the found component', async function(assert) {
    assert.expect(2);
    await visit('/');

    assert.equal(findAll('.top-level-component').length, 1, "The top level component was rendered");
    assert.deepEqual(errorMessages, [`ember-islands could not find a component named "oops-not-component" in your Ember application.`], 'Logs an error');
  });
});
