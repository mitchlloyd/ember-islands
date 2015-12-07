import Ember from 'ember';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.isShowingIslandComponents = true;
  },

  actions: {
    toggleIslandComponents() {
      this.toggleProperty('isShowingIslandComponents');
    }
  }
});
