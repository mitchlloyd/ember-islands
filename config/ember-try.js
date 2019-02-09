/* eslint-env node */
module.exports = {
  useYarn: true,
  scenarios: [
    {
      name: 'ember-lts-2.12',
      npm: {
        devDependencies: {
          'ember-source': '~2.12.0'
        }
      }
    },
    {
      name: 'ember-lts-2.16',
      npm: {
        devDependencies: {
          'ember-source': '~2.16.0'
        }
      }
    },
    {
      name: 'ember-lts-2.18',
      npm: {
        devDependencies: {
          'ember-source': '~2.18.0'
        }
      }
    },
    {
      name: 'ember-lts-3.4',
      npm: {
        devDependencies: {
          'ember-source': '~3.4.0'
        }
      }
    },
    {
      name: 'ember-release',
      npm: {
        devDependencies: {
          'ember-source': '^3.0.0'
        }
      }
    },
  ]
};
