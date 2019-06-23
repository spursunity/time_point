import { Meteor } from 'meteor/meteor';
import 'chai/register-should';

import Users from '../../imports/api/users';

describe("TimePoint sign -", function () {
  describe('user actions with auth -', () => {
    if (Meteor.isServer) {
      const username = 'AlbertJohnJackBrienLukeAntonJakson';
      const password = 'tt92kssss';

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
