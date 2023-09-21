import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { invoke } from '@tauri-apps/api';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { PauseIcon, PlayIcon } from 'lucide-react';

const RecentFiles = () => {
	const [baseFolder, setBaseFolder] = useState('');
	const [recentFiles, setRecentFiles] = useState([]);
	const [areFilesChecked, setAreFilesChecked] = useState(false);
	const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
	const [selectedRowIndex, setSelectedRowIndex] = useState(null);

	const clearAllFilters = () => {
		setLastModifiedFilters({
			oneDay: false,
			threeDays: false,
			sevenDays: false,
		});
		setFileTypeFilters({
			mp3: false,
			wav: false,
			mp4: false,
		});
	};

	const [lastModifiedFilters, setLastModifiedFilters] = useState({
		oneDay: false,
		threeDays: false,
		sevenDays: false,
	});

	const [fileTypeFilters, setFileTypeFilters] = useState({
		mp3: false,
		wav: false,
		mp4: false,
	});

	useEffect(() => {
		const savedBaseFolder = window.localStorage.getItem('baseFolder');
		if (savedBaseFolder) {
			setBaseFolder(savedBaseFolder);
			fetchFiles();
		}
	}, [baseFolder]);

	const fetchFiles = async () => {
		setAreFilesChecked(false);
		try {
			const files = await invoke('scan_directory', { baseFolder });
			for (const file of files) {
				if (file.path) {
					try {
						file.audioType = await invoke('check_audio_channels', {
							path: file.path,
						});
					} catch (error) {
						console.error(
							`Failed to check audio type for file ${file.path}:`,
							error
						);
						file.audioType = 'unknown';
					}
				} else {
					console.warn('Path is undefined for file:', file);
					file.audioType = 'unknown';
				}
			}
			setRecentFiles(files);
		} catch (error) {
			console.error('Failed to scan directory:', error);
		} finally {
			setAreFilesChecked(true);
		}
	};

	const handlePlay = (idx) => {
		if (selectedRowIndex === idx) {
			// Reset to show PlayIcon if clicked again
			setSelectedRowIndex(null);
		} else {
			// Set selected row index to show PauseIcon
			setSelectedRowIndex(idx);
		}
		// Incorporate playing the audio
	};

	const getFilteredFiles = () => {
		const currentTime = Math.floor(Date.now() / 1000);
		return recentFiles.filter((file) => {
			// Last Modified Filters
			const lastModified = parseInt(file.lastModified, 10);
			if (lastModifiedFilters.oneDay && currentTime - lastModified > 86400)
				return false;
			if (lastModifiedFilters.threeDays && currentTime - lastModified > 259200)
				return false;
			if (lastModifiedFilters.sevenDays && currentTime - lastModified > 604800)
				return false;

			// File Type Filters
			const filterKeys = Object.keys(fileTypeFilters);
			if (filterKeys.some((key) => fileTypeFilters[key])) {
				// If any fileType filter is active
				if (
					!filterKeys.some(
						(key) => fileTypeFilters[key] && file.fileType === key
					)
				)
					return false;
			}

			// only display stereo files
			if (file.audioType !== 'stereo') {
				return false;
			}

			return true;
		});
	};

	const filteredFiles = getFilteredFiles();

	return (
		<div className='dark:text-white'>
			{!baseFolder ? (
				<div className='flex flex-col justify-center items-center h-32 text-red-500'>
					<p>Please set a base folder to proceed.</p>
					<p>
						Go to Settings {'>'} Base Folder {'>'} Change Folder
					</p>
				</div>
			) : (
				<>
					<Table>
						<TableHeader>
							<TableRow className='grid grid-cols-[30px_1fr_1fr_100px]'>
								<TableHead></TableHead>
								<TableHead className='flex items-center'>File Name</TableHead>
								<TableHead className='flex items-center'>Client</TableHead>
								<TableHead className='flex items-center text-right'>
									<DropdownMenu>
										<DropdownMenuTrigger>Filters</DropdownMenuTrigger>
										<DropdownMenuContent className='w-56'>
											<DropdownMenuLabel>Last Modified</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuCheckboxItem
												checked={lastModifiedFilters.oneDay}
												onCheckedChange={() =>
													setLastModifiedFilters({
														...lastModifiedFilters,
														oneDay: !lastModifiedFilters.oneDay,
													})
												}>
												1 day
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={lastModifiedFilters.threeDays}
												onCheckedChange={() =>
													setLastModifiedFilters({
														...lastModifiedFilters,
														threeDays: !lastModifiedFilters.threeDays,
													})
												}>
												3 days
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={lastModifiedFilters.sevenDays}
												onCheckedChange={() =>
													setLastModifiedFilters({
														...lastModifiedFilters,
														sevenDays: !lastModifiedFilters.sevenDays,
													})
												}>
												7 days
											</DropdownMenuCheckboxItem>
											<DropdownMenuLabel>File Type</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuCheckboxItem
												checked={fileTypeFilters.mp3}
												onCheckedChange={() =>
													setFileTypeFilters({
														...fileTypeFilters,
														mp3: !fileTypeFilters.mp3,
													})
												}>
												.mp3
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={fileTypeFilters.wav}
												onCheckedChange={() =>
													setFileTypeFilters({
														...fileTypeFilters,
														wav: !fileTypeFilters.wav,
													})
												}>
												.wav
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={fileTypeFilters.mp4}
												onCheckedChange={() =>
													setFileTypeFilters({
														...fileTypeFilters,
														mp4: !fileTypeFilters.mp4,
													})
												}>
												.mp4
											</DropdownMenuCheckboxItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem onSelect={clearAllFilters}>
												Clear All Filters
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{areFilesChecked && filteredFiles.length > 0
								? filteredFiles.map((file, idx) => (
										<TableRow
											className='grid grid-cols-[30px_1fr_1fr_100px] relative'
											key={idx}
											onMouseEnter={() => setHoveredRowIndex(idx)}
											onMouseLeave={() => setHoveredRowIndex(null)}
											onClick={() => handlePlay(idx)}>
											<TableCell>
												{hoveredRowIndex === idx &&
													selectedRowIndex !== idx && (
														<div className='absolute left-3 top-0 bottom-0 flex items-center'>
															<PlayIcon size={18} />
														</div>
													)}
												{selectedRowIndex === idx && (
													<div className='absolute left-3 top-0 bottom-0 flex items-center'>
														<PauseIcon size={18} />
													</div>
												)}
											</TableCell>
											<TableCell className='flex items-center'>
												{file.name}
											</TableCell>
											<TableCell className='col-span-2 text-muted-foreground'>
												{file.parent}
											</TableCell>
										</TableRow>
								  ))
								: null}
						</TableBody>
					</Table>
					{!areFilesChecked ? (
						<div className='flex justify-center items-center h-32'>
							<Loader2 className='h-10 w-10 animate-spin' />
						</div>
					) : null}
				</>
			)}
		</div>
	);
};

export default RecentFiles;
