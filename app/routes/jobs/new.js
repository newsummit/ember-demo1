import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.modelFor('application');
  },

  setupController(controller, model) {
    controller.set('jobs', model.jobs);
    controller.set('companies', model.companies);
  },

  resetController(controller) {
    controller.setProperties({
      title: null,
      description: null,
      salary: null,
      company: null
    });
  }
});
