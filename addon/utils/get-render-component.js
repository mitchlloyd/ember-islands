import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import Component from '@ember/component';
import Ember from 'ember';
const {
  Logger
} = Ember;

export const env = {
  assert(message, value) {
    assert(message, value);
  },

  logError(message) {
    Logger.error(message);
  }
};

export default function getRenderComponent(emberObject) {
  let owner = getOwner(emberObject);

  return function renderComponent({ name, attrs, element }) {
    let { component, layout } = lookupComponent(owner, name);
    env.assert(missingComponentMessage(name), component);

    // This can only be true in production mode where assert is a no-op.
    if (!component) {
      ({ component, layout } = provideMissingComponentInProductionMode(owner, name));
    }

    if (layout) {
      attrs.layout = layout;
    }

    while (element.firstChild) { element.removeChild(element.firstChild); }
    // let componentInstance = component.create(attrs);
    const cm = owner.lookup('component-manager:glimmer');
    debugger;
    let componentInstance = cm.createComponent(component.class, attrs);
    componentInstance.trigger('didReceiveAttrs');
    componentInstance.appendTo(element);

    return componentInstance;
  };
}

function lookupComponent(owner, name) {
  let componentLookupKey = `component:${name}`;
  let layoutLookupKey = `template:components/${name}`;

  let layout;
  let component;
  if (name[0].toUpperCase() === name[0]) {
    // If component starts with a capital letter we'll assume it's a glimmer
    // components.
    layout = owner.factoryFor(layoutLookupKey);
    component = owner.factoryFor(`component:${dasherizeComponentName(name)}`);
  } else {
    // Otherwise it's a legacy, curly component.
    layout = owner.lookup(layoutLookupKey);
    component = owner.factoryFor(componentLookupKey);
  }


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
  env.logError(missingComponentMessage(name));

  return lookupComponent(owner, 'ember-islands/missing-component');
}

const SIMPLE_DASHERIZE_REGEXP = /[A-Z]|::/g;
const ALPHA = /[A-Za-z0-9]/;
function dasherizeComponentName(name) {
  return name.replace(SIMPLE_DASHERIZE_REGEXP, (char, index) => {
    if (char === '::') {
      return '/';
    }

    if (index === 0 || !ALPHA.test(name[index - 1])) {
      return char.toLowerCase();
    }

    return `-${char.toLowerCase()}`;
  })
}
