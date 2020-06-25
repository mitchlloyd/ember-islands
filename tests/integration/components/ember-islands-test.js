import Component from '@ember/component';
import { module, skip, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, getRootElement } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { env } from 'ember-islands/utils/get-render-component';
import { getFreshLifecycleCounts } from 'dummy/components/lifecycle-recorder';

module('Integration | Component | ember islands', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders an island component', async function(assert) {
    addStaticNode(`
      <div data-component="top-level-component"></div>
    `);

    await render(hbs`
      {{ember-islands}}
    `);

    const topLevelComponent = find('.top-level-component');
    assert.ok(topLevelComponent, 1);
  });

  test("rendering a component that only has an hbs template file", async function(assert) {
    addStaticNode(`
      <div data-component="hbs-only-component"></div>
    `);

    await render(hbs`
      {{ember-islands}}
    `);

    const topLevelComponent = find('.hbs-only-component');
    assert.ok(topLevelComponent, 1);
  });

  test("rendering a component that only has a JavaScript file", async function(assert) {
    addStaticNode(`
      <div data-component="js-only-component"></div>
    `);

    await render(hbs`
      {{ember-islands}}
    `);

    const jsOnlyComponent = find('.js-only-component');
    assert.ok(jsOnlyComponent);
  });

  test('it tears down an island component', async function(assert) {
    let teardownCalls = [];

    const IslandComponent = Component.extend({
      classNames: ['island-component'],

      willDestroyElement() {
        teardownCalls.push('willDestroyElement');
      },

      willDestroy() {
        teardownCalls.push('willDestroy');
      }
    });

    this.owner.register('component:island-component', IslandComponent);

    addStaticNode(`
      <div data-component="island-component"></div>
    `);

    this.set('isShowing', true);

    await render(hbs`
      {{#if isShowing}}
        {{ember-islands}}
      {{/if}}
    `);

    let islandComponent = find('.island-component');
    assert.ok(islandComponent, "Has component in DOM");

    this.set('isShowing', false);

    islandComponent = find('.island-component');
    assert.equal(islandComponent, null, "Component removed from DOM");

    assert.deepEqual(teardownCalls, ['willDestroyElement', 'willDestroy'], "All component teardown hooks called");
  });

  test("Provides useful error message when a component can't be found", async function(assert) {
    const failedAssertions = [];
    const originalAssert = env.assert;
    env.assert = function(message, value) {
      if (!value) {
        failedAssertions.push(message);
      }
    }

    addStaticNode(`
      <div data-component="unknown-component"></div>
    `);

    await this.render(hbs`
      {{ember-islands}}
    `);

    assert.deepEqual(
      failedAssertions,
      ['ember-islands could not find a component named "unknown-component" in your Ember application.'],
      'threw correct error'
    );
    env.assert = originalAssert;
  });

  test('Firing lifecycle events', async function(assert) {
    addStaticNode(`
      <div data-component="lifecycle-recorder"></div>
    `);

    const events = getFreshLifecycleCounts();
    await render(hbs`
      {{ember-islands}}
    `);

    assert.equal(events.didReceiveAttrs, 1);
  });

  test('Rendering a glimmer component', async function(assert) {
    addStaticNode(`
      <div data-component="Namespace::GlimmerComponent"></div>
    `);

    await render(hbs`
      {{ember-islands}}
    `);

    assert.ok(find('.glimmer-component'));
  });
});

function addStaticNode(innerHTML) {
  const node = document.createElement('DIV');
  node.innerHTML = innerHTML;
  getRootElement().appendChild(node);
}
