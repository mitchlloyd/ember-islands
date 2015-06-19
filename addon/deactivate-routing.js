import Ember from 'ember';
var noop = Ember.K;

export default function deactivateRouting(instance) {
  if (instance.startRouting) {
    instance.startRouting = noop;
  } else {
    Ember.assert("ember-islands doesn't know how to cancel routing for this" +
                 "version of Ember. Please report this issue to https://github.com/mitchlloyd/ember-islands" +
                 `with the version of Ember you are using (Ember.VERSION)`);
  }
}
