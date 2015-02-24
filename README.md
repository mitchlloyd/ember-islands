# ember-islands

Render Ember components UJS-style to achieve "Islands of Richness". You can
arbitrarily render Ember components anywhere on the page and all of them will be
connected to the same Ember app.

## Installation

This addon should be installed inside of an ember-cli project.

```
ember install ember-islands
```

## Usage

```html
<div data-component='my-component' data-attr='{"title": "Component Title"}'></div>
```

```handlebars
{{! inside of app/templates/components/my-component}}

{{title}}

My humble component
```

## Example Usage in Rails

If you're using this addon within the context of a Rails app you'll probably
want to:

1. Get familiar with the
   [ember-cli-rails](https://github.com/rwz/ember-cli-rails) gem. This will help
   you integrate ember-cli with your Rails application.

2. Delete your `app/templates/application.hbs` file so that nothing is rendered
   when Ember loads.

Make sure that you've included your ember-cli application on a given page either
using the helper from ember-cli-rails or by including it yourself.

Then inside of your Rails view files you can render a component using HTML data
attributes.

```html+erb
<div data-component="my-component" data-attr"<%= {
  title: @post.title,
  body: @post.body
}.to_json %>"></div>
```

Another option is to create a Rails helper.

```ruby
module EmberComponentHelper
  def ember_component(name, attrs = {})
    content_tag(:div, '', data: { component: name, attrs: attrs.to_json })
  end
end
```

And then use that inside of your view files instead.

```html+erb
<%= ember_component 'my-component', title: @post.title, body: @post.body %>
```

## Why?

Ember Islands is a reference to the "Islands of Richness" pattern where the
majority of a web page is rendered by the server but certain portions of the
page (e.g. "widgets") are dynamic and need to use JavaScript.

Often when you start building an app you'll say to yourself "This is just a
simple Blog/Auction Site/E-Commerce app. I would never want to use a JavaScript
framework for this." One week later you're trying to figure out which
incantation of micro-libraries, design patterns, and build tooling might help you
refactor your jQuery soup.

This addon is for those times when you can't convince yourself or someone else
to create an Ember app from the start of when you're trying to introduce Ember
into an existing server-rendered application. You can start with components and
later back into features like the Router if you'd like.
