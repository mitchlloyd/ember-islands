import Ember from 'ember';
const { guidFor } = Ember;

export default class Reconciler {
  /**
   * @param {{[elementGuid: string]: Function}} callbacks
   */
  constructor(callbacks) {
    this.renderedComponents = {};
    this.callbacks = callbacks;
  }

  reconcileAgainst(componentsToRender) {
    let nextRenderedComponents = {};

    componentsToRender.forEach(ic => {
      let elementGuid = guidFor(ic.element);

      let renderedIC = this.renderedComponents[elementGuid];
      if (renderedIC) {
        if (renderedIC.name === ic.name) {
          ic.instance = renderedIC.instance;
          this.callbacks.update(ic);
        } else {
          this.callbacks.destroy(renderedIC.instance);
          ic.instance = this.callbacks.initialRender(ic);
        }
      } else {
        ic.instance = this.callbacks.initialRender(ic);
      }

      nextRenderedComponents[elementGuid] = ic;
    });

    for (let key in this.renderedComponents) {
      if (!(key in nextRenderedComponents)) {
        this.callbacks.destroy(this.renderedComponents[key].instance);
      }
    }

    this.renderedComponents = nextRenderedComponents;
  }

  renderedComponentsAsArray() {
    let result = [];
    for (let key in this.renderedComponents) {
      result.push(this.renderedComponents[key].instance);
    }

    return result;
  }

  forEachRenderedComponent(callback) {
    for (let key in this.renderedComponents) {
      callback(this.renderedComponents[key].instance);
    }
  }
}
