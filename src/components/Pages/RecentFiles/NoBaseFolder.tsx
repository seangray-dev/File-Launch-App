import { Button } from '@/components/ui/button';
import { NoBaseFolderProps } from './types';

const NoBaseFolder: React.FC<NoBaseFolderProps> = ({ setCurrentView }) => {
  const navigateToSettings = () => {
    setCurrentView('Settings');
  };

  return (
    <div className='flex flex-col justify-center items-center h-32 text-red-500'>
      <p>Please set a base folder to proceed.</p>
      <p>
        Go to Settings {'>'} Base Folder {'>'} Change Folder
      </p>
      <Button
        onClick={navigateToSettings}
        className='p-2 mt-4 bg-primary text-white rounded'>
        Go to Settings
      </Button>
    </div>
  );
};

export default NoBaseFolder;
