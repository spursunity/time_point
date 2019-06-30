import Users from '../users';
import { check } from 'meteor/check';
const drupalHash = require('drupal-hash');
const jwt = require('jsonwebtoken');

export default class SignHelper {
  constructor() {
    this.jwtKey = 'venovat-pozornost';
  }

  async signIn (username, password) {
    check(username, String);
    check(password, String);

    const userData = await Users.findOne({ username });
    if (! userData) return { password: 'Check your Username or/and password' };

    const passwordComparison = drupalHash.checkPassword(password, userData.password);
    if (! passwordComparison) return { password: 'Check your Username or/and password' };
  };

  async signUp (username, password) {
    check(username, String);
    check(password, String);

    const errors = await this.checkNewUserData(username, password);

    if (errors) return errors;

    const hashedPassword = drupalHash.hashPassword(password);
    const userData = { username, password: hashedPassword };

    await Users.insert(userData);
  };

  createToken (userData) {
    return jwt.sign(userData, this.jwtKey);
  };

  async checkNewUserData(username, password) {
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
  }

}
