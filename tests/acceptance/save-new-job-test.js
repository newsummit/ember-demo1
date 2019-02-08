import { module, test } from 'qunit';
import {
  visit,
  fillIn,
  click,
  find,
  currentURL,
  currentRouteName
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose } from 'ember-power-select/test-support';

const page = {
  selectors: {
    titleInput: '[data-test-newjob-title]',
    descriptionInput: '[data-test-newjob-description]',
    salaryInput: '[data-test-newjob-salary]',
    companyInput: '#select-company',
    submitButton: '[data-test-newjob-submit]'
  }
};

module('Acceptance | create new job', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks); // creates test server.db

  test('renders `new job` template', async function(assert) {
    await visit('/jobs/create');

    assert.equal(currentURL(), '/jobs/create');
    assert.equal(currentRouteName(), 'jobs.new');
  });

  test('Create new job button is disabled until all fields filled', async function(assert) {
    this.server.createList('company', 10);
    const numJobs = this.server.db.jobs.length;
    const randomCompanyName = this.server.db.companies[0].name;
    await visit('/jobs/create');

    // Confirm button is initially disabled
    assert.dom(find(page.selectors.submitButton)).hasText('Create');
    assert.dom(find(page.selectors.submitButton)).isDisabled();

    // Fill all fields, confirm button is enabled
    await fillIn(page.selectors.titleInput, 'Senior Software Engineer');
    await fillIn(page.selectors.descriptionInput, 'Create Ember apps all day long.');
    await fillIn(page.selectors.salaryInput, '200000');
    await selectChoose(page.selectors.companyInput, randomCompanyName);
    assert.dom(find(page.selectors.submitButton)).isNotDisabled();

    // Click submit, confirm one more job was added to store
    await click(find(page.selectors.submitButton));
    assert.equal(
      this.server.db.jobs.length,
      numJobs + 1,
      'Expected total number of jobs to increase by 1'
    );
  });
});
