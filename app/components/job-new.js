import Component from '@ember/component';
import { computed, getProperties } from '@ember/object';
import { isEmpty } from "@ember/utils";

export default Component.extend({
  title: null,
  description: null,
  salary: null,
  company: null,

  /**
   * @private
   * @description Watch required fields for completeness before enabling submit button.
   */
  isSubmitEnabled: computed(
    'title',
    'salary',
    'description',
    'company',
    function() {
      const { title, salary, description, company } = this;
      const requiredFieldArr = [title, salary, description, company];
      return requiredFieldArr.some(field => isEmpty(field));
    }
  ),

  actions: {
    addJob() {
      const props = getProperties(this, 'title', 'description', 'salary', 'company');
      this.onSubmitJob(props);
    }
  }

});
