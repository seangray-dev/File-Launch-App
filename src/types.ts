export interface FileObject {
	path?: string;
	audioType?: string;
	name?: string;
	lastModified?: string;
	fileType?: string;
	parent?: string;
}

// Recent Files

export interface FilterDropdownProps {
	lastModifiedFilters: {
		oneDay: boolean;
		threeDays: boolean;
		sevenDays: boolean;
	};
	fileTypeFilters: {
		mp3: boolean;
		wav: boolean;
		mp4: boolean;
	};
	setLastModifiedFilters: React.Dispatch<
		React.SetStateAction<{
			oneDay: boolean;
			threeDays: boolean;
			sevenDays: boolean;
		}>
	>;
	setFileTypeFilters: React.Dispatch<
		React.SetStateAction<{
			mp3: boolean;
			wav: boolean;
			mp4: boolean;
		}>
	>;
	clearAllFilters: () => void;
}
export interface FileTableRowProps {
	file: FileObject;
	idx: number;
	handlePlay: (idx: number) => void;
	isPlaying: boolean;
	activeFileIndex: number | null;
	setHoveredRowIndex: (index: number | null) => void;
	hoveredRowIndex: number | null;
	loadingIdx: number | null;
}

export interface FilesProps {
	recentFiles: FileObject[];
	areFilesChecked: boolean;
}
