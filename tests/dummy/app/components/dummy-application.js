import Component from "@ember/component";

export default Component.extend({
  init() {
    this._super(...arguments);
    this.isShowingIslandComponents = true;
  },

  actions: {
    toggleIslandComponents() {
      this.toggleProperty("isShowingIslandComponents");
    },
  },
});
