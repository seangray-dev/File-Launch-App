import { Button } from '@/components/ui/button';

const NoBaseFolder = ({ setCurrentView }) => {
  const navigateToSettings = () => {
    setCurrentView('Settings');
  };

  return (
    <div className='flex flex-col justify-center items-center h-32 text-red-500'>
      <p>Please set a base folder to proceed.</p>
      <p>
        Go to Settings {'>'} Base Folder {'>'} Change Folder
      </p>
      <Button onClick={navigateToSettings} className='p-2 mt-4'>
        Go to Settings
      </Button>
    </div>
  );
};

export default NoBaseFolder;
