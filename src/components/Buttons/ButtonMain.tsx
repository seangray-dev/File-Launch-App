import React from 'react';

const ButtonMain = ({ onClick, children }) => {
  return (
    <button
      className='bg-cyan rounded-md text-deepBlue  px-4 py-2 justify-center items-center border border-cyan hover:bg-transparent hover:text-cyan transition-all duration-300'
      onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonMain;
