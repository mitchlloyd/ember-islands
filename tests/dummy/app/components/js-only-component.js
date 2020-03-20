import Component from '@ember/component';

export default Component.extend({
  classNames: ['js-only-component'],

  onDidInsertElement() {
    this.element.innerHTML = 'js-only-component';
  }
});
