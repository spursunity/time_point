
export default class RuleTimerHelper {
  constructor() {}

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

      return `${days} day(-s), ${hours} hour(-s), ${minutes} minute(-s)`;
    } catch (err) {
      console.log('RuleTimerHelper - getTaskDuration - ', err);
    }
  }

  transformDateToString(date) {
    try {
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
      console.log('RuleTimerHelper - transformDateToString - ', err);
    }
  }

  transformTimeToString(time) {
    try {
      if (time < 10) return '0' + time;

      return '' + time;
    } catch (err) {
      console.log('RuleTimerHelper - transformTimeToString - ', err);
    }
  }
}
