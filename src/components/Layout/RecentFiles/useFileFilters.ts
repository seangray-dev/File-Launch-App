import { useMemo, useState } from 'react';

export const useFileFilters = (recentFiles: Array<any>) => {
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

	const filteredFiles = useMemo(() => {
		const currentTime = Math.floor(Date.now() / 1000);
		return recentFiles.filter((file) => {
			const lastModified = parseInt(file.lastModified!, 10);

			if (lastModifiedFilters.oneDay && currentTime - lastModified > 86400)
				return false;
			if (lastModifiedFilters.threeDays && currentTime - lastModified > 259200)
				return false;
			if (lastModifiedFilters.sevenDays && currentTime - lastModified > 604800)
				return false;

			const filterKeys = Object.keys(fileTypeFilters) as Array<
				keyof typeof fileTypeFilters
			>;

			if (filterKeys.some((key) => fileTypeFilters[key])) {
				if (
					!filterKeys.some(
						(key) => fileTypeFilters[key] && file.fileType === key
					)
				)
					return false;
			}

			if (file.audioType !== 'stereo') {
				return false;
			}

			return true;
		});
	}, [recentFiles, lastModifiedFilters, fileTypeFilters]);

	return {
		lastModifiedFilters,
		fileTypeFilters,
		setLastModifiedFilters,
		setFileTypeFilters,
		clearAllFilters,
		filteredFiles,
		getFilteredFiles: filteredFiles,
	};
};
