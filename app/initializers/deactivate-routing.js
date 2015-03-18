import Ember from 'ember';
var noop = Ember.K;

export function initialize(registry, application) {
  if (application.startRouting) {
    application.startRouting = noop;
  } else if (application.__deprecatedInstance__ && application.__deprecatedInstance__.startRouting) {
    application.__deprecatedInstance__.startRouting = noop;
  } else {
    Ember.assert("ember-islands doesn't know how to cancel routing for this" +
                 "version of Ember. Please report this issue to https://github.com/mitchlloyd/ember-islands" +
                 `with the version of Ember you are using (Ember.VERSION)`);
  }
}

export default {
  name: 'deactivate-routing',
  initialize: initialize
};

