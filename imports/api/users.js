import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export default Users = new Mongo.Collection('users');


Meteor.methods({
  'users.createAccount'(username, password) {
    check(username, String);
    check(password, String);

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

    return token !==null && expiration > now;
  }
});

function createToken() {
  const now = +(new Date());
  const day = 86400000;
  const expiration = `${now + day}`;

  const token = require('crypto').randomBytes(24).toString('hex');

  return { token, expiration, };
}
