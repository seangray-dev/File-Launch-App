import { AppDispatch } from '@/redux/store';
import { invoke } from '@tauri-apps/api';

export const playAudio = (path: String) => {
	return async (dispatch: AppDispatch) => {
		try {
			const result = await invoke('play_audio', { path });
			dispatch({ type: 'PLAY_AUDIO_SUCCESS', payload: result });
		} catch (err) {
			dispatch({ type: 'PLAY_AUDIO_FAILURE', payload: err });
		}
	};
};

export const pauseAudio = () => {
	return async (dispatch: AppDispatch) => {
		try {
			const result = await invoke('pause_audio');
			dispatch({ type: 'PAUSE_AUDIO_SUCCESS', payload: result });
		} catch (err) {
			dispatch({ type: 'PAUSE_AUDIO_FAILURE', payload: err });
		}
	};
};
