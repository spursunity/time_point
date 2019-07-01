import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './loading.css';

const Loading = () => {
  return (
    <div className='loading'>
      <div className="container">
        <div className="dash uno"></div>
        <div className="dash dos"></div>
        <div className="dash tres"></div>
        <div className="dash cuatro"></div>
      </div>
    </div>
  );
};

Loading.propTypes = {};

export default Loading;
