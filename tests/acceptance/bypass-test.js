import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Bypassing Ember Islands', {
  beforeEach: function() {
    // Put some static content on the page before the Ember application loads.
    // This mimics server-rendered content.
    document.getElementById('ember-testing').innerHTML = `
      <script></script>
      <div data-component='top-level-component' data-attrs='{"title": "Component Title"}'></div>
    `;

    // Disabled the addon.
    application = startApp({
      EMBER_ISLANDS: { bypass: true }
    });
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('setting EmberENV.emberIslands.bypass = true', function(assert) {
  assert.expect(1);

  visit('/').then(function() {
    assert.equal(find('p:contains(top level component)').length, 0, "The top level component was not rendered");
  });
});

test('rendering the application template', function(assert) {
  visit('/').then(function() {
    assert.equal(find("#application-template").length, 1, "Application template was rendered");
  });
});
