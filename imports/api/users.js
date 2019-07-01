import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import session from 'express-session';
const bodyParser = require('body-parser');

import SignHelper from './helpers/sign-helper';

export default Users = new Mongo.Collection('users');

let initialData = {};

if (Meteor.isServer) {
  try {
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

        const result = req.body.copyPassword ?
        await signHelper.signUp(username, password) :
        await signHelper.signIn(username, password);

        if (result['_id']) {
          req.session.token = signHelper.createToken(result);
          initialData.hasToken = true;
        } else {
          initialData.errors = result;
        }
      }

      next();
    });
  } catch (err) {
    console.log('api/users.js - ', err);
  }
}

Meteor.methods({
  'users.checkUserInitialData'() {
    return initialData;
  },
  'users.removeAllUsers'() {
    try {
      Users.remove({});
    } catch (err) {
      console.log('Meteor methods - removeAllUsers - ', err);
    }
  },
});
