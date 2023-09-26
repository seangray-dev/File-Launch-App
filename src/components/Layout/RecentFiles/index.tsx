import { Loader2 } from 'lucide-react';
import Files from './Files';
import NoBaseFolder from './NoBaseFolder';
import { useFetchFiles } from './useFetchFiles';

const RecentFiles = () => {
	const savedBaseFolder = window.localStorage.getItem('baseFolder') || '';
	const { areFilesChecked, recentFiles } = useFetchFiles(savedBaseFolder);

	return (
		<div className='dark:text-white'>
			{!savedBaseFolder ? (
				<NoBaseFolder />
			) : (
				<Files recentFiles={recentFiles} areFilesChecked={areFilesChecked} />
			)}

			{!areFilesChecked && (
				<div className='flex justify-center items-center h-32'>
					<Loader2 className='h-10 w-10 animate-spin' />
				</div>
			)}
		</div>
	);
};

export default RecentFiles;
