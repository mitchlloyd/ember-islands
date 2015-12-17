# ember-islands

[ ![Codeship Status for mitchlloyd/ember-islands](https://codeship.com/projects/0de87f00-c59f-0132-5306-3a52b81c571d/status?branch=master)](https://codeship.com/projects/74441)

Render Ember components into existing HTML.

This addon provides a practical way to introduce Ember into a server-rendered
application. It can facilitate a gradual redesign from a server-rendered
application to a client-rendered application.

## Installation

This addon should be installed inside of an Ember CLI project.

```
ember install ember-islands
```

## Usage

Add a placeholder for an Ember Component inside your server-rendered HTML.

```html
<div data-component='my-component' data-attrs='{"title": "Component Title"}'>
  <p>Some optional innerContent</p>
</div>
```

Next define a component for that placeholder.

```handlebars
{{! inside of app/templates/components/my-component}}

{{title}}

{{{innerContent}}}
```

Ember Islands parses the JSON data that you pass in the `data-attrs` attribute
and sends it to the component as attributes. Any content within your tag
(`innerHTML`) is passed as the `innerContent` attribute. Keep in mind that
`innerContent` is HTML that will be escaped if you don't call `htmlSafe()` on
it before rendering.

If you want to render island components on any server-rendered page that users
visit you can add the following code to your `app/router.js` file.

```javascript
Router.map(function() {
  this.route('ember-islands', {path: '/'});
  this.route('ember-islands', {path: '/*glob'});
});
```

More advanced uses are described in [Rendering Ember Islands Based on URL Paths](#rendering-ember-islands-based-on-url-paths).


## Rendering Ember Islands Based on URL paths

If you're exclusively using this library to render Ember components you can
direct all paths to the `ember-islands` template included in this addon.

```javascript
Router.map(function() {
  this.route('ember-islands', {path: '/'});
  this.route('ember-islands', {path: '/*glob'});
});
```

However, you can also use Ember's routing and the `{{ember-islands}}` component
to choose when to render island components. Let's look at an example of using a
combination of island components and `rootElement` configuration to handle
different cases.

It's useful to control where your Ember Application is rendered so that we
could, for instance, maintain a consistent header and footer across the
server-rendered application. To do that we set the `rootElement` in
`config/environment.js`.

```javascript
// in config/environment.js

module.exports = function(environment) {
  var ENV = {
    // ... other config

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

  <h2>Soak Up These Metrics:</h2>

  <!-- The sign-ups-per-day component will be rendered here. -->
  <div data-component="sign-ups-per-day"></div>

  <div class="my-server-rendered-chart">Server Rendered Pie Chart</div>

  <!-- The net-promoter-score component will be rendered here. -->
  <div data-component="net-promoter-score"></div>

</div>

<footer>Footer</footer>
```

Notice that your island components must be placed inside of the Ember
Application container. Otherwise they will not receive clicks and other mouse
events.

Your matching `dashboard.hbs` template would render the `ember-islands` component.

```handlebars
{{! inside of app/templates/dashboard.hbs}}
{{ember-islands}}
```

Now let's say that you have another page (`/invoices`) where you would like to
render an Ember App using the normal routing workflow without Ember Islands.

In this case your server-rendered HTML could look like this:

```html
<header>Header</header>

<!-- Your Ember app will be rendered here. -->
<div id="ember-application"></div>

<footer>Footer</footer>
```

And then the `app/templates/invoices.hbs` template in your Ember application
would render HTML and components in the typical Ember way:

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

## Integration Concerns

To get started, add your `vendor.js` and `<application-name>.js` files into your
server-rendered page where you want to use Ember Islands. You can use the
`app/index.html` file from your Ember CLI project as a guide.

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
if (EmberApp.env() !== ‘test’) {
  vendorFiles[‘jquery.js’] = false;
}
```

You may only want to only include duplicated dependencies in your testing
environment.

```javascript
app.import({
  test: 'bower_components/underscore/underscore.js'
});
```
