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
    controller.set('companiesWithJobs', model.companies.map(company => {
      const numJobs = company.get('jobs').length;
      return {
        id: company.id,
        name: `${company.name} (${numJobs})`,
        numJobs
      }
    }))
  }
});
