const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login');
};

const accountPage = (req, res) => {
  res.render('account');
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/tracker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'You need to enter all fields to make an account!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Your passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      premium: false,
    };

    const newAccount = new Account.AccountModel(accountData);

    newAccount.save().then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/tracker' });
    }).catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;
  let username = '';

  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'You need to enter all fields to change password!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Your passwords do not match!' });
  }

  return Account.AccountModel.findUsername(req.session.account._id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    username = doc[0].username;

    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      const accountData = {
        username,
        salt,
        password: hash,
      };

      Account.AccountModel.updatePassword(username, accountData, (errr) => {
        if (errr) {
          console.log(errr);
          return res.status(400).json({ error: 'An error occurred' });
        }

        return res.json({ redirect: '/account' });
      });
    });
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.account = accountPage;
module.exports.changePassword = changePassword;
