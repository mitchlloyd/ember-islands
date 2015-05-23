module.exports = {
  scenarios: [
    // Ember 1.11.1 appears to work, but there is a testing
    // issue where previous elements are not cleaned up.
    // {
    //   name: 'Ember 1.11.1',
    //   dependencies: {
    //     'ember': '1.11.1'
    //   }
    // },
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
