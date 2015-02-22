import Ember from 'ember';
var $ = Ember.$;

// Do a little dance with Ember to create a function that can render
// components for the given application.
function getRenderComponentFor(application) {
  var container = application.__container__;
  var componentLookup = container.lookup('component-lookup:main');

  return function renderComponent(name, attributes, element) {
    var component = componentLookup.lookupFactory(name, container);
    component.create(attributes).appendTo(element);
  };
}

function componentAttributes(element) {
  var json = element.getAttribute('data-attrs');
  return json ? JSON.parse(json) : {};
}

export function initialize(registry, application) {
  var renderComponent = getRenderComponentFor(application);

  $('[data-component]').each(function() {
    var name = this.getAttribute('data-component');
    var attrs = componentAttributes(this);
    renderComponent(name, attrs, this);
  });
}

export default {
  name: 'run-ember-island',
  after: 'registerComponentLookup',
  initialize: initialize
};

