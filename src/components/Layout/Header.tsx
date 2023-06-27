import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { UserIcon } from '@heroicons/react/24/solid';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { BellIcon } from '@heroicons/react/24/solid';

const Header = ({ setCurrentView, logout }) => {
  return (
    <header className='p-4 border-b border-gray/10'>
      <ul className='flex gap-2 items-center justify-end'>
        <li className='relative search-input'>
          <span
            className='text-gray hover:text-white transition-all duration-300 cursor-pointer absolute top-2 left-3 w-6 search-icon'
            title='Settings'>
            <MagnifyingGlassIcon />
          </span>
          <input
            className='bg-transparent outline-none border border-gray rounded-full py-2 pl-12 pr-2 focus:border-white transition-all duration-300 text-white'
            type='text'
            placeholder='Search'
            title='Search'
          />
        </li>
        <li onClick={() => setCurrentView('UserProfile')}>
          <span
            className='text-gray hover:text-white transition-all duration-300 cursor-pointer'
            title='User Profile'>
            <UserIcon className='w-6' />
          </span>
        </li>
        <li onClick={() => setCurrentView('Settings')}>
          <span
            className='text-gray hover:text-white transition-all duration-300 cursor-pointer'
            title='Settings'>
            <Cog6ToothIcon className='w-6' />
          </span>
        </li>
        <li>
          <span
            className='text-gray hover:text-white transition-all duration-300 cursor-pointer'
            title='Notifications'>
            <BellIcon className='w-6' />
          </span>
        </li>
        <li onClick={logout}>
          <span
            className='text-gray hover:text-white transition-all duration-300 cursor-pointer'
            title='Logout'>
            <ArrowLeftOnRectangleIcon className='w-6' />
          </span>
        </li>
      </ul>
    </header>
  );
};

export default Header;
