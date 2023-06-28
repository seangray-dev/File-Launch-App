import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { dialog } from '@tauri-apps/api';
import Startup from './Settings/Startup';

import ButtonMain from '../Buttons/ButtonMain';

const Settings = () => {
  const [baseFolder, setBaseFolder] = useState(() => {
    const savedBaseFolder = window.localStorage.getItem('baseFolder');
    return savedBaseFolder || '';
  });

  const { theme, handleThemeChange } = useContext(ThemeContext);

  useEffect(() => {
    window.localStorage.setItem('baseFolder', baseFolder);
  }, [baseFolder]);

  const selectDirectory = async () => {
    try {
      const path = await dialog.open({ directory: true });
      if (path) {
        setBaseFolder(path);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <h1 className='font-bold text-2xl text-darkBlue dark:text-white'>
        Settings
      </h1>
      <div className='flex flex-col gap-6'>
        <section className='flex items-center justify-between'>
          <div className='text-darkBlue dark:text-white'>
            <p>Theme:</p>
          </div>
          <div className='flex items-center gap-4'>
            <label className='text-darkBlue dark:text-white'>
              <input
                type='radio'
                name='theme'
                value='light'
                checked={theme === 'light'}
                onChange={() => handleThemeChange('light')}
              />
              Light
            </label>
            <label className='text-darkBlue dark:text-white'>
              <input
                type='radio'
                name='theme'
                value='dark'
                checked={theme === 'dark'}
                onChange={() => handleThemeChange('dark')}
              />
              Dark
            </label>
            <label className='text-darkBlue dark:text-white'>
              <input
                type='radio'
                name='theme'
                value='system'
                checked={theme === 'system'}
                onChange={() => handleThemeChange('system')}
              />
              System
            </label>
          </div>
        </section>
        <section className='flex items-center justify-between'>
          <div className='flex flex-col gap-2'>
            <p className='text-darkBlue dark:text-white'>Base Folder:</p>
            <p className='text-gray'>{baseFolder}</p>
          </div>
          <ButtonMain onClick={selectDirectory}>Change Folder</ButtonMain>
        </section>
        <Startup />
      </div>
    </div>
  );
};

export default Settings;
