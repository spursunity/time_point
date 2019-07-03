import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import session from 'express-session';
import { check } from 'meteor/check';

import TaskHelper from './helpers/task-helper';

export default Tasks = new Mongo.Collection('tasks');

let token = '';
let uid = '';
const taskHelper = new TaskHelper();

if (Meteor.isServer) {
  try {
    WebApp.connectHandlers.use(session({
      secret: 'peninsula',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 300000 },
    }));

    WebApp.connectHandlers.use((req, res, next) => {
      token = req.session.token;
      if (token) uid = taskHelper.getUidFromToken(token);

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

      if (tasksCount === 0) {
        const tasksListId = await Tasks.insert({ owner: uid, tasksNames: [newTaskName] });

        if (! tasksListId) throw new Meteor.Error('mongodb error');

        return [newTaskName];
      } else if (tasksCount > 0) {
        const updateResponse = await Tasks.update({ owner: uid }, { $push: { tasksNames: newTaskName } });

        if (updateResponse === 0) throw new Meteor.Error('mongodb error');

        const tasksList = await Tasks.findOne({ owner: uid }, { fields: { tasksNames: 1 } });

        return tasksList.tasksNames;
      }
    } catch (err) {
      console.log('Meteor methods - tasks - addNewTask - ', err);
    }
  },
  async 'tasks.getInitialData'() {
    try {
      if (! uid) return false;

      const response = await Tasks.findOne({ owner: uid }, { fields: { tasksNames: 1, startTime: 1, currentTaskName: 1 } }) || { tasksNames: [] };
      const { _id, ...initialData } = response;

      return initialData;
    } catch (err) {
      console.log('Meteor methods - tasks - getTasksList - ', err);
    }
  },
  async 'tasks.startTimer'(taskName) {
    try {
      const nowDate = new Date();
      const nowNumber = nowDate.getTime();

      const updateResponse = await Tasks.update({ owner: uid }, { $set: { currentTaskName: taskName, startTime: nowNumber } });

      if (updateResponse === 0) throw new Meteor.Error('mongodb error');

      return nowNumber;
    } catch (err) {
      console.log('Meteor methods - tasks - startTimer - ', err);
    }
  },
  async 'tasks.stopTimer'(taskName) {
    try {
      const nowDate = new Date();
      const nowNumber = nowDate.getTime();

      const { startTime } = await Tasks.findOne({ owner: uid }, { fields: { startTime: 1 } });

      if (! startTime) throw new Meteor.Error('timer did not start');

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
      const updateResponse = await Tasks.update({ owner: uid }, { $push: { tasksInfo: taskInfo } });

      if (! updateResponse) {
        const setResponse = await Tasks.update({ owner: uid }, { $set: { tasksInfo: [taskInfo] } });

        if (setResponse === 0) throw new Meteor.Error('mongodb error');
      }
      await Tasks.update({ owner: uid }, { $set: { currentTaskName: null, startTime: null } });

      return true;
    } catch (err) {
      console.log('Meteor methods - tasks - stopTimer - ', err);
    }
  },
  async 'tasks.getTasksInfo'() {
    try {
      if (! uid) return false;
      
      const { tasksInfo } = await Tasks.findOne({ owner: uid }, { fields: { tasksInfo: 1 } }) || { tasksInfo: [] };
      let sortedTasksInfo;

      if (tasksInfo.length > 1) {
        sortedTasksInfo = tasksInfo.sort((taskA, taskB) => {
          return taskA.stopTime - taskB.stopTime;
        });
      }

      return sortedTasksInfo || tasksInfo;
    } catch (err) {
      console.log('Meteor methods - tasks - getTasksInfo - ', err);
    }
  },
})
