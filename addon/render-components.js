import Ember from 'ember';
var assert = Ember.assert;
var $ = Ember.$;

// Do a little dance with Ember to create a function that can render
// components for the given application.
export function getRenderComponentFor(instance_or_application) {

  var container;
  if (instance_or_application.container) {
    container = instance_or_application.container;
  } else if (instance_or_application.__container__) {
    container = instance_or_application.__container__;
  } else {
    Ember.assert("ember-islands doesn't know how to render components for this" +
      "version of Ember. Please report this issue to https://github.com/mitchlloyd/ember-islands" +
      `with the version of Ember you are using (${Ember.VERSION})`);
  }

  var componentLookup = container.lookup('component-lookup:main');

  return function renderComponent(name, attributes, element) {
    var component = componentLookup.lookupFactory(name, container);
    assert(`ember-islands could not find a component named "${name}" in your Ember appliction.`, component);

    var $element = $(element);
    // Temporary fix for bug in `replaceIn`
    $element.empty();
    $element.data('component-instance', component.create(attributes).appendTo(element));
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

export default function renderComponents(instance_or_application) {
  var renderComponent = getRenderComponentFor(instance_or_application);

  $('[data-component]').each(function() {
    var name = this.getAttribute('data-component');
    var attrs = componentAttributes(this);
    renderComponent(name, attrs, this);
  });
}
