import {
	Table,
	TableBody,
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
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FileTableRow from './FileTableRow';
import { FilterDropdown } from './FilterDropdown';
import { useFetchFiles } from './useFetchFiles';
import { useFileFilters } from './useFileFilters';

const Files = () => {
	const savedBaseFolder = window.localStorage.getItem('baseFolder') || '';
	const { recentFiles, areFilesChecked } = useFetchFiles(savedBaseFolder);
	const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
	const {
		lastModifiedFilters,
		fileTypeFilters,
		setLastModifiedFilters,
		setFileTypeFilters,
		clearAllFilters,
		filteredFiles,
	} = useFileFilters(recentFiles);
	const isPlaying = useSelector(
		(state: RootState) => state.currentFile.isPlaying
	);
	const activeFileIndex = useSelector(
		(state: RootState) => state.currentFile.activeFileIndex
	);
	const dispatch: AppDispatch = useDispatch();

	const handlePlay = (idx: number = 0) => {
		if (activeFileIndex === idx) {
			dispatch(togglePlay());
		} else {
			const fileName = filteredFiles[idx].name;
			const filePath = filteredFiles[idx].path;
			dispatch(setCurrentFile({ activeFileIndex: idx, name: fileName }));

			// Use the Redux thunk instead of directly invoking
			// Unsure of this error here...
			// Expected 0 arguments, but got 1.
			dispatch(playAudio(filePath)).catch((err) =>
				console.error('Failed to play audio:', err)
			);

			if (!isPlaying) {
				dispatch(togglePlay());
			}
		}
	};

	return (
		<Table>
			<TableHeader>
				<TableRow className='grid grid-cols-[30px_1fr_1fr_100px]'>
					<TableHead></TableHead>
					<TableHead className='flex items-center'>File Name</TableHead>
					<TableHead className='flex items-center'>Client</TableHead>
					<TableHead className='flex items-center text-right'>
						<FilterDropdown
							lastModifiedFilters={lastModifiedFilters}
							fileTypeFilters={fileTypeFilters}
							setLastModifiedFilters={setLastModifiedFilters}
							setFileTypeFilters={setFileTypeFilters}
							clearAllFilters={clearAllFilters}
						/>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{areFilesChecked && filteredFiles.length > 0
					? filteredFiles.map((file, idx) => (
							<FileTableRow
								file={file}
								idx={idx}
								handlePlay={handlePlay}
								isPlaying={isPlaying}
								activeFileIndex={activeFileIndex}
								setHoveredRowIndex={setHoveredRowIndex}
								hoveredRowIndex={hoveredRowIndex}
							/>
					  ))
					: null}
			</TableBody>
		</Table>
	);
};

export default Files;
