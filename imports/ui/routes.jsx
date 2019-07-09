import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

// route components
import StartPage from './pages/start-page/start-page.jsx';
import NotFound from './pages/not-found/not-found.jsx';
import RuleTimer from './pages/rule-timer/rule-timer.jsx';
import TimeLog from './pages/time-log/time-log.jsx';

FlowRouter.route('/', {
  name: 'StartPage',
  action() {
    mount(StartPage)
  },
})

FlowRouter.route('/timer', {
  name: 'RuleTimer',
  action() {
    mount(RuleTimer)
  },
})

FlowRouter.route('/log', {
  name: 'TimeLog',
  action() {
    mount(TimeLog)
  },
})

FlowRouter.route('/*', {
  name: 'NotFound',
  action() {
    mount(NotFound)
  },
})
