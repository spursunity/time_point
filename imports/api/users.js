import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import session from 'express-session';
const bodyParser = require('body-parser');

import SignHelper from './helpers/sign-helper';

export default Users = new Mongo.Collection('users');

let initialData = {};

if (Meteor.isServer) {
  const signHelper = new SignHelper();

  WebApp.connectHandlers.use(session({
    secret: 'peninsula',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  }));

  WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: false }));

  WebApp.connectHandlers.use((req, res, next) => {
    initialData = {};

    if (req.session.token) initialData.hasToken = true;

    next();
  });

  WebApp.connectHandlers.use(async (req, res, next) => {
    if (req.body.username && req.body.password) {
      const { username, password } = req.body;

      initialData.warnings = req.body.copyPassword ?
      await signHelper.signUp(username, password) :
      await signHelper.signIn(username, password);

      if (! initialData.warnings) {
        req.session.token = signHelper.createToken(username);
        initialData.hasToken = true;
      }
    }

    next();
  });
}

Meteor.methods({
  'users.checkUserInitialData'() {
    return initialData;
  },
  'users.removeAllUsers'() {
    Users.remove({});
  },
});
