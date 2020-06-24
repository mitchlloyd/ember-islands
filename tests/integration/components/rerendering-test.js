import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { hbs } from "ember-cli-htmlbars";
import { click, find, render, settled } from "@ember/test-helpers";
import { run } from "@ember/runloop";
import {
  pleaseDontUseThisExportToGetTheEmberIslandsInstance as getInstance,
  reconcile,
} from "ember-islands";

module("Integration | Component | rerendering", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // this.testContainer = $('<div id="container"></div>');
    // getRootElement().append(this.testContainer);
  });

  test("when the DOM does not change", async function (assert) {
    await render(hbs`
      <div data-component="stateful-component"
          data-attrs='{"title": "Title"}'>
        Inner Content
      </div>
      {{ember-islands}}
    `);

    // Click the component to increment its count to 1
    await click("button");

    let componentElement = find("button");

    assert
      .dom(componentElement)
      .hasText(
        "Title, Inner Content, 1",
        "Precondition: Rendered inside the stable element"
      );

    assert.equal(
      getInstance().getRenderedComponents().length,
      1,
      "Precondition: tracking 1 rendered component"
    );

    reconcile();

    assert
      .dom(componentElement)
      .hasText(
        "Title, Inner Content, 1",
        "Rendered content and state does not change"
      );

    assert.strictEqual(
      find("button"),
      componentElement,
      "The component element stays stable"
    );

    assert.equal(
      getInstance().getRenderedComponents().length,
      1,
      "still tracking 1 rendered component"
    );
  });

  test("when a placeholder is removed", async function (assert) {
    await render(hbs`
      <div id="container">
        <div data-component="stateful-component"
            data-attrs='{"title": "Title"}'>
          Inner Content
        </div>
      </div>
      {{ember-islands}}
    `);

    assert.dom().hasText("Title, Inner Content, 0", "Precondition: Rendered");

    assert.equal(
      getInstance().getRenderedComponents().length,
      1,
      "Precondition: tracking 1 rendered component"
    );

    let renderedComponent = getInstance().getRenderedComponents()[0];

    find("#container").innerHTML = `
      <div>
        All new DOM!
      </div>
    `;

    run(() => {
      reconcile();
    });

    await settled();

    assert.equal(
      renderedComponent.isDestroying,
      true,
      "The previously rendered component has been destroyed"
    );

    assert.notEqual(
      renderedComponent.destroyCallCount,
      0,
      "destroy called at least once"
    );

    assert.equal(
      getInstance().getRenderedComponents().length,
      0,
      "tracking no rendered components"
    );
  });

  test("when a new component placeholder is added", async function (assert) {
    await render(hbs`
      <div id="container"></div>
      {{ember-islands}}
    `);

    assert.dom().hasText("", "Precondition: Nothing rendered");

    assert.equal(
      getInstance().getRenderedComponents().length,
      0,
      "Precondition: tracking 0 rendered components"
    );

    find("#container").innerHTML = `
      <div data-component="stateful-component"
          data-attrs='{"title": "Title"}'>
        Inner Content
      </div>
    `;

    run(() => {
      reconcile();
    });

    assert
      .dom()
      .hasText(
        "Title, Inner Content, 0",
        "Renders a component for the added placeholder"
      );

    assert.equal(
      getInstance().getRenderedComponents().length,
      1,
      "started tracking 1 component"
    );
  });

  test("when attributes of a placeholder change", async function (assert) {
    await render(hbs`
      <div
        data-component="stateful-component"
        data-attrs='{"title": "Title"}'
        data-test-stateful-component
      >
        Inner Content
      </div>
      {{ember-islands}}
    `);

    let componentElement = find("button");

    // Click the component to increment its count to 1
    await click("button");

    assert
      .dom(componentElement)
      .hasText(
        "Title, Inner Content, 1",
        "Precondition: Rendered inside the stable element"
      );

    find("[data-test-stateful-component]").setAttribute(
      "data-attrs",
      '{"title": "New Title"}'
    );

    run(() => {
      reconcile();
    });

    assert
      .dom(componentElement)
      .hasText(
        "New Title, Inner Content, 1",
        "Attributes are updated and state is stable"
      );
  });

  test("when the data-component property of a placeholder changes", async function (assert) {
    await render(hbs`
      <div
        data-component="stateful-component"
        data-attrs='{"title": "Title"}'
        data-test-stateful-component
      >
        Inner Content
      </div>
      {{ember-islands}}
    `);

    let componentElement = find("button");

    assert
      .dom(componentElement)
      .hasText(
        "Title, Inner Content, 0",
        "Precondition: Rendered initial component"
      );

    assert.equal(
      getInstance().getRenderedComponents().length,
      1,
      "Precondition: tracking 1 rendered component"
    );

    find("[data-test-stateful-component]").setAttribute(
      "data-component",
      "top-level-component"
    );

    let previouslyRenderedComponent = getInstance().getRenderedComponents()[0];

    run(() => {
      reconcile();
    });

    assert.equal(
      previouslyRenderedComponent.isDestroying,
      true,
      "previously rendered component has been destroyed"
    );

    assert.notEqual(
      previouslyRenderedComponent.destroyCallCount,
      0,
      "previously rendered component destroy called at least once"
    );

    assert
      .dom()
      .includesText(
        "top level component",
        "Renders the new component in the placeholder"
      );

    assert.equal(
      getInstance().getRenderedComponents().length,
      1,
      "tracking 1 new rendered component"
    );
  });
});
