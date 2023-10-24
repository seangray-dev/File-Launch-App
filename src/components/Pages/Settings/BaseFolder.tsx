import { Button } from '@/components/ui/button';
import { setBaseFolder } from '@/redux/features/recentFiles-slice';
import { RootState } from '@/redux/store'; // Import RootState to type the state
import { appConfigStore } from '@/utils/appConfigStore';
import { invoke } from '@tauri-apps/api';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const BaseFolder = () => {
	// Redux State
	const dispatch = useDispatch();
	const baseFolder = useSelector(
		(state: RootState) => state.recentFiles.baseFolder
	);

	useEffect(() => {
		const initializeData = async () => {
			// tauri-plugin-store
			const initialBaseFolder = await appConfigStore.get('baseFolder');
			if (typeof initialBaseFolder === 'string') {
				dispatch(setBaseFolder(initialBaseFolder));
			} else {
				dispatch(setBaseFolder(''));
			}
		};
		initializeData();
	}, [dispatch]);

	const selectDirectory = async () => {
		try {
			const result: string = await invoke('select_directory');
			if (result) {
				dispatch(setBaseFolder(result));
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<section className='flex items-center gap-2 justify-between border-b border-b-gray pb-10'>
			<div className='flex flex-col gap-2'>
				<p className='text-xl'>Base Folder:</p>
				<p className='text-sm text-muted-foreground'>Set the working folder</p>
			</div>
			<div>
				{baseFolder ? (
					<span className='text-xs text-muted-foreground whitespace-wrap text-overflow-ellipsis max-w-[150px]'>
						{baseFolder}
					</span>
				) : (
					<span className='uppercase text-destructive whitespace-wrap text-overflow-ellipsis max-w-[150px]'>
						Error: No folder specified
					</span>
				)}
			</div>
			<Button onClick={selectDirectory}>Change Folder</Button>
		</section>
	);
};

export default BaseFolder;
