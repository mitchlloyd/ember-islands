import $ from 'jquery';
import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import {
  pleaseDontUseThisExportToGetTheEmberIslandsInstance as getInstance,
  reconcile
} from 'ember-islands';
const { run } = Ember;

moduleForComponent('ember-islands', 'Integration | Component | rerendering', {
  integration: true,

  beforeEach() {
    this.testContainer = $('<div id="container"></div>');
    $('#ember-testing').append(this.testContainer);
  }
});

test('when the DOM does not change', function(assert) {
  this.testContainer.html(`
    <div data-component="stateful-component"
         data-attrs='{"title": "Title"}'>
      Inner Content
    </div>
  `);

  this.render(hbs`
    {{ember-islands}}
  `);

  // Click the component to increment its count to 1
  this.testContainer.find('button').click();

  let componentElement = this.testContainer.find('button');

  assert.equal(
    componentElement.text().trim(),
    'Title, Inner Content, 1',
    'Precondition: Rendered inside the stable element'
  );

  assert.equal(
    getInstance().getRenderedComponents().length,
    1,
    'Precondition: tracking 1 rendered component'
  );

  reconcile();

  assert.equal(
    componentElement.text().trim(),
    'Title, Inner Content, 1',
    'Rendered content and state does not change'
  );

  assert.strictEqual(
    this.testContainer.find('button')[0],
    componentElement[0],
    'The component element stays stable'
  );

  assert.equal(
    getInstance().getRenderedComponents().length,
    1,
    'still tracking 1 rendered component'
  );
});

test('when a placeholder is removed', function(assert) {
  this.testContainer.html(`
    <div data-component="stateful-component"
         data-attrs='{"title": "Title"}'>
      Inner Content
    </div>
  `);

  this.render(hbs`
    {{ember-islands}}
  `);

  assert.equal(
    this.testContainer.text().trim(),
    'Title, Inner Content, 0',
    'Precondition: Rendered'
  );

  assert.equal(
    getInstance().getRenderedComponents().length,
    1,
    'Precondition: tracking 1 rendered component'
  );

  let renderedComponent = getInstance().getRenderedComponents()[0];

  this.testContainer.html(`
    <div>
      All new DOM!
    </div>
  `);

  run(() => {
    reconcile();
  });

  return wait().then(function() {
    assert.equal(
      renderedComponent.isDestroying,
      true,
      'The previously rendered component has been destroyed'
    );

    assert.notEqual(
      renderedComponent.destroyCallCount,
      0,
      'destroy called at least once'
    );

    assert.equal(
      getInstance().getRenderedComponents().length,
      0,
      'tracking no rendered components'
    );
  });
});

test('when a new component placeholder is added', function(assert) {
  this.render(hbs`
    {{ember-islands}}
  `);

  assert.equal(this.testContainer.text().trim(), '', 'Precondition: Nothing rendered');

  assert.equal(
    getInstance().getRenderedComponents().length,
    0,
    'Precondition: tracking 0 rendered components'
  );

  this.testContainer.html(`
    <div data-component="stateful-component"
        data-attrs='{"title": "Title"}'>
      Inner Content
    </div>
  `);

  run(() => {
    reconcile();
  });

  assert.equal(
    this.testContainer.text().trim(),
    'Title, Inner Content, 0',
    'Renders a component for the added placeholder'
  );

  assert.equal(
    getInstance().getRenderedComponents().length,
    1,
    'started tracking 1 component'
  );
});

test('when attributes of a placeholder change', function(assert) {
  this.testContainer.html(`
    <div data-component="stateful-component"
         data-attrs='{"title": "Title"}'>
      Inner Content
    </div>
  `);

  this.render(hbs`
    {{ember-islands}}
  `);

  let componentElement = this.testContainer.find('button');

  // Click the component to increment its count to 1
  this.testContainer.find('button').click();

  assert.equal(
    componentElement.text().trim(),
    'Title, Inner Content, 1',
    'Precondition: Rendered inside the stable element'
  );

  this.testContainer
    .find('[data-component=stateful-component]')
    .attr('data-attrs', '{"title": "New Title"}');

  run(() => {
    reconcile();
  });

  assert.equal(
    componentElement.text().trim(),
    'New Title, Inner Content, 1',
    'Attributes are updated and state is stable'
  );
});

test('when the data-component property of a placeholder changes', function(assert) {
  this.testContainer.html(`
    <div data-component="stateful-component"
         data-attrs='{"title": "Title"}'>
      Inner Content
    </div>
  `);

  this.render(hbs`
    {{ember-islands}}
  `);

  let componentElement = this.testContainer.find('button');

  assert.equal(
    componentElement.text().trim(),
    'Title, Inner Content, 0',
    'Precondition: Rendered initial component'
  );

  assert.equal(
    getInstance().getRenderedComponents().length,
    1,
    'Precondition: tracking 1 rendered component'
  );

  this.testContainer
    .find('[data-component=stateful-component]')
    .attr('data-component', 'top-level-component');

  let previouslyRenderedComponent = getInstance().getRenderedComponents()[0];

  run(() => {
    reconcile();
  });

  assert.equal(
    previouslyRenderedComponent.isDestroying,
    true,
    'previously rendered component has been destroyed'
  );

  assert.notEqual(
    previouslyRenderedComponent.destroyCallCount,
    0,
    'previously rendered component destroy called at least once'
  );

  assert.notEqual(
    this.testContainer.text().indexOf('top level component'),
    -1,
    'Renders the new component in the placeholder'
  );

  assert.equal(
    getInstance().getRenderedComponents().length,
    1,
    'tracking 1 new rendered component'
  );
});
