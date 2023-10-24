import { fetchFiles } from '@/redux/features/recentFiles-slice';
import { AppDispatch, RootState } from '@/redux/store';
import { appConfigStore } from '@/utils/appConfigStore';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Files from './Files';
import NoBaseFolder from './NoBaseFolder';

const RecentFiles = () => {
	// Redux State
	const dispatch: AppDispatch = useDispatch();
	const { files, areFilesChecked, status } = useSelector(
		(state: RootState) => state.recentFiles
	);

	// Local State
	const [savedBaseFolder, setSavedBaseFolder] = useState<string | null>(null);

	useEffect(() => {
		const getAndDispatchFiles = async () => {
			// tauri-plugin-store
			const fetchedBaseFolder = await appConfigStore.get<string>('baseFolder');
			setSavedBaseFolder(fetchedBaseFolder);
			if (fetchedBaseFolder) {
				dispatch(fetchFiles(fetchedBaseFolder));
			}
		};

		getAndDispatchFiles();
	}, [dispatch]);

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
