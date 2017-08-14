import Ember from 'ember';
const { guidFor } = Ember;

export default class Reconciler {
  constructor(callbacks) {
    this.renderedComponents = {};
    this.callbacks = callbacks;
  }

  reconcileAgainst(componentsToRender) {
    let nextRenderedComponents = {};

    componentsToRender.forEach(c => {
      let elementId = guidFor(c.element);

      let instance = this.renderedComponents[elementId];
      if (instance) {
        c.instance = instance;
        this.callbacks.update(c);
      } else {
        instance = this.callbacks.initialRender(c);
      }

      nextRenderedComponents[elementId] = instance;
    });

    for (let key in this.renderedComponents) {
      if (!(key in nextRenderedComponents)) {
        this.callbacks.destroy(this.renderedComponents[key]);
      }
    }

    this.renderedComponents = nextRenderedComponents;
  }

  renderedComponentsAsArray() {
    let result = [];
    for (let key in this.renderedComponents) {
      result.push(this.renderedComponents[key]);
    }

    return result;
  }

  forEachRenderedComponent(callback) {
    for (let key in this.renderedComponents) {
      callback(this.renderedComponents[key]);
    }
  }
}
