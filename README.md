<img
  src="http://mitchlloyd.com/ember-islands/images/ember-islands-logo-700.png"
  width="350px"
  alt="Ember Islands Logo"
  title="Ember Islands Logo">

[![Build Status](https://travis-ci.org/mitchlloyd/ember-islands.svg?branch=master)](https://travis-ci.org/mitchlloyd/ember-islands)

Render Ember components into existing HTML.

This addon provides a practical way to introduce Ember into a server-rendered
application. It can facilitate a gradual redesign from a server-rendered
application to a client-rendered application.

## Installation

If you're starting a new Ember project, follow the Getting Started > Quick Start
section of the [Ember Guides](https://guides.emberjs.com). Once you have an Ember
CLI project you can install Ember Islands.

```
ember install ember-islands
```

Version 1.x of this addon is tested against Ember 2.x versions. If you have
trouble with an earlier version of Ember try using version 0.5.x of Ember
Islands.

## Usage

Add a placeholder for an Ember Component inside your server-rendered HTML.

```html
<div
  data-component='user-profile'
  data-attrs='{"name": "Sally User", "id": "4"}'>

  <p>Sally likes hiking in the wilderness</p>

</div>
```

* `data-component` names the component to render into this placeholder.
* `data-attrs` is a JSON object that will become the component's `attrs`.
* Content inside of the placeholder tag (`innerHTML`) will be the component's
  `innerContent` attribute.

Next define a component for that placeholder. In this example we'll show the
details of a user when someone clicks on their name.

```handlebars
{{! inside of app/templates/components/user-profile.hbs}}

<h2 {{action 'showDetails'}}>
  {{name}}
</h2>

{{#if isShowingDetails}}
  <p>{{description}}</p>
  {{user.email}}
  {{user.address}}
{{/if}}
```

Inside of the component JavaScript file we'll load a user from the Ember Data
store when the name is clicked and reveal the details portion of the template.

```javascript
// inside of app/components/user-profile.js

import Ember from 'ember';
const { Component, inject } = Ember;

export default Component.extend({
  store: inject.service(),

  init() {
    this._super(...arguments);
    this.description = this.get('innerContent').htmlSafe();
  },

  actions: {
    showDetails() {
      this.get('store').findRecord('user', this.get('id')).then((user) => {
        this.set('user', user);
      });

      this.set('isShowingDetails', true);
    }
  }
})
```

Notice that before rendering `innerContent` we called `htmlSafe` on it. Ember
will escape this HTML if we don't mark it as safe.

If you want to render island components on any server-rendered page you can add
the `{{ember-islands}}` component to your `application.hbs` template file and
configure the router `locationType` to ignore the URL.

```handlebars
{{! inside of app/templates/application.hbs}}

{{ember-islands}}
```

```javascript
// in /config/environment.js

module.exports = function(environment) {
  var ENV = {
    // ... other config

    locationType: 'none',

    // ... more config
  }
}

```

More advanced uses are described in [Rendering Ember Islands Based on URL Paths](#rendering-ember-islands-based-on-url-paths).


## Rendering Ember Islands Based on URL paths

Exclusively using Ember Islands is a great way to start introducing components
into an application. However, you can also use Ember's routing and the
`{{ember-islands}}` component to choose when to render island components. Let's
look at an example of using a combination of island components and `rootElement`
configuration to handle different cases.

It's useful to control where your Ember Application is rendered so that we
could, for instance, maintain a consistent header and footer across the
server-rendered application. To do that we set the `rootElement` in
`config/environment.js`.

```javascript
// in /config/environment.js

module.exports = function(environment) {
  var ENV = {
    // ... other config

    // Note that we have locationType set to something other than 'none'
    locationType: 'auto',

    APP: {
      rootElement: '#ember-application'
    }

    // ... more config
  }
}
```

Normally Ember will find and attach itself to the `body` element of the page. This
configuration will let us pick where it renders.

Let's say that your server-rendered application has a `/dashboard` page where
you would like to introduce some ember components with Ember Islands.

Your sever-rendered HTML might look like this:

```html
<header>Header</header>

<div id="ember-application">

  <h2>Soak Up These Metrics</h2>

  <!-- The sign-ups-per-day component will be rendered here. -->
  <div data-component="sign-ups-per-day"></div>

  <div class="my-server-rendered-chart">Server Rendered Pie Chart</div>

  <!-- The net-promoter-score component will be rendered here. -->
  <div data-component="net-promoter-score"></div>

</div>

<footer>Footer</footer>
```

Notice that your island components must be placed inside of the Ember
Application container. Otherwise they will not receive clicks or other mouse
events.

Your matching `dashboard.hbs` template will render the `ember-islands` component
which will inject the `sign-ups-per-day` and `net-promoter-score` components
into your static content.

```handlebars
{{! inside of app/templates/dashboard.hbs}}
{{ember-islands}}
```

Now let's say that you have another page (`/invoices`) where you would like to
render an Ember App using the normal routing workflow without Ember Islands.

In this case your server-rendered HTML could look like this:

```html
<header>Header</header>

<h2>Get Paid</h2>

<!-- Your Ember app will be rendered here. -->
<div id="ember-application"></div>

<footer>Footer</footer>
```

In the `app/templates/invoices.hbs` template you can render HTML and components
in the typical Ember way:

```handlebars
{{! inside of app/templates/invoices.hbs}}
<h1>All The Invoices</h1>
{{invoice-list invoices=model}}
```

The routing file to support this setup would look like this:

```javascript
Router.map(function() {
  this.route('dashboard');
  this.route('invoices');
});
```

## Reconciling Ember Island Components with DOM Changes

If you find yourself in the unfortunate situation where you need to
manipulate your DOM with non-Ember JavaScript _and_ keep your components in
sync with those changes, Ember Islands still has your back.

Inside of your app.js file (or any imported file for that matter) expose the
`reconcile` function:

```js
import { reconcile } from 'ember-islands';
window.reconcileEmberIslandComponents = reconcile;
```

The `reconcile` function supports the following cases:
1. When encountering a new placeholder element, `reconcile` will render a new
   component.
1. When a previously used placeholder element has been removed, `reconcile`
   will tear down the previously rendered component.
1. When the `data-attrs` property on a placeholder element has been changed,
   `reconcile` will update the previously rendered component with the new
   attrs.
1. When the `data-component` property on a placeholder changes, `reconcile`
   will tear down the previously rendered component and render a new
   component according to the new `data-component` name.

:warning: Some versions of Ember before 2.15 retain top-level components
in memory after they are destroyed. Depending on your setup this may not
be an issue. But if you have a long-running app where users don't refresh
the page, you may want to consider other alternatives like calling the
[`reset`](https://www.emberjs.com/api/ember/2.15/classes/Ember.Application/methods/reset?anchor=reset)
method on your Ember application.

## Integration Concerns

To get started, add your `vendor.js` and `<application-name>.js` files into your
server-rendered page where you want to use Ember Islands. You can use the
`app/index.html` file from your Ember CLI project as a guide.

### Escaping JSON for the data-attrs Attribute

You may find yourself passing JSON that contains quotes or other characters that
aren't valid inside of HTML attributes.

```html
<div data-component="my-age" data-attrs="{"data": "I'm < 100 years old"}"></div>
```

Escape HTML characters in JSON data before adding it to your markup. For
instance in Ruby:

```ruby
CGI::escapeHTML %({"data": "I\'m < 100 years old"})
# => "{&quot;data&quot;: &quot;I&#39;m &lt; 100 years old&quot;}"
```

```html
<div data-component="my-age" data-attrs="{&quot;data&quot;: &quot;I&#39;m &lt; 100 years old&quot;}"></div>
```

Inside of your component, this string will be unescaped:

```javascript
// inside of app/components/my-age.js

import Ember from 'ember';
const { Component } = Ember;

export default Component.extend({
  init() {
    this._super(...arguments);
    console.log(this.get('data'));
    // '{"data": "I'm < 100 years old"}'
  }
})
```

Your server-side language or framework will have some means to escape a string
for HTML. Rails has the `h` template helper and the next example shows a
helper that will produce HTML-escaped JSON.

### Example Rails Usage with Helper

Inside of your Rails view files you can render a component using HTML data
attributes.

```html+erb
<div data-component="my-component" data-attrs="<%= {
  title: @post.title,
  body: @post.body
}.to_json %>"></div>
```

If you're doing this often you'll want to create a view helper.

```ruby
module EmberComponentHelper
  def ember_component(name, attrs = {})
    content_tag(:div, '', data: { component: name, attrs: attrs.to_json })
  end
end
```

Then you can use that helper in your view files.

```html+erb
<%= ember_component 'my-component', title: @post.title, body: @post.body %>
```

### Storing Config Data

By default Ember CLI stores configuration from `config/environment.js` in a
`meta` tag. It will be more useful to have Ember CLI to build the config object
into your compiled JavaScript files.

```javascript
// Inside of ember-cli-build.js
var app = new EmberApp({
  storeConfigInMeta: false
});
```

### Fingerprinting

Ember CLI will fingerprint your files for you by default when you `build` your
application. This will work well with many deployment strategies and with
[ember-cli-deploy](https://github.com/ember-cli/ember-cli-deploy). When you
deploy your Ember code, you can update your server application to use the
new version of `vendor.js` and `my-application.js`.

You might find it convenient to let your server application fingerprint these
files instead. For instance if you're using Rails you can prevent Ember CLI from
fingerprinting your files, build your Ember application assets into your Rails
`assets/`, path and let Rails do its own fingerprinting during its `rake
assets:precompile` task. For this to work, you'll want to turn off Ember CLI's
fingerprinting.

```javascript
// Inside of ember-cli-build.js
var app = new EmberApp({
  fingerprint: {
    enabled: false
  }
});
```

Another option for Rails is to let Ember CLI continue to fingerprint your files
but also have it generate a `manifest-md5hash.json` file for Sprockets to
consume.

```javascript
// Inside of ember-cli-build.js
var app = new EmberApp({
  fingerprint: {
    generateRailsManifest: true
  }
});
```

### Conflicting JavaScript Libraries

If you are using libraries that rely on global variables to work (e.g. jQuery,
underscore, moment) you may run into conflicts with JavaScript libraries that
are loaded in your server-rendered application.

In your `ember-cli-build.js` file you can tell Ember CLI to exclude jQuery from
the build in certain environments

```javascript
// Inside of ember-cli-build
var vendorFiles = {};

if (EmberApp.env() !== 'test') {
  vendorFiles['jquery.js'] = null;
}

var app = new EmberApp({
  vendorFiles: vendorFiles,
});
```

You may only want to only include duplicated dependencies in your testing
environment.

```javascript
app.import({
  test: 'bower_components/underscore/underscore.js'
});
```

## Other Resources

[Discussing the need for Ember Islands at Global Ember Meetup](https://vimeo.com/152241622)
