const mongoose = require('mongoose');
const _ = require('underscore');

let HuntModel = {};

const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const HuntSchema = new mongoose.Schema({
  pokemon: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  method: {
    type: String,
    required: true,
    trim: true,
  },
  encounters: {
    type: Number,
    required: true,
    min: 1,
  },
  generation: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  finished: {
    type: Boolean,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  startedDate: {
    type: Date,
    deafult: Date.now,
  },
});

HuntSchema.statics.toAPI = (doc) => ({
  pokemon: doc.pokemon,
  method: doc.method,
  encounters: doc.encounters,
  generation: doc.generation,
  finished: doc.finished,
});

HuntSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
    finished: false,
  };

  return HuntModel.find(search).select('pokemon method encounters generation finished startedDate').lean().exec(callback);
};

HuntSchema.statics.updatePokemon = (ownerId, pokemon, callback) => {
  const search = {
    owner: convertID(ownerId),
    pokemon,
    finished: false,
  };

  return HuntModel.findOneAndUpdate(search, { finished: true }, callback).select('pokemon method encounters generation finished owner startedDate').lean();
};

HuntModel = mongoose.model('Hunt', HuntSchema);

module.exports.HuntModel = HuntModel;
module.exports.HuntSchema = HuntSchema;
