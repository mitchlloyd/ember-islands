import { getInstance } from './components/ember-islands';

export function reconcile() {
  getInstance().reconcile();
}

export { getInstance as pleaseDontUseThisExportToGetTheEmberIslandsInstance };
