import Ember from 'ember';
import deactivateRouting from 'ember-islands/deactivate-routing';
import renderComponents from 'ember-islands/render-components';
var get = Ember.get;
var set = Ember.set;

export function initialize() {
  let application = arguments[1] || arguments[0];
  if (get(application, 'EMBER_ISLANDS.bypass')) {
    set(application.__deprecatedInstance__, 'EMBER_ISLANDS', {bypass: true});
  }
};

export default {
  name: 'boot-ember-islands',
  initialize: initialize
};

