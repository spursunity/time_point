import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export default Users = new Mongo.Collection('users');


Meteor.methods({
  'users.createAccount'(username, password) {
    check(username, String);
    check(password, String);

    const errors = checkNewUserData(username, password);

    if (errors.exist) {
      return errors;
    }

    const tokenData = createToken();
    const userData = { username, password, ...tokenData, };

    Users.insert(userData);
  },
  'users.logout'(username) {
    check(username, String);

    Users.update({ username }, { $set: { token: null, expiration: null } });
  },
  'users.isLogged'(username) {
    check(username, String);

    const tokenData = Users.findOne({ username }, { token: 1, expiration: 1 });
    const { token, expiration } = tokenData;
    const now = +(new Date());

    if (!expiration || expiration <= now) {
      Users.update({ username }, { $set: { token: null, expiration: null } });
      return false;
    }

    return token !== null;
  },
  'users.signin'(username, password) {
    const tokenData = createToken();

    return Users.update({ username, password }, { $set: tokenData });
  },
});

function createToken() {
  const now = +(new Date());
  const day = 86400000;
  const expiration = `${now + day}`;

  const token = require('crypto').randomBytes(24).toString('hex');

  return { token, expiration, };
}

function checkNewUserData(username, password) {
  const errors = { exist: false };

  if (!! Users.findOne({ username })) {
    errors.username = 'That name is already occupied';
    errors.exist = true;
  } else if (username === '') {
    errors.username = 'Fill out this field';
    errors.exist = true;
  }

  if (password.length < 6) {
    errors.password = 'Minimal 6 symbols';
    errors.exist = true;
  }

  return errors;
}
