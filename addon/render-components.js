import Ember from 'ember';
var assert = Ember.assert;
var $ = Ember.$;

// Do a little dance with Ember to create a function that can render
// components for the given application.
export function getRenderComponentFor(instance) {
  var container = instance.container;
  var componentLookup = container.lookup('component-lookup:main');

  return function renderComponent(name, attributes, element) {
    var component = componentLookup.lookupFactory(name, container);
    assert(`ember-islands could not find a component named "${name}" in your Ember appliction.`, component);

    // Temporary fix for bug in `replaceIn`
    $(element).empty();
    component.create(attributes).appendTo(element);
  };
}

function componentAttributes(element) {
  var attrs;
  var attrsJSON = element.getAttribute('data-attrs');

  if (attrsJSON) {
    attrs = JSON.parse(attrsJSON);
  } else {
    attrs = {};
  }

  attrs.innerContent = element.innerHTML;
  return attrs;
}

export default function renderComponents(instance) {
  var renderComponent = getRenderComponentFor(instance);

  $('[data-component]').each(function() {
    var name = this.getAttribute('data-component');
    var attrs = componentAttributes(this);
    renderComponent(name, attrs, this);
  });
}
