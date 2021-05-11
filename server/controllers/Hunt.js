const models = require('../models');

const { Hunt } = models;
let hunts = 0;
let premium = false;

const isPremium = (req, res) => models.Account.AccountModel.findUsername(req.session.account._id,
  (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    const { username } = doc[0];

    return models.Account.AccountModel.checkPremium(username, (error, docs) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ error: 'An error occurred' });
      }

      premium = docs.premium;
      // console.log(premium);
      return docs.premium;
    });
  });

const trackerPage = (req, res) => {
  Hunt.HuntModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { hunts: docs });
  });
};

const trackHunt = (req, res) => {
  if (!req.body.pokemon || !req.body.method || !req.body.encounters || !req.body.generation) {
    return res.status(400).json({ error: 'Please enter something into all fields for tracking' });
  }
  isPremium(req, res);
  console.log(premium);
  console.log(hunts);
  if ((premium && hunts >= 10) || (!premium && hunts >= 5)) {
    return res.status(400).json({ error: 'You have reached your hunts limit' });
  }

  const huntData = {
    pokemon: req.body.pokemon,
    method: req.body.method,
    encounters: req.body.encounters,
    generation: req.body.generation,
    owner: req.session.account._id,
    finished: false,
  };

  // console.log(huntData);

  const newHunt = new Hunt.HuntModel(huntData);

  const huntPromise = newHunt.save();

  huntPromise.then(() => res.json({ redirect: '/tracker' }));

  huntPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Hunt already exists or is completed' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return huntPromise;
};

const getHunts = (request, response) => {
  const req = request;
  const res = response;

  return Hunt.HuntModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    hunts = docs.length;
    return res.json({ hunts: docs });
  });
};

const finishHunt = (request, response) => {
  const req = request;
  const res = response;

  return Hunt.HuntModel.updatePokemon(req.session.account._id, req.body.pokemon, (err) => {
    console.log(req.body);
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ redirect: '/tracker' });
  });
};

module.exports.trackerPage = trackerPage;
module.exports.track = trackHunt;
module.exports.getHunts = getHunts;
module.exports.finish = finishHunt;
module.exports.isPremium = isPremium;
