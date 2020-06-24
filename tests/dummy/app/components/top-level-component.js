import Component from "@ember/component";

export default Component.extend({
  isExpanded: false,
  classNameBindings: [":top-level-component"],

  actions: {
    toggleIsExpanded: function () {
      this.toggleProperty("isExpanded", true);
    },
  },
});
