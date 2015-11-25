import { moduleForComponent, test } from 'ember-qunit';
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

test("Provides usefull error message when a component can't be found", function(assert) {
  document.getElementById('ember-testing').innerHTML = `
    <div data-component="unknown-component"></div>
  `;

  assert.throws(() => {
    this.render(hbs`
      {{ember-islands}}
    `);
  }, /could not find a component/, "Threw the correct error message");
});
