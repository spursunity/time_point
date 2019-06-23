import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export default Users = new Mongo.Collection('users');

const crypto = require('crypto');

Meteor.methods({
  'users.createAccount'(username, password) {
    check(username, String);
    check(password, String);

    const now = +(new Date());
    const day = 86400000;
    const expiration = `${now + day}`;
    
    let token;
    crypto.randomBytes(48, function(err, buffer) {
      token = buffer.toString('hex');
    });

    Users.insert({
      username,
      password,
      token,
      expiration,
    });
  },
});
