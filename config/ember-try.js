module.exports = {
  scenarios: [
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
