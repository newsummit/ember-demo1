export default function() {

  this.get('/companies', (schema) => {
    return schema.companies.all();
  });

  this.get('/jobs', (schema) => {
    return schema.jobs.all();
  });

  this.get('/jobs/:id', ({ jobs }, request) => {
    return jobs.find(request.params.id);
  });

  this.post('/jobs', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.views = 0;
    const company = schema.companies.find(attrs.companyId);
    const { id } = schema.jobs.create(attrs, { company });
    return schema.jobs.find(id);
  });
}
