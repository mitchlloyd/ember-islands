import Ember from 'ember';
const { guidFor } = Ember;

export default class Reconciler {
  constructor() {
    this.renderedComponents = {};
  }

  addRenderedComponent({ instance, container }) {
    let id = guidFor(container);
    this.renderedComponents[id] = instance;
  }

  reconcileAgainst(componentsToRender) {
    let nextRenderedComponents = {};
    let componentsToUpdate = [];
    let componentsToInitialRender = [];
    let componentsToDestroy = [];

    componentsToRender.forEach(c => {
      let elementId = guidFor(c.element);

      let instance = this.renderedComponents[elementId];
      if (instance) {
        c.instance = instance;
        componentsToUpdate.push(c);
        nextRenderedComponents[elementId] = instance;
      } else {
        componentsToInitialRender.push(c);
      }
    });

    for (let key in this.renderedComponents) {
      if (!nextRenderedComponents[key]) {
        componentsToDestroy.push(this.renderedComponents[key]);
      }
    }

    this.renderedComponents = nextRenderedComponents;

    return {
      initialRender: componentsToInitialRender,
      update: componentsToUpdate,
      destroy: componentsToDestroy
    };
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

// EIComponent is probably a thing
