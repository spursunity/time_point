import React from 'react';
import PropTypes from 'prop-types';

const PopupDelete = (props) => {
  const shortenTaskName = () => {
    const { deletedItem } = props;

    if (deletedItem.length > 8) {
      const shortName = deletedItem.slice(0, 8);

      return `${shortName}...`;
    }
    return deletedItem;
  };

  return (
    <div className='layout'>
      <div className='popupDelete'>
        <div className='buttonContainer'>
          <span className='sideText'>Oops:)</span>
          <button
          className='button-circle blue'
          onClick={ props.cancelDeletion }
          >
            Back
          </button>
          <span className='sideText'>(no delete)</span>
        </div>
        <div className='buttonContainer'>
          <span className='sideText'>Sure,</span>
          <button
          className='button-circle red'
          onClick={ props.deleteTask }
          >
            Delete
          </button>
          <span className='sideText'>{ shortenTaskName() }</span>
        </div>
      </div>
    </div>
  );
};

PopupDelete.propTypes = {
  deletedItem: PropTypes.string.isRequired,
  deleteTask: PropTypes.func.isRequired,
  cancelDeletion: PropTypes.func.isRequired,
};

export default PopupDelete;
