import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name() {
    return faker.company.companyName();
  },

  afterCreate(company, server) {
    server.createList('job', Math.floor(Math.random() * 5), { companyId: company.id });
  }
});
