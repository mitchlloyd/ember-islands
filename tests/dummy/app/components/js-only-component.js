import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  classNames: ['js-only-component'],

  onDidInsertElement() {
    this.element.innerHTML = 'js-only-component';
  }
});
