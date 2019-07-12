import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import session from 'express-session';
import { check } from 'meteor/check';
import _ from 'lodash';

import TaskHelper from './helpers/task-helper';

export default Tasks = new Mongo.Collection('tasks');

const taskHelper = new TaskHelper();

if (Meteor.isServer) {
  try {
    WebApp.connectHandlers.use((req, res, next) => {
      next();
    });
  } catch (err) {
    console.log('api/tasks.js - ', err);
  }
}

Meteor.methods({
  async 'tasks.addNewTask'(newTaskName, tasksCount) {
    try {
      check(newTaskName, String);
      check(tasksCount, Number);

      const { uid } = authData;

      if (tasksCount === 0) {
        const tasksListId = await Tasks.insert({ owner: uid, tasksNames: [ newTaskName ] });

        if (! tasksListId) throw new Meteor.Error('insert first task name error');

        return [ newTaskName ];
      } else if (tasksCount > 0) {
        const updateResponse = await Tasks.update({ owner: uid }, { $push: { tasksNames: newTaskName } });

        if (updateResponse === 0) throw new Meteor.Error('update tasks names error');

        const { tasksNames } = await Tasks.findOne({ owner: uid }, { fields: { tasksNames: 1 } }) || { tasksNames: [] };

        if (tasksNames.length === 0) throw new Meteor.Error('find tasks names error');

        return tasksNames;
      }
    } catch (err) {
      console.log('Meteor methods - tasks - addNewTask - ', err);
    }
  },
  async 'tasks.getInitialData'() {
    try {
      const { uid } = authData;

      if (! uid && process.env.NODE_ENV.trim() !== 'test') return false;

      const response = await Tasks.findOne({ owner: uid }, { fields: { tasksNames: 1, startTime: 1, currentTaskName: 1 } }) || { tasksNames: [] };
      const { _id, ...initialData } = response;

      return initialData;
    } catch (err) {
      console.log('Meteor methods - tasks - getTasksList - ', err);
    }
  },
  async 'tasks.startTimer'(taskName) {
    try {
      const { uid } = authData;
      const nowNumber = _.now();

      const updateResponse = await Tasks.update({ owner: uid }, { $set: { currentTaskName: taskName, startTime: nowNumber } });

      if (updateResponse === 0) throw new Meteor.Error('update start time error');

      return nowNumber;
    } catch (err) {
      console.log('Meteor methods - tasks - startTimer - ', err);
    }
  },
  async 'tasks.stopTimer'(taskName) {
    try {
      const { uid } = authData;
      const nowNumber = _.now();

      const { startTime } = await Tasks.findOne({ owner: uid }, { fields: { startTime: 1 } }) || { startTime: null };

      if (! startTime) throw new Meteor.Error('find start time error');

      const durationString = taskHelper.getTaskDuration(startTime, nowNumber);
      const startDate = taskHelper.transformDateToString(startTime);
      const stopDate = taskHelper.transformDateToString(nowNumber);
      const taskInfo = {
        name: taskName,
        startTime,
        stopTime: nowNumber,
        durationString,
        startDate,
        stopDate,
      };
      const updateTaskInfoResponse = await Tasks.update({ owner: uid }, { $push: { tasksInfo: taskInfo } });

      if (! updateTaskInfoResponse) {
        const setResponse = await Tasks.update({ owner: uid }, { $set: { tasksInfo: [ taskInfo ] } });

        if (setResponse === 0) throw new Meteor.Error('update task info error');
      }
      const updateStartTimeResponse = await Tasks.update({ owner: uid }, { $set: { currentTaskName: null, startTime: null } });

      if (! updateStartTimeResponse) throw new Meteor.Error('update start time error');

      return true;
    } catch (err) {
      console.log('Meteor methods - tasks - stopTimer - ', err);
    }
  },
  async 'tasks.getTasksInfo'() {
    try {
      const { uid } = authData;

      if (! uid && process.env.NODE_ENV.trim() !== 'test') return false;

      const { tasksInfo } = await Tasks.findOne({ owner: uid }, { fields: { tasksInfo: 1 } }) || { tasksInfo: [] };
      let sortedTasksInfo;

      if (tasksInfo.length > 1) {
        sortedTasksInfo = _.sortBy(tasksInfo, [ (info) => -info.stopTime ]);
      }

      return sortedTasksInfo || tasksInfo;
    } catch (err) {
      console.log('Meteor methods - tasks - getTasksInfo - ', err);
    }
  },
  async 'tasks.deleteTaskName'(taskName) {
    try {
      check(taskName, String);

      const { uid } = authData;

      const { currentTaskName } = await Tasks.findOne({ owner: uid }, { fields: { currentTaskName: 1 } }) || { currentTaskName: null };

      if (currentTaskName === taskName) throw new Meteor.Error('attempt to delete current task');

      const responseStatus = await Tasks.update({ owner: uid }, { $pull: { tasksNames: taskName} });

      if (responseStatus !== 1) throw new Meteor.Error('update tasks names error');

      const { tasksNames } = Tasks.findOne({ owner: uid }, { fields: { tasksNames: 1 } }) || { tasksNames: null };
      check(tasksNames, Array);

      return tasksNames;
    } catch (err) {
      console.log('Meteor methods - tasks - deleteTaskName - ', err);
    }
  },
})
