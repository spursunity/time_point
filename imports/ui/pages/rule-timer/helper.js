
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

      return `${days} days, ${hours} hours, ${minutes} minutes`;
    } catch (err) {
      console.log('RuleTimerHelper - getTaskDuration - ', err);
    }
  }
}
