import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  salary() {
    return Math.floor(Math.random() * 100) * 1000;
  },

  views() {
    return Math.floor(Math.random() * 50);
  },

  afterCreate(job) {
    const title = faker.name.jobTitle();
    const description = `This is a small description for the ${title.toLowerCase()}.`;

    job.update({ title, description });
  }
});
