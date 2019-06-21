import React from 'react';
import PropTypes from 'prop-types';

import Basis from '../../containers/basis/basis.jsx';

import './time-log.css';

const TimeLog = (props) => (
  <Basis headerText={ 'Your time is here' }>
    <div className='timeLog'>
      <div className='listBlock'>
        <ul>
          <li>task 1</li>
          <li>task 2</li>
          <li>task 3</li>
          <li>task 4</li>
          <li>task 5</li>
        </ul>
      </div>
      <div className='resultBlock'></div>
    </div>
  </Basis>
);

TimeLog.propTypes = {

};

export default TimeLog;
