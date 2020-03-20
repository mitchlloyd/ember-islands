import Component from '@ember/component';

export default Component.extend({
  isExpanded: false,

  actions: {
    nestedAction: function() {
      this.sendAction('nestedAction');
    }
  }
});
