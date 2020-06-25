import Component from '@ember/component';

let lifecycleEvents;

export function getFreshLifecycleCounts() {
  lifecycleEvents = {
    // Initial render hooks
    init: 0,
    didReceiveAttrs: 0,
    willRender: 0,
    didInsertElement: 0,
    didRender: 0,

    // Re-render hooks
    didUpdateAttrs: 0,
    // didReceiveAttrs - also during initial render
    willUpdate: 0,
    // willRender - also during initial render
    didUpdate: 0,
    // willRender - also during initial render

    // Destroy
    willDestroyElement: 0,
    willClearRender: 0,
    didDestroyElement: 0,
  };

  return lifecycleEvents;
}

export default Component.extend({
  classNames: ['lifecycle-recorder'],

  init() {
    this._super(...arguments);
    lifecycleEvents.init++;
  },

  didReceiveAttrs() {
    this._super(...arguments);
    lifecycleEvents.didReceiveAttrs++;
  },

  willRender() {
    this._super(...arguments);
    lifecycleEvents.willRender++;
  },

  didInsertElement() {
    this._super(...arguments);
    lifecycleEvents.didInsertElement++;
  },

  didRender() {
    this._super(...arguments);
    lifecycleEvents.didRender++;
  },

  didUpdateAttrs() {
    this._super(...arguments);
    lifecycleEvents.didUpdateAttrs++;
  },

  willUpdate() {
    this._super(...arguments);
    lifecycleEvents.willUpdate++;
  },

  didUpdate() {
    this._super(...arguments);
    lifecycleEvents.didUpdate++;
  },

  willDestroyElement() {
    this._super(...arguments);
    lifecycleEvents.willDestroyElement++;
  },

  willClearRender() {
    this._super(...arguments);
    lifecycleEvents.willClearRender++;
  },

  didDestroyElement() {
    this._super(...arguments);
    lifecycleEvents.didDestroyElement++;
  }
});
