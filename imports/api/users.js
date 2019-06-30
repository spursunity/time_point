import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import session from 'express-session';
const jwt = require('jsonwebtoken');
const drupalHash = require('drupal-hash');
const bodyParser = require('body-parser');

export default Users = new Mongo.Collection('users');

const jwtKey = 'venovat-pozornost';
const salt = 'uplne-vpohode';
let initialData = {};

if (Meteor.isServer) {
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
      await signUp(username, password) :
      await signIn(username, password);

      if (! initialData.warnings) {
        req.session.token = createToken(username);
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

async function signIn (username, password) {
  check(username, String);
  check(password, String);

  const userData = await Users.findOne({ username });
  if (! userData) return { password: 'Check your Username or/and password' };

  const passwordComparison = drupalHash.checkPassword(password, userData.password);
  if (! passwordComparison) return { password: 'Check your Username or/and password' };
};

async function signUp (username, password) {
  check(username, String);
  check(password, String);

  const warnings = await checkNewUserData(username, password);

  if (warnings) return warnings;

  const hashedPassword = drupalHash.hashPassword(password);
  const userData = { username, password: hashedPassword };

  await Users.insert(userData);
};

function createToken (userData) {
  return jwt.sign(userData, jwtKey);
};

async function checkNewUserData(username, password) {
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
