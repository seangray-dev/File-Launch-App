import { setCurrentView } from '@/redux/features/navigation-slice';
import { AppDispatch } from '@/redux/store';
import {
  ChartBarSquareIcon,
  FolderOpenIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
setCurrentView;

const SideBar = () => {
  // Redux
  const dispatch: AppDispatch = useDispatch();

  const [isToolsMenuOpen, setToolsMenuOpen] = useState(false);

  const handleSetCurrentView = (view: string) => {
    dispatch(setCurrentView(view));
  };

  const handleToolMenuClick = () => {
    setToolsMenuOpen(!isToolsMenuOpen);
  };

  return (
    <div
      className='sticky top-0 border-r border-r-gray/10 p-4 pt-10 flex flex-col min-h-screen
		'>
      <img
        className='mx-auto mb-10 dark:hidden'
        src='/images/logo-no-background-light.png'
      />
      <img
        className='mx-auto mb-10 hidden dark:block'
        src='/images/logo-no-background.png'
      />

      <ul className='text-lg flex flex-col gap-6'>
        <li
          className='flex gap-2 hover:text-primary hover:cursor-pointer transition-all duration-300'
          onClick={() => handleSetCurrentView('Recent Files')}>
          <FolderOpenIcon className='w-6' />
          <span>Recent Files</span>
        </li>
        <li
          className='flex gap-2 hover:text-primary hover:cursor-pointer transition-all duration-300'
          onClick={() => handleSetCurrentView('Recipients')}>
          <UserGroupIcon className='w-6' />
          <span>Recipients</span>
        </li>
        <li className='flex flex-col gap-4'>
          <div className='flex gap-2 text-gray hover:text-primary hover:cursor-pointer transition-all duration-300'>
            <WrenchScrewdriverIcon className='w-6' />
            <span onClick={handleToolMenuClick}>Tools</span>
          </div>
          {isToolsMenuOpen && (
            <ul className='flex flex-col gap-2 text-gray'>
              <li
                className='pl-4 hover:text-primary hover:cursor-pointer transition-all duration-300'
                onClick={() => handleSetCurrentView('Format Files')}>
                Format Files
              </li>
              <li
                className='pl-4 hover:text-primary hover:cursor-pointer transition-all duration-300'
                onClick={() => handleSetCurrentView('Email Templates')}>
                Email Templates
              </li>
            </ul>
          )}
        </li>
        <li
          className='flex gap-2 text-gray hover:text-primary hover:cursor-pointer transition-all duration-300'
          onClick={() => handleSetCurrentView('Stats')}>
          <ChartBarSquareIcon className='w-6' />
          <span>Stats</span>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
