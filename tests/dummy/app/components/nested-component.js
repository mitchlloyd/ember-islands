import Ember from 'ember';

export default Ember.Component.extend({
  isExpanded: false,

  actions: {
    nestedAction: function() {
      this.sendAction('nestedAction');
    }
  }
});
