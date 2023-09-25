import { FileObject } from '@/types';
import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';

export const useFetchFiles = (baseFolder: string) => {
	const [recentFiles, setRecentFiles] = useState<FileObject[]>([]);
	const [areFilesChecked, setAreFilesChecked] = useState(false);

	useEffect(() => {
		if (baseFolder) {
			fetchFiles(baseFolder, setRecentFiles, setAreFilesChecked);
		}
	}, [baseFolder]);

	return { recentFiles, areFilesChecked };
};

const fetchFiles = async (
	baseFolder: string,
	setRecentFiles: any,
	setAreFilesChecked: any
) => {
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
