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
        const isLogged = Meteor.server.method_handlers['users.isLogged'];

        isLogged(username).should.equal(true);
      });

      it("logout -", () => {
        const logout = Meteor.server.method_handlers['users.logout'];

        logout(username);

        checkUserToken().should.deep.equal({ token: null, expiration: null });
      });

      it("user is not logged -", () => {
        const isLogged = Meteor.server.method_handlers['users.isLogged'];

        isLogged(username).should.equal(false);
      });

      it("sign in -", () => {
        const signin = Meteor.server.method_handlers['users.signin'];

        signin(username, password).should.equal(1);
        checkUserToken(username, password).should.not.deep.equal({ token: null, expiration: null });
      });

      it("user does not exist -", () => {
        const signin = Meteor.server.method_handlers['users.signin'];

        signin(notExistingUsername, password).should.equal(0);
      });

      it("password is wrong -", () => {
        const signin = Meteor.server.method_handlers['users.signin'];

        signin(username, wrongPassword).should.equal(0);
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
