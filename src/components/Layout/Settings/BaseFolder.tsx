import { Button } from '@/components/ui/button';
import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';
import ButtonMain from '../../Buttons/ButtonMain';

const BaseFolder = () => {
	const [baseFolder, setBaseFolder] = useState(() => {
		const savedBaseFolder = window.localStorage.getItem('baseFolder');
		return savedBaseFolder || '';
	});

	useEffect(() => {
		window.localStorage.setItem('baseFolder', baseFolder);
	}, [baseFolder]);

	const selectDirectory = async () => {
		try {
			const path = await invoke('select_directory');
			if (path) {
				setBaseFolder(path);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<section className='flex items-center gap-2 justify-between border-b border-b-gray pb-10'>
			<div className='flex flex-col gap-2'>
				<p className='text-xl'>Base Folder:</p>
				<p className='text-sm text-muted-foreground'>Set the working folder</p>
			</div>
			<div>
				<span className='text-xs text-muted-foreground whitespace-wrap text-overflow-ellipsis max-w-[150px]'>
					{baseFolder}
				</span>
			</div>
			<Button onClick={selectDirectory}>Change Folder</Button>
		</section>
	);
};

export default BaseFolder;
