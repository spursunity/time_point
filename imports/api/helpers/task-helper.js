import Tasks from '../tasks';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import _ from 'lodash';
const jwt = require('jsonwebtoken');

import config from '../../../config.js';

export default class TaskHelper {
  constructor() {}

  getUidFromToken(token) {
    try {
      const decoded = jwt.verify(token, config.envs.JWT_KEY);

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

      return `${days} day(-s), ${hours} hour(-s), ${minutes} minute(-s)`;
    } catch (err) {
      console.log('TaskHelper - getTaskDuration - ', err);
    }
  }

  transformDateToString(dateNumber) {
    try {
      const date = new Date(dateNumber);
      const monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const weekdaysArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const hours = date.getHours();
      const minutes = date.getMinutes();
      const day = date.getDate();
      const monthNumber = date.getMonth();
      const month = monthsArray[ monthNumber ];
      const weekdayNumber = date.getDay();
      const weekday = weekdaysArray[ weekdayNumber ];
      const year = date.getFullYear();

      const hoursString = this.transformTimeToString(hours);
      const minutesString = this.transformTimeToString(minutes);

      return `${hoursString}:${minutesString} - ${month} ${day} (${weekday}) - ${year}`;
    } catch (err) {
      console.log('TaskHelper - transformDateToString - ', err);
    }
  }

  transformTimeToString(time) {
    try {
      if (time < 10) return '0' + time;

      return '' + time;
    } catch (err) {
      console.log('TaskHelper - transformTimeToString - ', err);
    }
  }
}
