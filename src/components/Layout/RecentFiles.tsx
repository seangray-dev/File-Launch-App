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
      const filesInDir = await fs.readDir(dirPath, { recursive: true });
      const recentAudioFiles = filesInDir
        .filter(
          (file) => file.extension === '.mp3' || file.extension === '.wav'
        )
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 10);
      setRecentFiles(recentAudioFiles);
    } catch (error) {
      console.error('Failed to read directory:', error);
    }
  };

  return (
    <div className='dark:text-white'>
      <p>Base folder: {baseFolder}</p>
      <h2>Recent Audio Files:</h2>
      <ul>
        {recentFiles.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecentFiles;
