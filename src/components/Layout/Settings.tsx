import React, { useState, useEffect } from 'react';
import { dialog } from '@tauri-apps/api';

import ButtonMain from '../Buttons/ButtonMain';

const Settings = () => {
  const [baseFolder, setBaseFolder] = useState(() => {
    const savedBaseFolder = window.localStorage.getItem('baseFolder');
    return savedBaseFolder ? savedBaseFolder : '';
  });

  const [startupView, setStartupView] = useState(() => {
    const savedStartupView = window.localStorage.getItem('startupView');
    return savedStartupView ? savedStartupView : '';
  });

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
      <h1 className='font-bold text-2xl'>Settings</h1>
      <div className='flex flex-col gap-6'>
        <section className='flex items-center justify-between'>
          <div className='flex flex-col gap-2'>
            <p>Theme</p>
          </div>
          <div>
            <input type='radio' id='dark'></input>
          </div>
        </section>
        <section className='flex items-center justify-between'>
          <div className='flex flex-col gap-2'>
            <p>Base Folder:</p>
            <p className='text-gray'>{baseFolder}</p>
          </div>
          <ButtonMain onClick={selectDirectory}>Change Folder</ButtonMain>
        </section>
        <section>
          <p className='mb-2'>Startup Settings:</p>
          <div className='flex items-center justify-between'>
            <p className='text-gray'>
              Set the default view on application launch
            </p>
            <select
              className='bg-cyan text-darkBlue outline-none'
              value={startupView}
              onChange={(event) => setStartupView(event.target.value)}>
              <option value='RecentFiles'>Recent Files</option>
              <option value='Clients'>Clients</option>
              <option value='FormatFiles'>Format Files</option>
              <option value='EmailTemplates'>Email Templates</option>
              <option value='UserProfile'>User Profile</option>
              <option value='Settings'>Settings</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
