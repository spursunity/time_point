import React from 'react';
import PropTypes from 'prop-types';

import Basis from '../../containers/basis/basis.jsx';

import './rule-timer.css';

const RuleTimer = (props) => (
  <Basis headerText={ 'Rule your time' }>
    <div className='ruleTimer'>
      <div className='tasksList'>
        <ul>
          <li>task 1</li>
          <li>task 2</li>
          <li>task 3</li>
          <li>task 4</li>
          <li>task 5</li>
        </ul>
      </div>
      <div className='managingBlock'>
        <div className='newTask'>
          <input type="text"/>
          <button>Add Task</button>
        </div>
        <div className='timer'></div>
      </div>
    </div>
  </Basis>
);

RuleTimer.propTypes = {

};

export default RuleTimer;
