import React from 'react';
import PropTypes from 'prop-types';

const Basis = (props) => {
  return (
    <div className='basis'>
      <header className='basisHeader'>
        <h1 className='headerTitle'>{ props.headerText || 'TimePoint' }</h1>
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
      <footer className='basisFooter'>Footer</footer>
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
