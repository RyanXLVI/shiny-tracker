const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
    res.render('login');
};

module.exports.loginPage = loginPage;