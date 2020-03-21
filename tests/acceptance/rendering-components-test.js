import { click, findAll, visit, find } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance: Rendering Components', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    // Put some static content on the page before the Ember application loads.
    // This mimics server-rendered content.
    document.getElementById('ember-testing').innerHTML = `
      <p>server-rendered content top</p>
      <div data-component='top-level-component' data-attrs='{"title": "Component Title"}'></div>
      <p>server-rendered content bottom</p>
    `;
  });

  test('rendering a component with an attribute', async function(assert) {
    assert.expect(2);
    await visit('/');

    assert.equal(findAll('.top-level-component').length, 1, "The top level component was rendered");
    const componentTitle = find('#component-title');
    assert.equal(componentTitle.textContent, "Component Title", "Passed in attributes can be used");
  });

  test('using component events', async function(assert) {
    assert.expect(2);
    await visit('/');

    assert.dom("#expanded-content").doesNotExist("Expanded content is hidden at first");

    await click('#toggle-expanded');

    assert.dom("#expanded-content").exists({ count: 1 }, "The expanded content is showing");
  });

  test('using nested components', async function(assert) {
    assert.expect(3);
    await visit('/');

    const nestedComponent = find('.nested-component');
    assert.ok(nestedComponent, "The nested component was rendered");
    assert.dom("#expanded-content").doesNotExist("Expanded content is hidden at first");

    await click('#nested-component-toggle-expanded');

    assert.dom("#expanded-content").exists({ count: 1 }, "The expanded content is showing");
  });
});
