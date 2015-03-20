import Ember from 'ember';
import deactivateRouting from 'ember-islands/deactivate-routing';
import renderComponents from 'ember-islands/render-components';
var get = Ember.get;

export function initialize(registry, application) {
  if (get(application, 'EMBER_ISLANDS.bypass')) {
    return;
  }

  deactivateRouting(application);
  renderComponents(application);
};

export default {
  name: 'boot-ember-islands',
  after: 'registerComponentLookup',
  initialize: initialize
};

