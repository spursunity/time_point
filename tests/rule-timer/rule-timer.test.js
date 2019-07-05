import { Meteor } from 'meteor/meteor';
import 'chai/register-should';

import Users from '../../imports/api/users';
import Tasks from '../../imports/api/tasks';

describe('TimePoint rule timer - ', () => {
  if (Meteor.isServer) {
    const username = 'AlbertJohnJackBrienLukeAntonJakson';
    let uid;
    const context = {};
    const newTaskName01 = 'some task';
    const newTaskName02 = 'some task else';

    it('get uid - ', async (done) => {
      const uData = await Users.findOne({ username }, { fields: { _id: 1 } });
      uid = uData['_id'];
      context.uid = uid;

      uid.should.be.a('string');

      done();
    });

    it('get empty tasks list', async (done) => {
      const getInitialData = Meteor.server.method_handlers['tasks.getInitialData'];
      getInitialData.bind(context);

      const initialData = await getInitialData();

      initialData.tasksNames.should.be.a('array');
      initialData.tasksNames.length.should.equal(0);

      done();
    });

    it('add first task - ', async (done) => {
      const addNewTask = Meteor.server.method_handlers['tasks.addNewTask'];
      addNewTask.bind(context);

      const allUserTasks = await addNewTask(newTaskName01, 0);

      allUserTasks.should.be.a('array');
      allUserTasks.length.should.equal(1);

      done();
    });

    it('add next task - ', async (done) => {
      const addNewTask = Meteor.server.method_handlers['tasks.addNewTask'];
      addNewTask.bind(context);

      const allUserTasks = await addNewTask(newTaskName02, 1);

      allUserTasks.should.be.a('array');
      allUserTasks.length.should.equal(2);

      done();
    });

    it('get tasks list - ', async (done) => {
      const getInitialData = Meteor.server.method_handlers['tasks.getInitialData'];
      getInitialData.bind(context);

      const initialData = await getInitialData();
      console.log(initialData);

      initialData.tasksNames.should.be.a('array');
      initialData.tasksNames.length.should.equal(2);

      done();
    });

    it('start timer - ', async (done) => {
      const startTimer = Meteor.server.method_handlers['tasks.startTimer'];
      startTimer.bind(context);

      const startTime = await startTimer(newTaskName01);
      const now = (new Date()).getTime();

      startTime.should.be.below(now);

      done();
    });

    it('stop timer - ', async (done) => {
      const stopTimer = Meteor.server.method_handlers['tasks.stopTimer'];
      stopTimer.bind(context);
      const isTaskInserted = await stopTimer(newTaskName01);

      isTaskInserted.should.equal(true);

      done();
    });

    it('get task info - ', async (done) => {
      const getTasksInfo = Meteor.server.method_handlers['tasks.getTasksInfo'];
      getTasksInfo.bind(context);
      const tasksInfo = await getTasksInfo();

      tasksInfo.should.be.a('array');
      tasksInfo.length.should.equal(1);
      tasksInfo[0].startDate.should.be.a('string');

      done();
    });

    it('delete task from tasks list', async (done) => {
      const deleteTaskName = Meteor.server.method_handlers['tasks.deleteTaskName'];
      deleteTaskName.bind(context);

      const updatedTasksNames = await deleteTaskName(newTaskName01);

      updatedTasksNames.should.be.a('array');
      updatedTasksNames.length.should.equal(1);

      done();
    });
  }
});
