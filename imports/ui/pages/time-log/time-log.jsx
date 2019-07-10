import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import _ from 'lodash';

import config from '../../../../config.js';

import Basis from '../../containers/basis/basis.jsx';
import Loading from '../../components/loading/loading.jsx';
import { check } from 'meteor/check';

import './time-log.css';

const TimeLog = (props) => {
  let [ loading, setLoading ] = useState(true);
  let [ tasksInfo, setTasksInfo ] = useState([]);

  useEffect(() => {
    Meteor.call('tasks.getTasksInfo', (err, res) => {
      if (err) throw new Meteor.Error('get tasks info error');
      if (! res) {
        redirectToStartPage();
        return;
      }
      check(res, Array);

      setTasksInfo(res);
      setLoading(false);
    });
  }, []);

  const { routes, urls, headerTitles } = config;

  const redirectToStartPage = () => {
    FlowRouter.go(routes.START_PAGE);
  };

  const redirectToRuleTimer = () => {
    FlowRouter.go(routes.RULE_TIMER);
  };

  const redirectWithLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch(urls.LOGOUT);
      FlowRouter.go(routes.START_PAGE);
    } catch (err) {
      console.log(err);
    }
  };

  const displayTasksData = () => {
    return (
      _.map(tasksInfo, (taskData, index) => {
        return (
          <div className='taskBlock' key={ index }>
            <p className='field'><span className='fieldTitle'>Task: </span>{ taskData.name }</p>
            <p className='field'><span className='fieldTitle'>Start point: </span>{ taskData.startDate }</p>
            <p className='field'><span className='fieldTitle'>End point: </span>{ taskData.stopDate }</p>
            <p className='field'><span className='fieldTitle'>Duration: </span>{ taskData.durationString }</p>
          </div>
        );
      })
    );
  };

  const headerButton = (
    <>
      <button
      className='button-small-circle blue'
      onClick={ redirectToRuleTimer }
      >
        See
      </button>
      <span>timer</span>
    </>
  );

  return (
    loading ?
    <Loading /> :
    <Basis
    headerText={ headerTitles.TIME_LOG }
    headerButton={ headerButton }
    logout={ redirectWithLogout }
    >
      <div className='timeLog'>
        <div className='tasksList'>
          { displayTasksData() }
        </div>
      </div>
    </Basis>
  );
};

TimeLog.propTypes = {};

export default TimeLog;
