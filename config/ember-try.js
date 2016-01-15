/* jshint node: true */

module.exports = {
  scenarios: [
    // Issue with ember-template compiler on Ember 2.0.3
    // https://github.com/emberjs/ember.js/issues/12820
    {
      name: 'ember-2.0',
      dependencies: {
        "ember": "2.0.2"
      }
    },
    {
      name: 'ember-2.1',
      dependencies: {
        "ember": "~2.1.0"
      }
    },
    {
      name: 'ember-2.2',
      dependencies: {
        "ember": "~2.2.0"
      }
    },
    {
      name: 'ember-canary',
      dependencies: {
        "ember": "components/ember#canary"
      },
      resolutions: {
        "ember": "canary"
      }
    }
  ]
};
