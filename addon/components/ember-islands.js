import Ember from 'ember';
import Reconciler from 'ember-islands/utils/reconciler';
const { $, Component, getOwner, Logger } = Ember;

let eiInstance;

export default Ember.Component.extend({
  tagName: '',

  init() {
    this._super(...arguments);
    this.renderComponent = getRenderComponentFor(this);
    this.componentsToRender = queryIslandComponents();
    this.reconciler = new Reconciler();

    eiInstance = this;
  },

  didInsertElement() {
    this.reconcile();
  },

  reconcile() {
    let componentsToRender = queryIslandComponents();
    let components = this.reconciler.reconcileAgainst(componentsToRender);

    components.initialRender.forEach(c => {
      let instance = this.renderComponent(c);
      this.reconciler.addRenderedComponent({ instance, container: c.element });
    });

    components.update.forEach(({ instance, attrs }) => {
      delete attrs.innerContent;
      instance.setProperties(attrs);
    });

    components.destroy.forEach(instance => instance.destroy());
  },

  willDestroyElement() {
    this.reconciler.forEachRenderedComponent(c => c.destroy());
  },

  getRenderedComponents() {
    return this.reconciler.renderedComponentsAsArray();
  }
});

function componentAttributes(element) {
  let attrs;
  let attrsJSON = element.getAttribute('data-attrs');

  if (attrsJSON) {
    attrs = JSON.parse(attrsJSON);
  } else {
    attrs = {};
  }

  attrs.innerContent = element.innerHTML;
  return attrs;
}

function getRenderComponentFor(emberObject) {
  let owner = getOwner(emberObject);

  return function renderComponent({ name, attrs, element }) {
    let { component, layout } = lookupComponent(owner, name);
    Ember.assert(missingComponentMessage(name), component);

    // This can only be true in production mode where assert is a no-op.
    if (!component) {
      ({ component, layout } = provideMissingComponentInProductionMode(owner, name));
    }

    if (layout) {
      attrs.layout = layout;
    }

    $(element).empty();
    let componentInstance = component.create(attrs);
    componentInstance.appendTo(element);
    return componentInstance;
  };
}

function queryIslandComponents() {
  let components = [];

  $('[data-component]').each(function() {
    let name = this.getAttribute('data-component');
    let attrs = componentAttributes(this);
    components.push({ attrs, name, element: this });
  });

  return components;
}

function lookupComponent(owner, name) {
  let componentLookupKey = `component:${name}`;
  let layoutLookupKey = `template:components/${name}`;
  let layout = owner._lookupFactory(layoutLookupKey);
  let component = owner._lookupFactory(componentLookupKey);

  if (layout && !component) {
    owner.register(componentLookupKey, Component);
    component = owner._lookupFactory(componentLookupKey);
  }

  return { component, layout };
}

function missingComponentMessage(name) {
  return `ember-islands could not find a component named "${name}" in your Ember application.`;
}

function provideMissingComponentInProductionMode(owner, name) {
  Logger.error(missingComponentMessage(name));

  return lookupComponent(owner, 'ember-islands/missing-component');
}

export function getInstance() {
  return eiInstance;
}
