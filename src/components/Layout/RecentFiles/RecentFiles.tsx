import { fetchFiles } from '@/redux/features/recentFiles-slice';
import { AppDispatch, RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Files from './Files';
import NoBaseFolder from './NoBaseFolder';

const RecentFiles = () => {
	const dispatch: AppDispatch = useDispatch();
	const savedBaseFolder = window.localStorage.getItem('baseFolder') || '';

	const { files, areFilesChecked, status } = useSelector(
		(state: RootState) => state.recentFiles
	);

	useEffect(() => {
		if (savedBaseFolder) {
			dispatch(fetchFiles(savedBaseFolder));
		}
	}, [savedBaseFolder, dispatch]);

	return (
		<div className='dark:text-white'>
			{!savedBaseFolder ? (
				<NoBaseFolder />
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
