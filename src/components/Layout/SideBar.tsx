import { useState } from 'react';
import { FolderOpenIcon } from '@heroicons/react/24/solid';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

const SideBar = ({ setCurrentView }) => {
  const [isToolsMenuOpen, setToolsMenuOpen] = useState(false);

  const handleToolMenuClick = () => {
    setToolsMenuOpen(!isToolsMenuOpen);
  };

  return (
    <section className='border-r border-r-gray/10 p-4 pt-8 min-h-screen flex flex-col'>
      <img
        className='mx-auto mb-10 dark:hidden'
        src='/images/logo-no-background-light.png'
      />
      <img
        className='mx-auto mb-10 hidden dark:block'
        src='/images/logo-no-background.png'
      />

      <ul className='flex flex-col gap-6'>
        <li
          className='flex gap-2 text-gray hover:text-cyan hover:cursor-pointer transition-all duration-300'
          onClick={() => setCurrentView('Recent Files')}>
          <FolderOpenIcon className='w-6' />
          <span>Recent Files</span>
        </li>
        <li
          className='flex gap-2 text-gray hover:text-cyan hover:cursor-pointer transition-all duration-300'
          onClick={() => setCurrentView('Clients')}>
          <UserGroupIcon className='w-6' />
          <span>Clients</span>
        </li>
        <li className='flex flex-col gap-4'>
          <div className='flex gap-2 text-gray hover:text-cyan hover:cursor-pointer transition-all duration-300'>
            <WrenchScrewdriverIcon className='w-6' />
            <span onClick={handleToolMenuClick}>Tools</span>
          </div>
          {isToolsMenuOpen && (
            <ul className='flex flex-col gap-2 text-gray'>
              <li
                className='pl-4 hover:text-cyan hover:cursor-pointer transition-all duration-300'
                onClick={() => setCurrentView('Format Files')}>
                Format Files
              </li>
              <li
                className='pl-4 hover:text-cyan hover:cursor-pointer transition-all duration-300'
                onClick={() => setCurrentView('Email Templates')}>
                Email Templates
              </li>
            </ul>
          )}
        </li>
      </ul>
    </section>
  );
};

export default SideBar;
