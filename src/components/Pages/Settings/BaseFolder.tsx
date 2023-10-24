import { Button } from '@/components/ui/button';
import { appConfigStore } from '@/utils/appConfigStore';
import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';

const BaseFolder = () => {
	const [baseFolder, setBaseFolder] = useState<string>('');

	useEffect(() => {
		const initializeData = async () => {
			// Load baseFolder from the store
			const initialBaseFolder = await appConfigStore.get('baseFolder');
			console.log(initialBaseFolder);
			if (typeof initialBaseFolder === 'string') {
				setBaseFolder(initialBaseFolder);
			} else {
				setBaseFolder('');
			}
		};
		initializeData();
	}, []);

	const selectDirectory = async () => {
		try {
			const result: string = await invoke('select_directory');
			if (result) {
				// Update the baseFolder in the store
				await appConfigStore.set('baseFolder', result);
				await appConfigStore.save();
				setBaseFolder(result);
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
