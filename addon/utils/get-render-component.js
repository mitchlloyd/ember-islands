import Ember from 'ember';
const { getOwner, Component, Logger } = Ember;

export default function getRenderComponent(emberObject) {
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

    while (element.firstChild) { element.removeChild(element.firstChild); }
    let componentInstance = component.create(attrs);
    componentInstance.appendTo(element);

    return componentInstance;
  };
}

function lookupComponent(owner, name) {
  let componentLookupKey = `component:${name}`;
  let layoutLookupKey = `template:components/${name}`;
  let layout = owner.lookup(layoutLookupKey);
  let component = owner.factoryFor(componentLookupKey);

  if (layout && !component) {
    owner.register(componentLookupKey, Component);
    component = owner.factoryFor(componentLookupKey);
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
