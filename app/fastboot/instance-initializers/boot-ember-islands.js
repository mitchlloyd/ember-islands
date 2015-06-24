import Ember from 'ember';
import deactivateRouting from 'ember-islands/deactivate-routing';
import renderComponents from 'ember-islands/render-components';
var get = Ember.get;

export function initialize(instance) {
  if (get(instance, 'EMBER_ISLANDS.bypass')) {
    return;
  }

  deactivateRouting(instance);
  renderComponents(instance);
};

export default {
  name: 'boot-ember-islands',
  after: 'registerComponentLookup',
  initialize: initialize
};

