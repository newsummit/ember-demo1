import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('jobs', function() {
    this.route('show', { path: ':id' });
    this.route('new', { path: 'create' });
  });

  this.route('chart');
});

export default Router;
