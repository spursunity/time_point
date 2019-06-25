import { Meteor } from 'meteor/meteor';
import 'chai/register-should';

import Users from '../../imports/api/users';

describe("TimePoint sign -", function () {
  describe('user actions with auth -', () => {
    if (Meteor.isServer) {
      const username = 'AlbertJohnJackBrienLukeAntonJakson';
      const notExistingUsername = 'kkkkkaaaaaaaarrrrrrrrrr';
      const emptyUsername = '';
      const password = 'tt92kssss';
      const wrongPassword = 'tt92ksss'; // without one letter -s-
      const tooSmallPassword = 'hhaaj';

      it("create account -", () => {
        const createAccount = Meteor.server.method_handlers['users.createAccount'];

        createAccount(username, password);

        findUsersCount(username, password).should.equal(1);
      });

      it("user is logged -", () => {
        const _id = getUserId(username, password);

        const userData = Users.findOne({ _id });

        userData.token.should.be.a('string');
      });

      it("logout -", () => {
        const _id = getUserId(username, password);

        const removeToken = Users.update({ _id }, { $set: { token: null, expiration: null } });

        removeToken.should.equal(1);
      });

      it("user is not logged -", () => {
        const _id = getUserId(username, password);

        const userData = Users.findOne({ _id });

        should.not.exist(userData.token);
      });

      it("sign in -", () => {
        const signin = Meteor.server.method_handlers['users.signin'];

        Users.update({ username, password }, { $set: { token: 'random', expiration: '111111111111111111' } }).should.equal(1);
        checkUserToken(username, password).should.not.deep.equal({ token: null, expiration: null });
      });

      it("user does not exist -", () => {
        const signin = Meteor.server.method_handlers['users.signin'];

        signin(notExistingUsername, password).should.has.own.property('password');
      });

      it("password is wrong -", () => {
        const signin = Meteor.server.method_handlers['users.signin'];

        signin(username, wrongPassword).should.has.own.property('password');
      });

      it('creation: username is occupied', () => {
        const createAccount = Meteor.server.method_handlers['users.createAccount'];

        createAccount(username, password).should.have.own.property('username');
      });

      it('creation: username is empty', () => {
        const createAccount = Meteor.server.method_handlers['users.createAccount'];

        createAccount(emptyUsername, password).should.have.own.property('username');
      });

      it('creation: password has less then 6 symbols', () => {
        const createAccount = Meteor.server.method_handlers['users.createAccount'];

        createAccount(username, tooSmallPassword).should.have.own.property('password');
      });
    }
  });
});

function findUsersCount(username, password) {
  if (!username && !password) {
    return Users.find({}).count();
  }
  return Users.find({username, password}).count();
}

function checkUserToken(username, password) {
  const user = Users.findOne({username, password});
  const { token, expiration } = user;

  return { token, expiration };
}

function getUserId(username, password) {
  const { _id } = Users.findOne({ username, password }, { _id: 1 });

  return _id;
}
