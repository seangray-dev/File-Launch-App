import React, { useState, useEffect, useContext } from 'react';
import Theme from './Settings/Theme';
import BaseFolder from './Settings/BaseFolder';
import Startup from './Settings/Startup';

const Settings = () => {
  return (
    <div className='flex flex-col gap-6'>
      <h1 className='font-bold text-2xl text-darkBlue dark:text-white'>
        Settings
      </h1>
      <Theme />
      <div className='flex flex-col gap-6'>
        <BaseFolder />
        <Startup />
      </div>
    </div>
  );
};

export default Settings;
