import { module, test } from "qunit";
import { setupApplicationTest } from "ember-qunit";
import { click, getRootElement, visit } from "@ember/test-helpers";

module("Acceptance | Rendering Components", function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    // Put some static content on the page before the Ember application loads.
    // This mimics server-rendered content.
    getRootElement().innerHTML = `
      <p>server-rendered content top</p>
      <div data-component='top-level-component' data-attrs='{"title": "Component Title"}'></div>
      <p>server-rendered content bottom</p>
    `;
  });

  test("rendering a component with an attribute", async function (assert) {
    await visit("/");

    assert
      .dom("[data-test-top-level-component-message]")
      .exists("The top level component was rendered");

    assert
      .dom("#component-title")
      .includesText("Component Title", "Passed in attributes can be used");
  });

  test("using component events", async function (assert) {
    await visit("/");

    assert
      .dom("#expanded-content")
      .doesNotExist("Expanded content is hidden at first");

    await click("#toggle-expanded");

    assert.dom("#expanded-content").exists("The expanded content is showing");
  });

  test("using nested components", async function (assert) {
    await visit("/");

    assert
      .dom("[data-test-nested-component-message]")
      .exists("The nested component was rendered");
  });
});
