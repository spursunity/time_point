import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { check } from 'meteor/check';
import { Link } from 'react-router-dom';

import Basis from '../../containers/basis/basis.jsx';
import Loading from '../../components/loading/loading.jsx';
import RuleTimerHelper from './helper';

import './rule-timer.css';

const RuleTimer = (props) => {
  let [ loading, setLoading ] = useState(true);
  let [ newTaskName, setNewTaskName ] = useState('');
  let [ currentTaskName, setCurrentTaskName ] = useState('No chosen');
  let [ startTime, setStartTime ] = useState(0);
  let [ taskNameError, setTaskNameError ] = useState('');
  let [ tasks, setTasks ] = useState(null);

  useEffect(() => {
    Meteor.call('tasks.getInitialData', (err, res) => {
      if (err) throw new Meteor.Error('cannot get tasks');
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

  const redirectToStartPage = () => {
    props.history.push('/');
  };

  const changeTaskName = (event) => {
    taskNameText = event.target.value;

    setNewTaskName(taskNameText);
    setTaskNameError('');
  };

  const addNewTask = () => {
    if (tasks.includes(newTaskName)) {
      setTaskNameError('You already have such a task');
      return;
    }
    const tasksCount = tasks.length;
    setNewTaskName(newTaskName.trim());

    Meteor.call('tasks.addNewTask', newTaskName, tasksCount, (err, res) => {
      if (err) throw new Meteor.Error('cannot get tasks');
      check(res, Array);
      setTasks(res);
    });
  };

  const keyEnterHandler = (event) => {
    if (event.keyCode === 13) {
      addNewTask();
    }
  };

  const displayTasksList = () => {
    if (tasks && tasks.length > 0) {
      return tasks.map((taskName, index) => {
        return (
          <li
          className='taskItem'
          key={ index }
          onClick={ chooseCurrentTask }
          >
            { taskName }
          </li>
        );
      });
    } else {
      return '';
    }
  };

  const chooseCurrentTask = (event) => {
    if (startTime > 0) return;

    const chosenTask = event.currentTarget.textContent;
    check(chosenTask, String);

    if (chosenTask) setCurrentTaskName(chosenTask);
  };

  const startTimer = () => {
    if (tasks.includes(currentTaskName)) {
      Meteor.call('tasks.startTimer', currentTaskName, (err, res) => {
        if (err) throw new Meteor.Error('startTime error');
        check(res, Number);

        setStartTime(res);
      });
    }
  };

  const stopTimer = () => {
    if (currentTaskName && currentTaskName.length) {
      Meteor.call('tasks.stopTimer', currentTaskName, (err, res) => {
        if (err) throw new Meteor.Error('stopTimer error');

        if (res) {
          setStartTime(0);
          setCurrentTaskName('No chosen');
        }
      });
    }
  };

  const showTaskDuration = () => {
    const nowDate = new Date();
    const nowNumber = nowDate.getTime();

    const duration = helper.getTaskDuration(startTime, nowNumber);
    console.log(duration);
  };

  const headerButton = (
    <Link to='/log'>
      <button>See completed tasks</button>
    </Link>
  );

  return (
    loading ?
    <Loading /> :
    <Basis
    headerText={ 'Rule your time' }
    headerButton={ headerButton }
    >
      <div className='ruleTimer'>
        <div className='listContainer'>
          <ul>
            { displayTasksList() }
          </ul>
        </div>
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
            <button onClick={ addNewTask }>Add New Task</button>
          </div>
          <div className='timer'>
            <h2>Current task: <span className='currentTaskName'>{ currentTaskName }</span></h2>
            <div className='timerButtons'>
              {
                startTime ?
                <>
                  <button onClick={ showTaskDuration }>Check duration</button>
                  <button onClick={ stopTimer }>Stop Timer</button>
                </> :
                <button onClick={ startTimer }>Start Timer</button>
              }
            </div>
          </div>
        </div>
      </div>
    </Basis>
  )
};

RuleTimer.propTypes = {};

export default RuleTimer;
