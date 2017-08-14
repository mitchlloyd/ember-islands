import Ember from 'ember';
const { $ } = Ember;

/**
 * @typedef {object} IslandComponent
 * @property {object} element - The placeholder element for this component
 * @property {object} attrs - Attrs to for an Ember Component
 * @property {string} name - Name of a registered Ember component
 * @property {object} instance - Ember component instance
 */

/**
 * @return {IslandComponent[]}
 */
export default function queryIslandComponents() {
  let components = [];

  $('[data-component]').each(function() {
    let name = this.getAttribute('data-component');
    let attrs = componentAttributes(this);
    components.push({ attrs, name, element: this, instance: undefined });
  });

  return components;
}

function componentAttributes(element) {
  let attrs;
  let attrsJSON = element.getAttribute('data-attrs');

  if (attrsJSON) {
    attrs = JSON.parse(attrsJSON);
  } else {
    attrs = {};
  }

  attrs.innerContent = element.innerHTML;
  return attrs;
}
