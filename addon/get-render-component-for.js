// Do a little dance with Ember to create a function that can render
// components for the given application.
export default function getRenderComponentFor(application) {
  var container = application.__container__;
  var componentLookup = container.lookup('component-lookup:main');

  return function renderComponent(name, attributes, element) {
    var component = componentLookup.lookupFactory(name, container);
    component.create(attributes).appendTo(element);
  };
}
