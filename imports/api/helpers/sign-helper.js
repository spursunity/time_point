import Users from '../users';
import { check } from 'meteor/check';
const drupalHash = require('drupal-hash');
const jwt = require('jsonwebtoken');

export default class SignHelper {
  constructor() {
    this.jwtKey = 'venovat-pozornost';
  }

  async signIn (username, password) {
    try {
      check(username, String);
      check(password, String);

      const userData = await Users.findOne({ username });
      if (! userData) return { password: 'Check your Username or/and password' };
      const { password: hashedPassword, ...sessionData } = userData;

      const passwordComparison = drupalHash.checkPassword(password, hashedPassword);
      if (! passwordComparison) return { password: 'Check your Username or/and password' };

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
      return jwt.sign(userData, this.jwtKey);
    } catch (err) {
      console.log('SignHelper - createToken - ', err);
    }
  }

  async checkNewUserData(username, password) {
    try {
      const errors = {};

      if (!! await Users.findOne({ username })) {
        errors.username = 'That name is already occupied';
      } else if (username === '') {
        errors.username = 'Fill out this field';
      }

      if (password.length < 6) {
        errors.password = 'Minimal 6 symbols';
      }

      if (errors.username || errors.password) return errors;
    } catch (err) {
      console.log('SignHelper - checkNewUserData - ', err);
    }
  }

}
