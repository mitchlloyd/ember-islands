import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';
const { $, assert, Component } = Ember;

export default Ember.Component.extend({
  tagName: '',

  init() {
    this._super(...arguments);
    if (!$) return;

    this.renderComponent = getRenderComponentFor(this);
    this.componentsToRender = queryIslandComponents();
    this.renderedComponents = [];
  },

  didInsertElement() {
    this.renderedComponents = this.componentsToRender.map(this.renderComponent);
  },

  didDestroyElement() {
    this.renderedComponents.forEach((renderedComponent) => {
      renderedComponent.destroy();
    });
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
    let component = lookupComponent(owner, name);
    assert(`ember-islands could not find a component named "${name}" in your Ember appliction.`, component);

    // Work around for #replaceIn bug
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
  let layout = owner.lookup(layoutLookupKey);

  if (layout) {
    owner.inject(componentLookupKey, 'layout', layoutLookupKey);
  }

  let component = owner._lookupFactory(componentLookupKey);

  if (layout && !component) {
    owner.register(componentLookupKey, Component);
    component = owner._lookupFactory(componentLookupKey);
  }

  return component;
}
