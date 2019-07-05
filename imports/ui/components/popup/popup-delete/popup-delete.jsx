import React from 'react';
import PropTypes from 'prop-types';

import './popup-delete.css';

const PopupDelete = (props) => {
  return (
    <div className='layout'>
      <div className='popupDelete'>
        <div className='buttonContainer'>
          <span className='sideText'>Oops:)</span>
          <button className='button-circle blue'>Back</button>
          <span className='sideText'>(no delete)</span>
        </div>
        <div className='buttonContainer'>
          <span className='sideText'>Sure,</span>
          <button className='button-circle red'>Delete</button>
          <span className='sideText'>{ props.deletedItem }</span>
        </div>
      </div>
    </div>
  );
};

PopupDelete.propTypes = {
  deletedItem: PropTypes.string.isRequired,
};

export default PopupDelete;
