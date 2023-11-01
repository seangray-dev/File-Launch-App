import BaseFolder from './BaseFolder';
import DefaultFilterDuration from './DefaultFilterDuration';
import Startup from './Startup';
import Theme from './Theme';

const Settings = () => {
  return (
    <div className='flex flex-col gap-10 p-4'>
      <h1 className='font-bold text-2xl'>Settings</h1>
      <div className='flex flex-col gap-10'>
        <Theme />
        <BaseFolder />
        <DefaultFilterDuration />
        <Startup />
      </div>
    </div>
  );
};

export default Settings;
