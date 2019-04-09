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
  let islandNodeList = document.querySelectorAll('[data-component]');

  // Avoid NodeList.prototype.forEach for IE 11 compatibility.
  for (let i = 0; i < islandNodeList.length; i++) {
    let element = islandNodeList[i];
    let name = element.getAttribute('data-component');
    let attrs = componentAttributes(element);
    components.push({ attrs, name, element, instance: undefined });
  }

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
