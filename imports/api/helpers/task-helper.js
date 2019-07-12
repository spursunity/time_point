import { Tasks } from '../tasks';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import _ from 'lodash';
const jwt = require('jsonwebtoken');

import config from '../../../config.js';

export default class TaskHelper {
  constructor() {}

  getUidFromToken(token) {
    try {
      const decoded = jwt.verify(token, Meteor.settings.JWT_KEY);

      return decoded['_id'];
    } catch (err) {
      console.log('TaskHelper - getUidFromToken - ', err);
    }
  }

  getTaskDuration(startTime, stopTime) {
    try {
      let diffTime = stopTime - startTime;
      const minuteMs = 1000 * 60;
      const hourMs = minuteMs * 60;
      const dayMs = hourMs * 24;

      const days = _.floor(diffTime / dayMs);
      diffTime -= days * dayMs;

      const hours = _.floor(diffTime / hourMs);
      diffTime -= hours * hourMs;

      const minutes = _.round(diffTime / minuteMs);

      const daysString = days ? `${days} day(-s), ` : '';
      const hoursString = hours ? `${hours} hour(-s), ` : '';

      return `${daysString}${hoursString}${minutes} minute(-s)`;
    } catch (err) {
      console.log('TaskHelper - getTaskDuration - ', err);
    }
  }
}
