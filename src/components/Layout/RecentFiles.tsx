import { fs } from '@tauri-apps/api';
import { useEffect, useState } from 'react';

const RecentFiles = () => {
	const [baseFolder, setBaseFolder] = useState('');
	const [recentFiles, setRecentFiles] = useState([]);

	useEffect(() => {
		const savedBaseFolder = window.localStorage.getItem('baseFolder');
		if (savedBaseFolder) {
			setBaseFolder(savedBaseFolder);
			// loadRecentFiles(savedBaseFolder);
		}
	}, []);

	// const checkWavFile = async (filePath) => {
	// 	const fileBuffer = await fs.readBinaryFile(filePath, {
	// 		chunk: { start: 0, end: 44 },
	// 	});
	// 	const dataView = new DataView(new Uint8Array(fileBuffer).buffer);
	// 	const numChannels = dataView.getUint16(22, true);
	// 	return numChannels === 2;
	// };

	// const audioContext = new AudioContext();

	// const loadRecentFiles = async (dirPath) => {
	// 	try {
	// 		const allFiles = await getAllFiles(dirPath);
	// 		const audioFiles = allFiles.filter(
	// 			(file) =>
	// 				!file.isDirectory &&
	// 				(file.name.endsWith('.mp3') || file.name.endsWith('.wav'))
	// 		);

	// 		const stereoFiles = [];

	// 		for (let audioFile of audioFiles) {
	// 			console.log('Reading file:', audioFile);

	// 			if (audioFile.name.endsWith('.wav')) {
	// 				const isStereo = await checkWavFile(audioFile.path);
	// 				if (isStereo) {
	// 					stereoFiles.push(audioFile);
	// 				}
	// 			} else {
	// 				const fileBuffer = await fs.readBinaryFile(audioFile.path);
	// 				const blob = new Blob([fileBuffer]);
	// 				const blobUrl = URL.createObjectURL(blob);

	// 				const audioData = await fetch(blobUrl).then((response) =>
	// 					response.arrayBuffer()
	// 				);
	// 				const decodedAudioData = await audioContext.decodeAudioData(
	// 					audioData
	// 				);

	// 				if (decodedAudioData.numberOfChannels === 2) {
	// 					stereoFiles.push(audioFile);
	// 				}

	// 				URL.revokeObjectURL(blobUrl);
	// 			}
	// 		}

	// 		console.log('Stereo Files:', stereoFiles);
	// 		setRecentFiles(stereoFiles);
	// 	} catch (error) {
	// 		console.error('Failed to read directory:', error);
	// 	}
	// };

	// const getAllFiles = async (dirPath, filesArr = []) => {
	// 	const files = await fs.readDir(dirPath);
	// 	for (let file of files) {
	// 		try {
	// 			filesArr = await getAllFiles(`${dirPath}/${file.name}`, filesArr);
	// 		} catch (error) {
	// 			// If not a directory, assume it's a file and add a flag.
	// 			file.isDirectory = false;
	// 			filesArr.push(file);
	// 		}
	// 	}
	// 	return filesArr;
	// };

	return (
		<div className='dark:text-white'>
			<p>Base folder: {baseFolder}</p>
			<h2>Recent Audio Files:</h2>
			{/* <ul className='flex flex-col gap-2'>
				{recentFiles.map((file, index) => (
					<li
						className='text-gray hover:text-white bg-gradient-to-r from-deepBlue py-1 px-2 cursor-pointer rounded-md'
						key={index}>
						{file.name}
					</li>
				))}
			</ul> */}
		</div>
	);
};

export default RecentFiles;
