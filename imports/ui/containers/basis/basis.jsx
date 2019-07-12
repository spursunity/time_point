import React from 'react';
import PropTypes from 'prop-types';

import config from '../../../../config.js';

const Basis = (props) => {
  const { headerTitles } = config;

  return (
    <div className='basis'>
      <header className='basisHeader'>
        <h1 className='headerTitle'>{ props.headerText || headerTitles.DEFAULT }</h1>
        <div className='headerButton'>{ props.headerButton || '' }</div>
        {
          props.logout ?
          <button
          className='button-circle red logout'
          onClick={ props.logout }
          >
            Log out
          </button> :
          ''
        }
      </header>
      { props.children }
      <footer className='basisFooter'>Code on <a href="https://github.com/spursunity/time_point" target="_blank">GitHub</a></footer>
    </div>
  )
}

Basis.propTypes = {
  headerText: PropTypes.string,
  headerButton: PropTypes.element,
  logout: PropTypes.func,
  children: PropTypes.element.isRequired,
};

export default Basis;
