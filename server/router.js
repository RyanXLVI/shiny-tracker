const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getHunts', mid.requiresLogin, controllers.Hunt.getHunts);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/tracker', mid.requiresLogin, controllers.Hunt.trackerPage);
  app.post('/tracker', mid.requiresLogin, controllers.Hunt.track);
  app.post('/finish', mid.requiresLogin, controllers.Hunt.finish);
  app.get('/account', mid.requiresLogin, controllers.Account.account);
  app.post('/account', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
