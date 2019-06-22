import React from 'react';
import PropTypes from 'prop-types';

import './sign.css';

const Sign = ({ trySignIn }) => {
  const elementVisibility = trySignIn ? 'invisible' : '';
  const repeatPassClass = `signField ${elementVisibility}`;

  return (
    <form className='signForm'>
      <label className='signField'>Username<input type="text"/></label>
      <label className='signField'>Password<input type="password"/></label>
      <label className={ repeatPassClass }>Repeat Password<input type="password"/></label>
      {
        trySignIn ?
        <button>Log in</button> :
        <button>Create account</button>
      }
    </form>
  );
};

Sign.propTypes = {
  trySignIn: PropTypes.bool.isRequired,
};

export default Sign;
