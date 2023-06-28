import Theme from './Theme';
import BaseFolder from './BaseFolder';
import Startup from './Startup';

const Settings = () => {
  return (
    <div className='flex flex-col gap-10'>
      <h1 className='font-bold text-2xl text-darkBlue dark:text-white'>
        Settings
      </h1>
      <div className='flex flex-col gap-10'>
        <Theme />
        <BaseFolder />
        <Startup />
      </div>
    </div>
  );
};

export default Settings;
