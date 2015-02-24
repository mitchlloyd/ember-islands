import Ember from 'ember';

export default Ember.Component.extend({
  isExpanded: false,

  actions: {
    toggleIsExpanded: function() {
      this.toggleProperty('isExpanded', true);
    }
  }
});
