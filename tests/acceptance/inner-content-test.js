import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance: Using Inner Content', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    document.getElementById('ember-testing').innerHTML = `
      <div id='element-with-inner-content'
           data-component='inner-content-component'
           data-attrs='{"title": "Component Title"}'>

        <div id='inner-content'></div>
      </div>
    `;
  });

  test('extracting innerContent', async function(assert) {
    assert.expect(2);
    await visit('/');

    assert.dom('#element-with-inner-content > #inner-content').doesNotExist("The inner content of the server-rendered element is replaced");
    assert.dom('.inner-content-component > #inner-content').exists({ count: 1 }, "The innerContent is passed to components");
  });
});
