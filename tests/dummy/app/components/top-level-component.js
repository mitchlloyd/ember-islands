import Ember from 'ember';

export default Ember.Component.extend({
  isExpanded: false,
  classNameBindings: [':top-level-component'],

  actions: {
    toggleIsExpanded: function() {
      this.toggleProperty('isExpanded', true);
    }
  }
});
