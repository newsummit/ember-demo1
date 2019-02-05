import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  title: attr('string'),
  description: attr('string'),
  salary: attr('number'),
  views: attr('number'),
  company: belongsTo('company')
});
