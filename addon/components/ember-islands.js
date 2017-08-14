import Ember from 'ember';
import Reconciler from 'ember-islands/utils/reconciler';
import queryIslandComponents from 'ember-islands/utils/query-island-components';
import getRenderComponent from 'ember-islands/utils/get-render-component';

let eiInstance;

export default Ember.Component.extend({
  tagName: '',

  init() {
    this._super(...arguments);

    let renderComponent = getRenderComponent(this);
    this.reconciler = new Reconciler({
      initialRender(c) {
        return renderComponent(c);
      },

      update(c) {
        delete c.attrs.innerContent;
        c.instance.setProperties(c.attrs);
      },

      destroy(c) {
        c.destroy();
      }
    });

    eiInstance = this;
  },

  reconcile() {
    this.reconciler.reconcileAgainst(queryIslandComponents());
  },

  getRenderedComponents() {
    return this.reconciler.renderedComponentsAsArray();
  },

  didInsertElement() {
    this.reconcile();
  },

  willDestroyElement() {
    this.reconciler.forEachRenderedComponent(c => c.destroy());
  }
});

export function getInstance() {
  return eiInstance;
}
