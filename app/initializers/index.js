import Ember from 'ember';
import getRenderComponentFor from 'ember-islands/get-render-component-for';
var $ = Ember.$;

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

