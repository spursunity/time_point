import Tasks from '../tasks';
import { check } from 'meteor/check';
const jwt = require('jsonwebtoken');

export default class TaskHelper {
  constructor() {
    this.jwtKey = 'venovat-pozornost';
  }

  getUidFromToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtKey);

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

      const days = Math.floor(diffTime / dayMs);
      diffTime -= days * dayMs;

      const hours = Math.floor(diffTime / hourMs);
      diffTime -= hours * hourMs;

      const minutes = Math.round(diffTime / minuteMs);

      return `${days} days, ${hours} hours, ${minutes} minutes`;
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
      const month = monthsArray[monthNumber];
      const weekdayNumber = date.getDay();
      const weekday = weekdaysArray[weekdayNumber];
      const year = date.getFullYear();

      return `${hours}:${minutes} - ${month} ${day} (${weekday}) - ${year}`;
    } catch (err) {
      console.log('TaskHelper - transformDateToString - ', err);
    }
  }
}