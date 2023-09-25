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
import {
	playAudio,
	setCurrentFile,
	togglePlay,
} from '@/redux/features/currentFile-slice';
import { AppDispatch, RootState } from '@/redux/store';
import { FileObject } from '@/types';
import { invoke } from '@tauri-apps/api';
import { Loader2, PauseIcon, PlayIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const RecentFiles = () => {
	const dispatch: AppDispatch = useDispatch();
	const isPlaying = useSelector(
		(state: RootState) => state.currentFile.isPlaying
	);
	const activeFileIndex = useSelector(
		(state: RootState) => state.currentFile.activeFileIndex
	);

	const [baseFolder, setBaseFolder] = useState('');
	const [recentFiles, setRecentFiles] = useState<FileObject[]>([]);
	const [areFilesChecked, setAreFilesChecked] = useState(false);
	const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

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
			const files: FileObject[] = await invoke('scan_directory', {
				baseFolder,
			});
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

	const handlePlay = (idx: number = 0) => {
		if (activeFileIndex === idx) {
			dispatch(togglePlay());
		} else {
			const fileName = filteredFiles[idx].name;
			const filePath = filteredFiles[idx].path;
			dispatch(setCurrentFile({ activeFileIndex: idx, name: fileName }));

			// Use the Redux thunk instead of directly invoking
			dispatch(playAudio(filePath)).catch((err) =>
				console.error('Failed to play audio:', err)
			);

			if (!isPlaying) {
				dispatch(togglePlay());
			}
		}
	};

	const getFilteredFiles = () => {
		const currentTime = Math.floor(Date.now() / 1000);
		return recentFiles.filter((file) => {
			// Last Modified Filters
			const lastModified = parseInt(file.lastModified!, 10);

			if (lastModifiedFilters.oneDay && currentTime - lastModified > 86400)
				return false;
			if (lastModifiedFilters.threeDays && currentTime - lastModified > 259200)
				return false;
			if (lastModifiedFilters.sevenDays && currentTime - lastModified > 604800)
				return false;

			// File Type Filters
			const filterKeys = Object.keys(fileTypeFilters) as Array<
				keyof typeof fileTypeFilters
			>;

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
												{hoveredRowIndex === idx && activeFileIndex !== idx && (
													<div className='absolute left-3 top-0 bottom-0 flex items-center'>
														<PlayIcon size={18} />
													</div>
												)}
												{activeFileIndex === idx && (
													<div className='absolute left-3 top-0 bottom-0 flex items-center'>
														{isPlaying ? (
															<PauseIcon size={18} />
														) : (
															<PlayIcon size={18} />
														)}
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
