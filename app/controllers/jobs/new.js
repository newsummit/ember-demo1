import Controller from '@ember/controller';
import { task } from 'ember-concurrency';

export default Controller.extend({
  saveRecordTask: task(function *(job) {
    const record = this.store.createRecord('job', job);
    return yield record.save();
  }),

  actions: {
    addJob(job) {
      const record = this.saveRecordTask.perform(job);
      this.transitionToRoute('jobs.show', record);
    }
  }
});
