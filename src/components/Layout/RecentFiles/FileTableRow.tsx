import { TableCell, TableRow } from '@/components/ui/table';
import { FileTableRowProps } from '@/types';
import { PauseIcon, PlayIcon } from 'lucide-react';

const FileTableRow: React.FC<FileTableRowProps> = ({
	file,
	idx,
	handlePlay,
	isPlaying,
	activeFileIndex,
	setHoveredRowIndex,
	hoveredRowIndex,
}) => {
	console.log(
		`Row ${idx} - isPlaying: ${isPlaying}, activeFileIndex: ${activeFileIndex}`
	);
	return (
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
						{isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
					</div>
				)}
			</TableCell>
			<TableCell className='flex items-center select-none cursor-default'>
				{file.name}
			</TableCell>
			<TableCell className='col-span-2 text-muted-foreground select-none cursor-default'>
				{file.parent}
			</TableCell>
		</TableRow>
	);
};

export default FileTableRow;
