import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.modelFor('application');
  },

  setupController(controller, model) {
    controller.set('jobs', model.jobs);
  }
});
