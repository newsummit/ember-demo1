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
  isSubmitDisabled: computed(
    'title',
    'salary',
    'description',
    'company',
    function() {
      const { title, salary, description, company } = this;
      const requiredFieldValues = [title, salary, description, company];
      return requiredFieldValues.some(field => isEmpty(field));
    }
  ),

  actions: {

    addJob() {
      const props = getProperties(this, 'title', 'description', 'salary', 'company');
      // Trigger the action passed to this component
      this.onSubmitJob(props);
    }
  }

});
