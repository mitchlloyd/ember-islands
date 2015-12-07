/* jshint node: true */

module.exports = {
  scenarios: [
    {
      name: 'ember-2.0',
      dependencies: {
        "ember": "~2.0.0"
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
