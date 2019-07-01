import { Meteor } from 'meteor/meteor';
import 'chai/register-should';

import Users from '../../imports/api/users';
import SignHelper from '../../imports/api/helpers/sign-helper';

describe("TimePoint sign -", function () {
  describe('user actions with auth -', () => {
    if (Meteor.isServer) {
      const username = 'AlbertJohnJackBrienLukeAntonJakson';
      const notExistingUsername = 'kkkkkaaaaaaaarrrrrrrrrr';
      const emptyUsername = '';
      const password = 'tt92kssss';
      const wrongPassword = 'tt92ksss'; // without one letter -s-
      const tooShortPassword = 'hhaaj';
      const signHelper = new SignHelper();

      it("create account -", async (done) => {
        const result = await signHelper.signUp(username, password);

        result['_id'].should.be.a('string');

        done();
      });

      it("create account (username is occupied) -", async (done) => {
        const errors = await signHelper.signUp(username, password);

        errors.username.should.be.a('string');

        done();
      });

      it('create account (empty username) -', async (done) => {
        const errors = await signHelper.signUp(emptyUsername, password);

        errors.username.should.be.a('string');

        done();
      });

      it('create account (too short password) -', async (done) => {
        const errors = await signHelper.signUp(username, tooShortPassword);

        errors.password.should.be.a('string');

        done();
      });

      it('create token -', () => {
        const token = signHelper.createToken({ username });

        token.should.be.a('string');
      });

      it('sign in -', async (done) => {
        const result = await signHelper.signIn(username, password);

        result['_id'].should.be.a('string');

        done();
      });

      it('sign in (wrong username) -', async (done) => {
        const errors = await signHelper.signIn(notExistingUsername, password);

        errors.password.should.be.a('string');

        done();
      });

      it('sign in (wrong password) -', async (done) => {
        const errors = await signHelper.signIn(username, wrongPassword);

        errors.password.should.be.a('string');

        done();
      });
    }
  });
});
