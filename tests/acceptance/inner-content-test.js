import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Using Inner Content', {
  beforeEach: function() {
    document.getElementById('ember-testing').innerHTML = `
      <div id='element-with-inner-content'
           data-component='inner-content-component'
           data-attrs='{"title": "Component Title"}'>

        <div id='inner-content'></div>
      </div>
    `;

    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
    document.getElementById('ember-testing').innerHTML = '';
  }
});

test('extracting innerContent', function(assert) {
  assert.expect(2);
  visit('/');

  andThen(function() {
    assert.equal(find('#element-with-inner-content > #inner-content').length, 0, "The inner content of the server-rendered element is replaced");
    assert.equal(find('.inner-content-component > #inner-content').length, 1, "The innerContent is passed to components");
  });
});
