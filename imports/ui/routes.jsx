import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
// config file
import config from '../../config.js';
// route components
import StartPage from './pages/start-page/start-page.jsx';
import NotFound from './pages/not-found/not-found.jsx';
import RuleTimer from './pages/rule-timer/rule-timer.jsx';
import TimeLog from './pages/time-log/time-log.jsx';

const { routes } = config;

FlowRouter.route(routes.START_PAGE, {
  name: 'StartPage',
  action() {
    mount(StartPage)
  },
})

FlowRouter.route(routes.RULE_TIMER, {
  name: 'RuleTimer',
  action() {
    mount(RuleTimer)
  },
})

FlowRouter.route(routes.TIME_LOG, {
  name: 'TimeLog',
  action() {
    mount(TimeLog)
  },
})

FlowRouter.route(routes.ANY_ROUTE, {
  name: 'NotFound',
  action() {
    mount(NotFound)
  },
})
