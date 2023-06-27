import React from 'react';

const ButtonMain = ({ onClick, children }) => {
  return (
    <button
      className='bg-cyan rounded-full text-deepBlue font-bold px-4 py-3 justify-center items-center border border-cyan hover:bg-transparent hover:text-white transition-all duration-300'
      onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonMain;
