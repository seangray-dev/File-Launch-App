import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	loadAudio,
	pauseAudio,
	playAudio,
	setCurrentFile,
	setFilteredFiles,
} from '@/redux/features/currentFile-slice';
import { AppDispatch, RootState } from '@/redux/store';
import { FilesProps } from '@/types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FileTableRow from './FileTableRow';
import { FilterDropdown } from './FilterDropdown';
import { useFileFilters } from './useFileFilters';

const Files: React.FC<FilesProps> = ({ recentFiles, areFilesChecked }) => {
	const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
	const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
	const [lastActiveFileIndex, setLastActiveFileIndex] = useState<number | null>(
		null
	);

	const {
		lastModifiedFilters,
		fileTypeFilters,
		setLastModifiedFilters,
		setFileTypeFilters,
		clearAllFilters,
		filteredFiles,
	} = useFileFilters(recentFiles);

	// Redux State
	const dispatch: AppDispatch = useDispatch();
	dispatch(setFilteredFiles(filteredFiles));

	const isPlaying = useSelector(
		(state: RootState) => state.currentFile.isPlaying
	);

	const activeFileIndex = useSelector(
		(state: RootState) => state.currentFile.activeFileIndex
	);

	// Functions
	const handlePlay = async (idx: number) => {
		// If we click on the same file that's already selected
		if (activeFileIndex === idx) {
			if (isPlaying) {
				dispatch(pauseAudio()).catch((err) =>
					console.error('Failed to pause audio:', err)
				);
				// Reset the loader when pausing the audio
				setLoadingIdx(null);
			} else {
				dispatch(playAudio()).catch((err) =>
					console.error('Failed to play audio:', err)
				);
			}
		} else {
			// Set the loader only when trying to play a different file
			setLoadingIdx(idx);

			const fileName = filteredFiles[idx].name;
			const filePath = filteredFiles[idx].path;

			// Update lastActiveFileIndex before loading a new file
			setLastActiveFileIndex(activeFileIndex);

			// Load the new audio file
			try {
				await dispatch(loadAudio(filePath));
			} catch (error) {
				console.error('Failed to load audio:', error);
				return;
			}

			dispatch(setCurrentFile({ activeFileIndex: idx, name: fileName }));

			dispatch(playAudio()).catch((err) =>
				console.error('Failed to play audio:', err)
			);
		}
	};

	useEffect(() => {
		if (isPlaying && activeFileIndex !== lastActiveFileIndex) {
			setLoadingIdx(null);
		}
	}, [isPlaying, activeFileIndex, lastActiveFileIndex]);

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
								key={idx}
								file={file}
								idx={idx}
								handlePlay={handlePlay}
								isPlaying={isPlaying}
								activeFileIndex={activeFileIndex}
								setHoveredRowIndex={setHoveredRowIndex}
								hoveredRowIndex={hoveredRowIndex}
								loadingIdx={loadingIdx}
							/>
					  ))
					: null}
			</TableBody>
		</Table>
	);
};

export default Files;
