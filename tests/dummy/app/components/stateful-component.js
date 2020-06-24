import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "button",

  init() {
    this._super(...arguments);
    this.count = 0;
    this.destroyCallCount = 0;
  },

  click() {
    this.incrementProperty("count");
  },

  trimmedInnerContent: computed("innerContent", function () {
    return this.innerContent.trim();
  }),

  destroy() {
    this.destroyCallCount++;
    this._super(...arguments);
  },
});
