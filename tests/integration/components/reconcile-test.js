import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {
  pleaseDontUseThisExportToGetTheEmberIslandsInstance as getInstance,
  reconcile
} from 'ember-islands';

module('Integration | Component | rerendering', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.testContainer = document.createElement('div');
    this.testContainer.id = 'container';
    document.getElementById('ember-testing').appendChild(this.testContainer);
  });

  test('when the DOM does not change', async function(assert) {
    this.testContainer.innerHTML = `
      <div data-component="stateful-component"
           data-attrs='{"title": "Title"}'>
        Inner Content
      </div>
    `;

    await render(hbs`
      {{ember-islands}}
    `);

    // Click the component to increment its count to 1
    const componentElement = this.testContainer.querySelector('button');
    componentElement.click();

    assert.equal(
      componentElement.textContent.trim(),
      'Title, Inner Content, 1',
      'Precondition: Rendered inside the stable element'
    );

    assert.equal(
      getInstance().getRenderedComponents().length,
      1,
      'Precondition: tracking 1 rendered component'
    );

    reconcile();

    assert.equal(
      componentElement.textContent.trim(),
      'Title, Inner Content, 1',
      'Rendered content and state does not change'
    );

    assert.strictEqual(
      this.testContainer.querySelector('button'),
      componentElement,
      'The component element stays stable'
    );

    assert.equal(
      getInstance().getRenderedComponents().length,
      1,
      'still tracking 1 rendered component'
    );
  });

  test('when a placeholder is removed', async function(assert) {
    this.testContainer.innerHTML = `
      <div data-component="stateful-component"
           data-attrs='{"title": "Title"}'>
        Inner Content
      </div>
    `;

    await render(hbs`
      {{ember-islands}}
    `);

    assert.equal(
      this.testContainer.textContent.trim(),
      'Title, Inner Content, 0',
      'Precondition: Rendered'
    );

    assert.equal(
      getInstance().getRenderedComponents().length,
      1,
      'Precondition: tracking 1 rendered component'
    );

    let renderedComponent = getInstance().getRenderedComponents()[0];

    this.testContainer.innerHTML = `
      <div>
        All new DOM!
      </div>
    `;

    reconcile();

    return settled().then(function() {
      assert.equal(
        renderedComponent.isDestroying,
        true,
        'The previously rendered component has been destroyed'
      );

      assert.notEqual(
        renderedComponent.destroyCallCount,
        0,
        'destroy called at least once'
      );

      assert.equal(
        getInstance().getRenderedComponents().length,
        0,
        'tracking no rendered components'
      );
    });
  });

  test('when a new component placeholder is added', async function(assert) {
    await render(hbs`
      {{ember-islands}}
    `);

    assert.equal(this.testContainer.textContent.trim(), '', 'Precondition: Nothing rendered');

    assert.equal(
      getInstance().getRenderedComponents().length,
      0,
      'Precondition: tracking 0 rendered components'
    );

    this.testContainer.innerHTML = `
      <div data-component="stateful-component"
          data-attrs='{"title": "Title"}'>
        Inner Content
      </div>
    `;

    reconcile();

    assert.equal(
      this.testContainer.textContent.trim(),
      'Title, Inner Content, 0',
      'Renders a component for the added placeholder'
    );

    assert.equal(
      getInstance().getRenderedComponents().length,
      1,
      'started tracking 1 component'
    );
  });

  test('when attributes of a placeholder change', async function(assert) {
    this.testContainer.innerHTML = `
      <div data-component="stateful-component"
           data-attrs='{"title": "Title"}'>
        Inner Content
      </div>
    `;

    await render(hbs`
      {{ember-islands}}
    `);

    let componentElement = this.testContainer.querySelector('button');

    // Click the component to increment its count to 1
    this.testContainer.querySelector('button').click();

    assert.equal(
      componentElement.textContent.trim(),
      'Title, Inner Content, 1',
      'Precondition: Rendered inside the stable element'
    );

    this.testContainer
      .querySelector('[data-component=stateful-component]')
      .setAttribute('data-attrs', '{"title": "New Title"}');

    reconcile();

    // Wait a tick for rendering
    await new Promise(r => setTimeout(r, 0));

    assert.equal(
      componentElement.textContent.trim(),
      'New Title, Inner Content, 1',
      'Attributes are updated and state is stable'
    );
  });

  test('when the data-component property of a placeholder changes', async function(assert) {
    this.testContainer.innerHTML = `
      <div data-component="stateful-component"
           data-attrs='{"title": "Title"}'>
        Inner Content
      </div>
    `;

    await render(hbs`
      {{ember-islands}}
    `);

    let componentElement = this.testContainer.querySelector('button');

    assert.equal(
      componentElement.textContent.trim(),
      'Title, Inner Content, 0',
      'Precondition: Rendered initial component'
    );

    assert.equal(
      getInstance().getRenderedComponents().length,
      1,
      'Precondition: tracking 1 rendered component'
    );

    this.testContainer
      .querySelector('[data-component=stateful-component]')
      .setAttribute('data-component', 'top-level-component');

    let previouslyRenderedComponent = getInstance().getRenderedComponents()[0];

    run(() => {
      reconcile();
    });

    assert.equal(
      previouslyRenderedComponent.isDestroying,
      true,
      'previously rendered component has been destroyed'
    );

    assert.notEqual(
      previouslyRenderedComponent.destroyCallCount,
      0,
      'previously rendered component destroy called at least once'
    );

    assert.notEqual(
      this.testContainer.textContent.indexOf('top level component'),
      -1,
      'Renders the new component in the placeholder'
    );

    assert.equal(
      getInstance().getRenderedComponents().length,
      1,
      'tracking 1 new rendered component'
    );
  });
});
