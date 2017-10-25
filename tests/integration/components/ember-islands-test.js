import $ from 'jquery';
import Ember from 'ember';
const { Component } = Ember;
import { moduleForComponent, test, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-islands', 'Integration | Component | ember islands', {
  integration: true
});

test('it renders an island component', function(assert) {
  document.getElementById('ember-testing').innerHTML = `
    <div data-component="top-level-component"></div>
  `;

  this.render(hbs`
    {{ember-islands}}
  `);

  assert.equal($('.top-level-component').length, 1);
});

test("rendering a component that only has an hbs template file", function(assert) {
  document.getElementById('ember-testing').innerHTML = `
    <div data-component="hbs-only-component"></div>
  `;

  this.render(hbs`
    {{ember-islands}}
  `);

  assert.equal($('.hbs-only-component').length, 1);
});

test("rendering a component that only has a JavaScript file", function(assert) {
  document.getElementById('ember-testing').innerHTML = `
    <div data-component="js-only-component"></div>
  `;

  this.render(hbs`
    {{ember-islands}}
  `);

  assert.equal($('.js-only-component').length, 1);
});

test('it tears down an island component', function(assert) {
  let teardownCalls = [];

  const IslandComponent = Component.extend({
    classNames: ['island-component'],

    willDestroyElement() {
      teardownCalls.push('willDestroyElement');
    },

    willDestroy() {
      teardownCalls.push('willDestroy');
    }
  });

  this.register('component:island-component', IslandComponent);

  document.getElementById('ember-testing').innerHTML = `
    <div data-component="island-component"></div>
  `;

  this.set('isShowing', true);

  this.render(hbs`
    {{#if isShowing}}
      {{ember-islands}}
    {{/if}}
  `);

  assert.equal($('.island-component').length, 1, "Has component in DOM");

  this.set('isShowing', false);

  assert.equal($('.island-compoment').length, 0, "Component removed from DOM");

  assert.deepEqual(teardownCalls, ['willDestroyElement', 'willDestroy'], "All component teardown hooks called");
});

// Related issue: https://github.com/emberjs/ember.js/issues/15013
skip("Provides usefull error message when a component can't be found", function(assert) {
  document.getElementById('ember-testing').innerHTML = `
    <div data-component="unknown-component"></div>
  `;

  assert.throws(() => {
    this.render(hbs`
      {{ember-islands}}
    `);
  }, /could not find a component/, "Threw the correct error message");
});
