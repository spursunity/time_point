import { Meteor } from 'meteor/meteor';
import 'chai/register-should';

import Users from '../../imports/api/users';

function findUser(username, password) {
  return Users.find({username, password}).count();
}

describe("TimePoint sign -", function () {
  describe('user actions with auth -', () => {
    if (Meteor.isServer) {
      it("create account -", function () {
        const createAccount = Meteor.server.method_handlers['users.createAccount'];
        const username = 'Albert';
        const password = 'tt92kssss';

        createAccount(username, password);

        findUser(username, password).should.equal(1);
      });
    }
  });
});
