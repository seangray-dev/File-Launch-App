import {
  ArrowLeftOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import { Cable, CheckCircle2, XCircle } from 'lucide-react';
import { HeaderIcon } from '../../ui/headericon';
import ShortcutsPopover from './ShortcutsPopover';

type HeaderProps = {
  setCurrentView: (view: string) => void;
  logout: () => void;
};

const Header = ({ setCurrentView, logout }: HeaderProps) => {
  return (
    <header className='sticky top-0 pt-8 p-4 border-b border-gray/10 bg-background z-50'>
      <ul className='flex gap-2 items-center justify-end'>
        <HeaderIcon tooltipText='Base Folder Status'>
          <div className='relative'>
            <Cable className='-mb-1' />
            {/* <XCircle
              color='#FFFFFF'
              size={14}
              className='absolute -bottom-1 -left-1 rounded-full bg-destructive'
            /> */}
            <CheckCircle2
              color='#FFFFFF'
              size={14}
              className='absolute -bottom-1 -left-1 rounded-full bg-green-500'
            />
          </div>
        </HeaderIcon>
        <HeaderIcon tooltipText='Keyboard Shortcuts'>
          <ShortcutsPopover />
        </HeaderIcon>
        <HeaderIcon
          tooltipText='Profile'
          onClick={() => setCurrentView('User Profile')}>
          <UserIcon className='w-6 -mb-1' />
        </HeaderIcon>
        <HeaderIcon
          tooltipText='Settings'
          onClick={() => setCurrentView('Settings')}>
          <Cog6ToothIcon className='w-6 -mb-1' />
        </HeaderIcon>
        <HeaderIcon tooltipText='Notifications'>
          <BellIcon className='w-6 -mb-1' />
        </HeaderIcon>
        <HeaderIcon tooltipText='Logout' onClick={logout}>
          <ArrowLeftOnRectangleIcon className='w-6 -mb-1' />
        </HeaderIcon>
      </ul>
    </header>
  );
};

export default Header;
