import Ember from 'ember';

export default Ember.Component.extend({
  isExpanded: false,
  attributeBindings: ['id'],
  id: 'top-level-component',

  actions: {
    toggleIsExpanded: function() {
      this.toggleProperty('isExpanded', true);
    }
  }
});
