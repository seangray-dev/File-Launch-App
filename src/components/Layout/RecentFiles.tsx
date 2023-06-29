import React, { useState, useEffect } from 'react';
import { fs } from '@tauri-apps/api';

const RecentFiles = () => {
  const [baseFolder, setBaseFolder] = useState('');
  const [recentFiles, setRecentFiles] = useState([]);

  useEffect(() => {
    const savedBaseFolder = window.localStorage.getItem('baseFolder');
    if (savedBaseFolder) {
      setBaseFolder(savedBaseFolder);
      // load the files when baseFolder is set
      loadRecentFiles(savedBaseFolder);
    }
  }, []);

  const loadRecentFiles = async (dirPath) => {
    try {
      const allFiles = await getAllFiles(dirPath);
      // Filter the files by .mp3 and .wav extensions
      const audioFiles = allFiles.filter(
        (file) => file.name.endsWith('.mp3') || file.name.endsWith('.wav')
      );
      setRecentFiles(audioFiles);
    } catch (error) {
      console.error('Failed to read directory:', error);
    }
  };

  const getAllFiles = async (dirPath, filesArr = []) => {
    const files = await fs.readDir(dirPath);
    for (let file of files) {
      try {
        const subFiles = await fs.readDir(`${dirPath}/${file.name}`);
        filesArr = await getAllFiles(`${dirPath}/${file.name}`, filesArr);
      } catch (error) {
        filesArr.push(file);
      }
    }
    return filesArr;
  };

  return (
    <div className='dark:text-white'>
      <p>Base folder: {baseFolder}</p>
      <h2>Recent Audio Files:</h2>
      <ul className='flex flex-col gap-2'>
        {recentFiles.map((file, index) => (
          <li
            className='text-gray hover:text-white bg-gradient-to-r from-deepBlue py-1 px-2 cursor-pointer rounded-md'
            key={index}>
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentFiles;
