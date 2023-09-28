import { invoke } from '@tauri-apps/api';

// Blob cache
export const blobCache: { [key: string]: Blob } = {};

// Function to fetch a local file
export const fetchLocalFile = async (path: string) => {
	const arrayBuffer = new Uint8Array(await invoke('load_audio_file', { path }));
	const blob = new Blob([arrayBuffer.buffer], { type: 'audio/mpeg' });
	return blob;
};
