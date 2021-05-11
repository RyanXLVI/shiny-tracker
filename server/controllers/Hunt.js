const models = require('../models');

const { Hunt } = models;

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
  console.log(req.body);

  const huntData = {
    pokemon: req.body.pokemon,
    method: req.body.method,
    encounters: req.body.encounters,
    generation: req.body.generation,
    owner: req.session.account._id,
    finished: false,
  };

  console.log(huntData);

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
