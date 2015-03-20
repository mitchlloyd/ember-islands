import Ember from 'ember';
var assert = Ember.assert;
var $ = Ember.$;

// Do a little dance with Ember to create a function that can render
// components for the given application.
export function getRenderComponentFor(application) {
  var container = application.__container__;
  var componentLookup = container.lookup('component-lookup:main');

  return function renderComponent(name, attributes, element) {
    var component = componentLookup.lookupFactory(name, container);
    assert(`ember-islands could not find a component named "${name}" in your Ember appliction.`, component);
    component.create(attributes).appendTo(element);
  };
}

function componentAttributes(element) {
  var json = element.getAttribute('data-attrs');
  return json ? JSON.parse(json) : {};
}

export default function renderComponents(application) {
  var renderComponent = getRenderComponentFor(application);

  $('[data-component]').each(function() {
    var name = this.getAttribute('data-component');
    var attrs = componentAttributes(this);
    renderComponent(name, attrs, this);
  });
}
