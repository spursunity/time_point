import React from 'react';
import PropTypes from 'prop-types';

import './basis.css';

const Basis = (props) => (
  <div className='basis'>
    <header>
      <h1 className='headerTitle'>{ props.headerText || 'TimePoint' }</h1>
      <div className='headerButton'>{ props.headerButton || '' }</div>
    </header>
    { props.children }
    <footer>Footer</footer>
  </div>
);

Basis.propTypes = {
  headerText: PropTypes.string,
  children: PropTypes.element.isRequired,
};

export default Basis;
