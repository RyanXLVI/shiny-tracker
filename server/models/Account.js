const crypto = require('crypto');
const mongoose = require('mongoose');

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const convertID = mongoose.Types.ObjectId;

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  premium: {
    type: Boolean,
    required: true,
  },
});

AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

AccountSchema.statics.authenticate = (username, password, callback) => {
  AccountModel.findByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });
};

AccountSchema.statics.findUsername = (id, callback) => {
  const search = {
    _id: convertID(id),
  };

  return AccountModel.find(search).select('username').lean().exec(callback);
};

AccountSchema.statics.updatePassword = (username, data, callback) => {
  const search = {
    username,
  };

  return AccountModel.findOneAndUpdate(search, data, callback);
};

AccountSchema.statics.updatePremium = (username, callback) => {
  const search = {
    username,
  };

  return AccountModel.findOneAndUpdate(search, { premium: true }, callback);
};

AccountSchema.statics.checkPremium = (username, callback) => {
  const search = {
    username,
  };

  return AccountModel.findOne(search, callback).select('premium').lean().exec(callback);
};

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
