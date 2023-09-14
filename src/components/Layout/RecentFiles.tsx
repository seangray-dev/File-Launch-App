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
import { useEffect, useState } from 'react';

const RecentFiles = () => {
	const [baseFolder, setBaseFolder] = useState('');
	const [recentFiles, setRecentFiles] = useState([]);
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
			// loadRecentFiles(savedBaseFolder);
			fetchFiles();
		}
	}, [baseFolder]);

	const fetchFiles = async () => {
		try {
			const files = await invoke('scan_directory', { baseFolder });
			console.log('Files:', files);
			setRecentFiles(files);
		} catch (error) {
			console.error('Failed to scan directory:', error);
		}
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

			return true;
		});
	};

	const filteredFiles = getFilteredFiles();

	return (
		<div className='dark:text-white'>
			<Table>
				<TableHeader>
					<TableRow className='grid grid-cols-3'>
						<TableHead>File Name</TableHead>
						<TableHead>Client</TableHead>
						<TableHead className='text-right'>
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
					<TableBody>
						{filteredFiles.map((file, idx) => (
							<TableRow className='grid grid-cols-3' key={idx}>
								<TableCell>{file.name}</TableCell>
								<TableCell className='flex-grow text-muted-foreground'>
									{file.parent}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</TableHeader>
			</Table>
		</div>
	);
};

export default RecentFiles;
