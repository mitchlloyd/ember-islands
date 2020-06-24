import { module, test } from "qunit";
import { setupApplicationTest } from "ember-qunit";
import { getRootElement, findAll, visit } from "@ember/test-helpers";

module("Acceptance | Using Inner Content", function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    getRootElement().innerHTML = `
      <div id='element-with-inner-content'
           data-component='inner-content-component'
           data-attrs='{"title": "Component Title"}'>

        <div id='inner-content'></div>
      </div>
    `;
  });

  test("extracting innerContent", async function (assert) {
    assert.expect(2);
    await visit("/");

    assert.equal(
      findAll("#element-with-inner-content > #inner-content").length,
      0,
      "The inner content of the server-rendered element is replaced"
    );
    assert.equal(
      findAll(".inner-content-component > #inner-content").length,
      1,
      "The innerContent is passed to components"
    );
  });
});
