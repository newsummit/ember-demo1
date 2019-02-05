import Component from '@ember/component';

export default Component.extend({
  title: null,
  description: null,
  salary: null,
  company: null,

  actions: {
    addJob() {
      // You can uncomment this if you want to use it as a starting point
      // const props = this.getProperties(['title', 'description', 'salary', 'company']);
    }
  }

});
