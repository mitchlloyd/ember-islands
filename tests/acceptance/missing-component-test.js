import { module, test } from "qunit";
import { setupApplicationTest } from "ember-qunit";
import { getRootElement, visit } from "@ember/test-helpers";
import Ember from "ember";

let originalError, errors;

module("Acceptance | Dealing with missing components in production", function (
  hooks
) {
  hooks.beforeEach(function () {
    // Replace Ember's Logger.error with a fake that records the errors.
    originalError = Ember.Logger.error;
    errors = [];
    Ember.Logger.error = (message) => {
      errors.push(message);
    };
  });

  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    // Put some static content on the page before the Ember application loads.
    // This mimics server-rendered content.
    getRootElement().innerHTML = `
      <div data-component='oops-not-component' data-attrs='{"title": "Component Title"}'></div>
      <div data-component='top-level-component'></div>
    `;
  });

  hooks.afterEach(function () {
    Ember.Logger.error = originalError;
  });

  test("rendering the found component", async function (assert) {
    await visit("/");

    assert
      .dom("p")
      .includesText(
        "top level component",
        "The top level component was rendered"
      );
    assert.deepEqual(
      errors,
      [
        `ember-islands could not find a component named "oops-not-component" in your Ember application.`,
      ],
      "Logs an error"
    );
  });
});
