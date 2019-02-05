import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('job', params.id).catch(() => {
      this.transitionTo('/');
    });
  },

  setupController(controller, model) {
    controller.set('job', model);
  }
});
