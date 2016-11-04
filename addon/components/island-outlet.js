import Ember from 'ember';
import WormholeComponent from 'ember-wormhole/components/ember-wormhole';

const {
  assert,
  Component,
  computed,
  getOwner,
  guidFor
} = Ember;

const Outlet = WormholeComponent.extend({
  classNames: ['island-outlet'],
  destinationElement: computed('outletName', {
    get() {
      let name = this.get('outletName');
      assert('An outlet name is mandatory', name);
      let $element = $(`[data-outlet="${name}"]`);
      assert(`No outlet found with the name "${name}"`, $element.length !== 0);
      assert(`Multiple outlets with the name "${name}"`, $element.length === 1);
      return $element.get(0);
    }
  }).readOnly()
});

Outlet.reopenClass({
  positionalParams: ['outletName']
});

export default Outlet;
