import { visit } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Using Inner Content', function(hooks) {
  hooks.beforeEach(function() {
    document.getElementById('ember-testing').innerHTML = `
      <div id='element-with-inner-content'
           data-component='inner-content-component'
           data-attrs='{"title": "Component Title"}'>

        <div id='inner-content'></div>
      </div>
    `;

    application = startApp();
  });

  hooks.afterEach(function() {
    run(application, 'destroy');
    document.getElementById('ember-testing').innerHTML = '';
  });

  test('extracting innerContent', async function(assert) {
    assert.expect(2);
    await visit('/');

    assert.dom('#element-with-inner-content > #inner-content').doesNotExist("The inner content of the server-rendered element is replaced");
    assert.dom('.inner-content-component > #inner-content').exists({ count: 1 }, "The innerContent is passed to components");
  });
});
