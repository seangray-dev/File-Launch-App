import NoBaseFolderAlert from '@/components/NoBaseFolderAlert';
import { checkBaseFolderStatus } from '@/redux/features/baseFolderStatus-slice';
import { setCurrentView } from '@/redux/features/navigation-slice';
import { AppDispatch, RootState } from '@/redux/store';
import {
  ArrowLeftOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import { Cable, CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderIcon } from '../../ui/headericon';
import ShortcutsPopover from './ShortcutsPopover';

type HeaderProps = {
  signOut: () => void;
};

const Header = ({ signOut }: HeaderProps) => {
  // Redux
  const dispatch: AppDispatch = useDispatch();
  const { isAvailable } = useSelector(
    (state: RootState) => state.baseFolderStatus
  );

  // Local State
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    dispatch(checkBaseFolderStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isAvailable === false) {
      setIsAlertVisible(true);
    }
  }, [isAvailable]);

  const handleCloseAlert = () => {
    setIsAlertVisible(false);
  };

  const toggleAlertVisibility = () => {
    setIsAlertVisible((prevState) => !prevState);
  };

  const handleSetCurrentView = (view: string) => {
    dispatch(setCurrentView(view));
  };

  return (
    <header className='sticky top-0 pt-8 p-4 border-b border-gray/10 bg-background z-50'>
      <ul className='flex gap-2 items-center justify-end'>
        <HeaderIcon
          tooltipText={
            isAvailable === null
              ? 'Checking Base Folder Status...'
              : isAvailable
              ? 'Base Folder is available'
              : 'Base Folder is unavailable'
          }>
          <div className='relative' onClick={toggleAlertVisibility}>
            <Cable className='-mb-1' />
            {isAvailable === null ? null : isAvailable ? (
              <CheckCircle2
                color='#FFFFFF'
                size={14}
                className='absolute -bottom-1 -left-1 rounded-full bg-green-500'
              />
            ) : (
              <XCircle
                color='#FFFFFF'
                size={14}
                className='absolute -bottom-1 -left-1 rounded-full bg-destructive'
              />
            )}
          </div>
        </HeaderIcon>
        <HeaderIcon tooltipText='Keyboard Shortcuts'>
          <ShortcutsPopover />
        </HeaderIcon>
        <HeaderIcon
          tooltipText='Profile'
          onClick={() => handleSetCurrentView('User Profile')}>
          <UserIcon className='w-6 -mb-1' />
        </HeaderIcon>
        <HeaderIcon
          tooltipText='Settings'
          onClick={() => handleSetCurrentView('Settings')}>
          <Cog6ToothIcon className='w-6 -mb-1' />
        </HeaderIcon>
        <HeaderIcon tooltipText='Notifications'>
          <BellIcon className='w-6 -mb-1' />
        </HeaderIcon>
        <HeaderIcon tooltipText='Logout' onClick={signOut}>
          <ArrowLeftOnRectangleIcon className='w-6 -mb-1' />
        </HeaderIcon>
      </ul>
      {isAvailable === false && (
        <NoBaseFolderAlert isOpen={isAlertVisible} onClose={handleCloseAlert} />
      )}
    </header>
  );
};

export default Header;
