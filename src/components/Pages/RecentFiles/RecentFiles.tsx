import { RootState } from '@/redux/store';
import baseFolderWatcher from '@/utils/baseFolderWatcher';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import Files from './Files';
import NoBaseFolder from './NoBaseFolder';
import { RecentFilesProps } from './types';

const RecentFiles: React.FC<RecentFilesProps> = ({ setCurrentView }) => {
  // tauri-fs-watch
  baseFolderWatcher();

  // Redux State
  const { baseFolder, files, areFilesChecked, status } = useSelector(
    (state: RootState) => state.recentFiles
  );

  return (
    <div className='dark:text-white'>
      {!baseFolder ? (
        <NoBaseFolder setCurrentView={setCurrentView} />
      ) : (
        <Files recentFiles={files} areFilesChecked={areFilesChecked} />
      )}

      {!areFilesChecked && (
        <div className='flex justify-center items-center h-32'>
          {status === 'loading' ? (
            <Loader2 className='h-10 w-10 animate-spin' />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default RecentFiles;
