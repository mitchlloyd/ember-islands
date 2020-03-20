## Module Report
### Unknown Global

**Global**: `Ember.Logger`

**Location**: `addon/utils/get-render-component.js` at line 2

```js
import Ember from 'ember';
const { getOwner, Component, Logger } = Ember;

export default function getRenderComponent(emberObject) {
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/missing-component-test.js` at line 22

```js

    // Replace Ember's Logger.error with a fake that records the errors.
    originalError = Ember.Logger.error;
    errors = [];
    Ember.Logger.error = (message) => {
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/missing-component-test.js` at line 24

```js
    originalError = Ember.Logger.error;
    errors = [];
    Ember.Logger.error = (message) => {
      errors.push(message);
    };
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/missing-component-test.js` at line 33

```js
  afterEach: function() {
    Ember.assert = originalAssert;
    Ember.Logger.error = originalError;

    Ember.run(application, 'destroy');
```
