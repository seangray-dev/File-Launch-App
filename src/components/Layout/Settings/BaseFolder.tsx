import React, { useState, useEffect, useContext } from 'react';
import { dialog } from '@tauri-apps/api';
import ButtonMain from '../../Buttons/ButtonMain';

const BaseFolder = () => {
  const [baseFolder, setBaseFolder] = useState(() => {
    const savedBaseFolder = window.localStorage.getItem('baseFolder');
    return savedBaseFolder || '';
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
    <section className='flex items-center justify-between'>
      <div className='flex flex-col gap-2'>
        <p className='text-darkBlue dark:text-white'>Base Folder:</p>
        <p className='text-gray'>{baseFolder}</p>
      </div>
      <ButtonMain onClick={selectDirectory}>Change Folder</ButtonMain>
    </section>
  );
};

export default BaseFolder;
