import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import Component from "@ember/component";

module("Integration | Component | ember islands", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders an island component", async function (assert) {
    await render(hbs`
      <div data-component="top-level-component"></div>
      {{ember-islands}}
    `);

    assert.dom(".top-level-component").exists();
  });

  test("rendering a component that only has an hbs template file", async function (assert) {
    await render(hbs`
      <div data-component="hbs-only-component"></div>
      {{ember-islands}}
    `);

    assert.dom(".hbs-only-component").exists();
  });

  test("rendering a component that only has a JavaScript file", async function (assert) {
    await render(hbs`
      <div data-component="js-only-component"></div>
      {{ember-islands}}
    `);

    assert.dom(".js-only-component").exists();
  });

  test("it tears down an island component", async function (assert) {
    let teardownCalls = [];

    const IslandComponent = Component.extend({
      classNames: ["island-component"],

      willDestroyElement() {
        teardownCalls.push("willDestroyElement");
      },

      willDestroy() {
        teardownCalls.push("willDestroy");
      },
    });

    this.owner.register("component:island-component", IslandComponent);

    this.set("isShowing", true);

    await render(hbs`
      <div data-component="island-component"></div>
      {{#if isShowing}}
        {{ember-islands}}
      {{/if}}
    `);

    assert.dom(".island-component").exists("Has component in DOM");

    this.set("isShowing", false);

    assert.dom(".island-compoment").doesNotExist("Component removed from DOM");

    assert.deepEqual(
      teardownCalls,
      ["willDestroyElement", "willDestroy"],
      "All component teardown hooks called"
    );
  });
});
