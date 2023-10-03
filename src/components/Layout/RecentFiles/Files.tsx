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
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FileTableRow from './FileTableRow';
import { FilterDropdown } from './FilterDropdown';
import { useFileFilters } from './useFileFilters';

const Files: React.FC<FilesProps> = ({ recentFiles, areFilesChecked }) => {
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
	dispatch(setFilteredFiles(filteredFiles));

	const handlePlay = async (idx: number) => {
		if (activeFileIndex === idx) {
			if (isPlaying) {
				dispatch(pauseAudio()).catch((err) =>
					console.error('Failed to pause audio:', err)
				);
			} else {
				dispatch(playAudio()).catch((err) =>
					console.error('Failed to play audio:', err)
				);
			}
		} else {
			const fileName = filteredFiles[idx].name;
			const filePath = filteredFiles[idx].path;

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
							/>
					  ))
					: null}
			</TableBody>
		</Table>
	);
};

export default Files;
