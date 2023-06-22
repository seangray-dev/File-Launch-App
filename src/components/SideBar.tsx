import { useState } from 'react';
import { FolderOpenIcon } from '@heroicons/react/24/solid';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

export const SideBar = () => {
  const [isToolsMenuOpen, setToolsMenuOpen] = useState(false);

  const handleToolMenuClick = () => {
    setToolsMenuOpen(!isToolsMenuOpen);
  };

  return (
    <section className='border-r border-r-gray/10 p-4 pt-8 min-h-screen flex flex-col'>
      <img className='mx-auto mb-10' src='/images/logo-no-background.png' />
      <h2 className='font-bold mb-10 text-white'>Dashboard</h2>
      <ul className='flex flex-col gap-6'>
        <li className='flex gap-2 text-gray hover:text-white hover:cursor-pointer transition-all duration-300'>
          <FolderOpenIcon className='w-6' />
          <span>Recent Files</span>
        </li>
        <li className='flex gap-2 text-gray hover:text-white hover:cursor-pointer transition-all duration-300'>
          <UserGroupIcon className='w-6' />
          <span>Clients</span>
        </li>
        <li className='flex flex-col gap-4'>
          <div className='flex gap-2 text-gray hover:text-white hover:cursor-pointer transition-all duration-300'>
            <WrenchScrewdriverIcon className='w-6' />
            <span onClick={handleToolMenuClick}>Tools</span>
          </div>
          {isToolsMenuOpen && (
            <ul className='flex flex-col gap-2 text-gray'>
              <li className='pl-4 hover:text-white hover:cursor-pointer transition-all duration-300'>
                Format Files
              </li>
              <li className='pl-4 hover:text-white hover:cursor-pointer transition-all duration-300'>
                Email Templates
              </li>
            </ul>
          )}
        </li>
      </ul>
    </section>
  );
};
