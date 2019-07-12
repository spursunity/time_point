import { Users } from '../users';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
const drupalHash = require('drupal-hash');
const jwt = require('jsonwebtoken');

import config from '../../../config.js';

export default class SignHelper {
  constructor() {
    this.eMessages = config.errorMessages;
  }

  async signIn (username, password) {
    try {
      check(username, String);
      check(password, String);

      const userData = await Users.findOne({ username });

      if (! userData) return { password: this.eMessages.WRONG_USERNAME_PASSWORD };
      const { password: hashedPassword, ...sessionData } = userData;
      const passwordComparison = drupalHash.checkPassword(password, hashedPassword);

      if (! passwordComparison) return { password: this.eMessages.WRONG_USERNAME_PASSWORD };

      return sessionData;
    } catch (err) {
      console.log('SignHelper - signIn - ', err);
    }
  }

  async signUp (username, password) {
    try {
      check(username, String);
      check(password, String);

      const errors = await this.checkNewUserData(username, password);

      if (errors) return errors;

      const hashedPassword = drupalHash.hashPassword(password);
      const userData = { username, password: hashedPassword };

      const uid = await Users.insert(userData);
      return { _id: uid, username };
    } catch (err) {
      console.log('SignHelper - signUp - ', err);
    }
  }

  createToken (userData) {
    try {
      return jwt.sign(userData, 'jwt-key');
    } catch (err) {
      console.log('SignHelper - createToken - ', err);
    }
  }

  async checkNewUserData(username, password) {
    try {
      const errors = {};

      if (!! await Users.findOne({ username })) {
        errors.username = this.eMessages.OCCUPIED_NAME;
      } else if (username === '') {
        errors.username = this.eMessages.EMPTY_USERNAME;
      }

      if (password.length < 6) {
        errors.password = this.eMessages.SHORT_PASSWORD;
      }

      if (errors.username || errors.password) return errors;
    } catch (err) {
      console.log('SignHelper - checkNewUserData - ', err);
    }
  }

}
