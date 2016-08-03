import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  classNames: ['js-only-component'],

  onDidInsertElement() {
    this.$().html('js-only-component');
  }
});
