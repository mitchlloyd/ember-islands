import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';
const { $, assert } = Ember;

export default Ember.Component.extend({
  tagName: '',

  init() {
    this._super(...arguments);
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
  let componentLookup = getOwner(emberObject).lookup('component-lookup:main');

  return function renderComponent({ name, attrs, element }) {
    let component = componentLookup.lookupFactory(name);
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
