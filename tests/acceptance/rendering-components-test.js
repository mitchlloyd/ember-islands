import { click, findAll, visit } from '@ember/test-helpers';
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Rendering Components', {
  beforeEach: function() {
    // Put some static content on the page before the Ember application loads.
    // This mimics server-rendered content.
    document.getElementById('ember-testing').innerHTML = `
      <p>server-rendered content top</p>
      <div data-component='top-level-component' data-attrs='{"title": "Component Title"}'></div>
      <p>server-rendered content bottom</p>
    `;

    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
    document.getElementById('ember-testing').innerHTML = '';
  }
});

test('rendering a component with an attribute', async function(assert) {
  assert.expect(2);
  await visit('/');

  assert.equal(findAll('p:contains(top level component)').length, 1, "The top level component was rendered");
  assert.equal(findAll('#component-title:contains(Component Title)').length, 1, "Passed in attributes can be used");
});

test('using component events', async function(assert) {
  assert.expect(2);
  await visit('/');

  assert.equal(findAll("#expanded-content").length, 0, "Expanded content is hidden at first");

  await click('#toggle-expanded');

  assert.equal(findAll("#expanded-content").length, 1, "The expanded content is showing");
});

test('using nested components', async function(assert) {
  assert.expect(3);
  await visit('/');

  assert.equal(findAll('p:contains(A nested component)').length, 1, "The nested component was rendered");
  assert.equal(findAll("#expanded-content").length, 0, "Expanded content is hidden at first");

  await click('#nested-component-toggle-expanded');

  assert.equal(findAll("#expanded-content").length, 1, "The expanded content is showing");
});
