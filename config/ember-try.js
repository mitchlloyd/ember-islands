module.exports = {
  scenarios: [
    {
      name: 'Ember 1.12',
      dependencies: {
        'ember': '1.12.1'
      }
    },
    {
      name: 'Ember 1.13',
      dependencies: {
        'ember': '1.13.2'
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
