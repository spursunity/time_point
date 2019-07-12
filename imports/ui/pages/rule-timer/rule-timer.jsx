import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { check } from 'meteor/check';
import _ from 'lodash';

import config from '../../../../config.js';

import Basis from '../../containers/basis/basis.jsx';
import Loading from '../../components/loading/loading.jsx';
import RuleTimerHelper from './helper';
import PopupDelete from '../../components/popup/popup-delete/popup-delete.jsx';

import './rule-timer.css';

const RuleTimer = (props) => {
  let [ loading, setLoading ] = useState(true);
  let [ newTaskName, setNewTaskName ] = useState('');
  let [ currentTaskName, setCurrentTaskName ] = useState(null);
  let [ startTime, setStartTime ] = useState(0);
  let [ taskDuration, setTaskDuration ] = useState('Click button "Check"');
  let [ taskNameError, setTaskNameError ] = useState('');
  let [ tasks, setTasks ] = useState([]);
  let [ deletedTask, setDeletedTask ] = useState(null);

  useEffect(() => {
    Meteor.call('tasks.getInitialData', (err, res) => {
      if (err) throw new Meteor.Error('get initial data error');
      if (! res) {
        redirectToStartPage();
        return;
      }
      check(res.tasksNames, Array);

      setTasks(res.tasksNames);

      if (res.startTime && res.currentTaskName) {
        setStartTime(res.startTime);
        setCurrentTaskName(res.currentTaskName);
      }
      setLoading(false);
    });
  }, []);

  const helper = new RuleTimerHelper();
  const { routes, urls, errorMessages, keyCodes, headerTitles } = config;

  const redirectToStartPage = () => {
    props.history.push(routes.START_PAGE);
  };

  const redirectToTimeLog = () => {
    props.history.push(routes.TIME_LOG);
  };

  const redirectWithLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch(urls.LOGOUT);
      props.history.push(routes.START_PAGE);
    } catch (err) {
      console.log(err);
    }
  };

  const changeTaskName = (event) => {
    taskNameText = event.target.value;

    setNewTaskName(taskNameText);
    setTaskNameError('');
  };

  const changeCurrentTaskName = (taskName) => {
    if (! startTime) {
      setCurrentTaskName(taskName);
    }
  };

  const addNewTask = () => {
    if (tasks.includes(newTaskName.trim())) {
      setTaskNameError(errorMessages.OCCUPIED_TASK_NAME);
      return;
    } else if (newTaskName.length < 1) {
      setTaskNameError(errorMessages.EMPTY_FIELD);
      return;
    }
    const tasksCount = tasks.length;
    setNewTaskName(newTaskName.trim());

    Meteor.call('tasks.addNewTask', newTaskName, tasksCount, (err, res) => {
      if (err) throw new Meteor.Error('cannot add new task');
      check(res, Array);
      setTasks(res);
    });
  };

  const keyEnterHandler = (event) => {
    if (event.keyCode === keyCodes.ENTER) {
      addNewTask();
    }
  };

  const displayTasksList = () => {
    if (tasks && tasks.length > 0) {
      return _.map(tasks, (taskName, index) => {
        return (
          <li
          className='taskItem'
          key={ index }
          onClick={ () => changeCurrentTaskName(taskName) }
          >
            { taskName }
            {
              taskName === currentTaskName && startTime ?
              '' :
              <button
              className='button-small-circle red deleteTask'
              onClick={ () => setDeletedTask(taskName) }
              >
                Del
              </button>
            }
          </li>
        );
      });
    } else {
      return '';
    }
  };

  const startTimer = () => {
    if (tasks.includes(currentTaskName)) {
      const nowNumber = _.now();

      Meteor.call('tasks.startTimer', currentTaskName, nowNumber, (err, res) => {
        if (err) throw new Meteor.Error('start timer error');
        check(res, Number);

        setStartTime(res);
      });
    }
  };

  const stopTimer = () => {
    if (currentTaskName && currentTaskName.length) {
      const stop = new Date();
      const start = new Date(startTime);
      const stopNumber = stop.getTime();
      const stopString = helper.transformDateToString(stop);
      const startString = helper.transformDateToString(start);

      Meteor.call('tasks.stopTimer', currentTaskName, startTime, startString, stopNumber, stopString, (err, res) => {
        if (err) throw new Meteor.Error('stop timer error');

        if (res) {
          setStartTime(0);
          setCurrentTaskName(null);
        }
      });
    }
  };

  const showTaskDuration = () => {
    const nowNumber = (new Date()).getTime();

    const duration = helper.getTaskDuration(startTime, nowNumber);
    setTaskDuration(duration);
  };

  const deleteTask = () => {
    setLoading(true);
    Meteor.call('tasks.deleteTaskName', deletedTask, (err, res) => {
      if (err) throw new Meteor.Error('delete task name error');
      check(res, Array);

      setTasks(res);
      setDeletedTask(null);
      setCurrentTaskName(null);
      setLoading(false);
    });
  };

  const cancelDeletion = () => {
    setDeletedTask(null);
  };

  const headerButton = (
    <>
      <button
      className='button-small-circle blue'
      onClick={ redirectToTimeLog }
      >
        See
      </button>
      <span>completed tasks</span>
    </>
  );

  return (
    loading ?
    <Loading /> :
    <>
      <Basis
      headerText={ headerTitles.RULE_TIMER }
      headerButton={ headerButton }
      logout={ redirectWithLogout }
      >
        <div className='ruleTimer'>
          <ul className='listContainer'>
            { displayTasksList() }
          </ul>
          <div className='managingBlock'>
            <div className='newTask'>
              <label className='textField'>
                New Task Name<br/>
                <input
                className='newTaskName'
                type='text'
                onChange={ changeTaskName }
                onKeyUp={ keyEnterHandler }
                />
              </label>
              <p className='taskNameError'>{ taskNameError }</p>
              <button
              className='button-circle blue'
              onClick={ addNewTask }
              >
                Add
              </button>
            </div>
            <div className='timer'>
              <h2 className='timerTitle'>
                Current task:
                <span className='currentTaskName'>{ currentTaskName || 'No chosen' }</span>
              </h2>
              <div className='timerButtons'>
                {
                  startTime ?
                  <>
                    <button
                    className='button-circle blue'
                    onClick={ showTaskDuration }
                    >
                      Check
                    </button>
                    <p>{ taskDuration }</p>
                    <button
                    className='button-circle red'
                    onClick={ stopTimer }
                    >
                      Stop
                    </button>
                  </> :
                  <button
                  className='button-circle blue'
                  onClick={ startTimer }
                  >
                    Start
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      </Basis>
      {
        deletedTask ?
        <PopupDelete
        deletedItem={ deletedTask }
        deleteTask={ deleteTask }
        cancelDeletion={ cancelDeletion }
        /> :
        ''
      }
    </>
  )
};

RuleTimer.propTypes = {};

export default RuleTimer;
