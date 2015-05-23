module.exports = {
  scenarios: [
    {
      name: 'Ember 1.11.3',
      dependencies: {
        'ember': '1.11.3'
      }
    },
    {
      name: 'Ember 1.12.0',
      dependencies: {
        'ember': '1.12.0'
      }
    },
    {
      name: 'Ember Canary',
      dependencies: {
        'ember': 'canary'
      },
      resolutions: {
        'ember': 'canary'
      }
    }
  ]
};
