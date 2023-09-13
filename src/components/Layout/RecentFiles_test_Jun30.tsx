import React, { useState, useEffect } from 'react';
import { fs } from '@tauri-apps/api';
import { join } from 'path';

const RecentFiles = () => {
  const [baseFolder, setBaseFolder] = useState('');
  const [recentFiles, setRecentFiles] = useState([]);

  useEffect(() => {
    const savedBaseFolder = window.localStorage.getItem('baseFolder');
    if (savedBaseFolder) {
      setBaseFolder(savedBaseFolder);
      // load the files when baseFolder is set
      console.log('Loaded base folder', savedBaseFolder);
      loadRecentFiles(savedBaseFolder);
    }
  }, []);

  const loadRecentFiles = async (dirPath) => {
    try {
      console.log('Loading recent files from:', dirPath);
      const allFiles = await getAllFiles(dirPath);
      console.log('All files:', allFiles);
      // Filter the files by .mp3 and .wav extensions
      const audioFiles = allFiles.filter(
        (file) => file.name.endsWith('.mp3') || file.name.endsWith('.wav')
      );
      console.log('Audio files:', audioFiles);
      // Check if each audio file is a stereo audio file
      const stereoAudioFiles = [];
      for (let file of audioFiles) {
        console.log('Checking if file is stereo audio:', file.name);
        const isStereo = await isStereoAudio(file.blobUrl);
        console.log('Is stereo audio:', isStereo);
        if (isStereo) {
          stereoAudioFiles.push(file);
        }
      }
      console.log('Stereo audio files:', stereoAudioFiles);
      setRecentFiles(stereoAudioFiles);
    } catch (error) {
      console.error('Failed to read directory:', error);
    }
  };

  const getAllFiles = async (dirPath, filesArr = []) => {
    console.log('Reading directory:', dirPath);
    const files = await fs.readDir(dirPath);
    console.log('Files in directory:', files);
    for (let file of files) {
      if (file.children === null) {
        const fileBuffer = await fs.readBinaryFile(file.path);
        console.log('fileBuffer', fileBuffer);
        const blob = new Blob([fileBuffer]);
        const blobUrl = URL.createObjectURL(blob);
        filesArr.push({ ...file, blobUrl });
      } else {
        filesArr = await getAllFiles(`${dirPath}/${file.name}`, filesArr);
      }
    }
    return filesArr;
  };

  const isStereoAudio = async (blobUrl) => {
    console.log('Checking if blob URL is stereo audio:', blobUrl);
    const audioContext = new AudioContext();
    const response = await fetch(blobUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const isStereo = audioBuffer.numberOfChannels === 2;
    console.log('Is stereo audio:', isStereo);
    return isStereo;
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
