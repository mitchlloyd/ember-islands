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

Add a placeholder for an Ember Component inside your HTML.

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
`innerContent` is unescaped HTML that you should should call `safeString()` on
before rendering.

Finally render the `{{ember-islands}}` component in your `application.hbs` file.

```handlebars
{{! inside of app/templates/application.hbs}}

{{ember-islands}}
```

## Example Usage in Rails

Add your `vendor.js` and `<application-name>.js` files into your server-rendered
page where you want to use Ember Islands. You can use the `app/index.html` file
from your Ember CLI project as a guide.

If you're going to use the `config/environment.js` file from Ember CLI, you need
to tell Ember CLI to build the config object into your compiled JavaScript files
rather than the `meta` tag in `index.html`.

```javascript
// Inside of ember-cli-build.js
var app = new EmberApp({
  storeConfigInMeta: false
});
```

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
