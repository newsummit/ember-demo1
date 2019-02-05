import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  model() {
    return hash({
      companies: this.store.findAll('company'),
      jobs: this.store.findAll('job')
    });
  },

  setupController(controller, model) {
    controller.set('jobs', model.jobs);
    controller.set('companies', model.companies);
  }
});
