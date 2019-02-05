export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.4.x/shorthands/
  */

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
