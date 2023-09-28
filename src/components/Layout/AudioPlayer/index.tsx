import { Slider } from '@/components/ui/slider';
import { togglePlay, updateVolume } from '@/redux/features/currentFile-slice';
import { AppDispatch, RootState } from '@/redux/store';
import { invoke } from '@tauri-apps/api';
import {
	PauseCircleIcon,
	PlayCircleIcon,
	SkipBackIcon,
	SkipForwardIcon,
	Volume1Icon,
	Volume2Icon,
	VolumeXIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProgressSlider from './ProgressSlider';

const AudioPlayer = () => {
	const dispatch: AppDispatch = useDispatch();
	const currentFileName = useSelector(
		(state: RootState) => state.currentFile.name
	);
	const [volume, setVolume] = useState(50);
	const [previousVolume, setPreviousVolume] = useState<number | null>(null);
	const { isPlaying } = useSelector((state: RootState) => state.currentFile);

	const handleVolumeChange = (value: number[]) => {
		console.log('Slider value: ', value);
		const newVolume = value[0];
		setVolume(newVolume);
		dispatch(updateVolume(newVolume));
	};

	const toggleMute = () => {
		if (volume === 0 && previousVolume !== null) {
			// Unmute
			setVolume(previousVolume);
			dispatch(updateVolume(previousVolume));
		} else {
			// Mute
			setPreviousVolume(volume);
			setVolume(0);
			dispatch(updateVolume(0));
		}
	};

	const togglePlayPause = () => {
		dispatch(togglePlay());
		invoke('play_audio', { path: currentFileName }).catch((err) =>
			console.error('Failed to play audio:', err)
		);
	};

	let VolumeIcon;
	let volumeTitle;
	const currentVolume = volume;
	if (currentVolume === 0) {
		VolumeIcon = <VolumeXIcon size={28} onClick={toggleMute} />;
		volumeTitle = 'Unmute';
	} else if (currentVolume < 50) {
		VolumeIcon = <Volume1Icon size={28} onClick={toggleMute} />;
		volumeTitle = 'Mute';
	} else {
		VolumeIcon = <Volume2Icon size={28} onClick={toggleMute} />;
		volumeTitle = 'Mute';
	}

	const PlayPauseIcon = isPlaying ? (
		<PauseCircleIcon size={32} onClick={togglePlayPause} />
	) : (
		<PlayCircleIcon size={32} onClick={togglePlayPause} />
	);

	const playPauseTitle = isPlaying ? 'Pause' : 'Play';

	return (
		<section className='bg-secondary py-6 relative'>
			<ProgressSlider />
			<div className='grid grid-cols-3 mt-6 px-2 items-center'>
				<div className='text-sm cursor-default select-none'>
					{currentFileName}
				</div>
				<div className='flex items-center gap-4 justify-center'>
					<span title='Previous'>
						<SkipBackIcon
							className='dark:text-white-muted dark:hover:text-white text-black-muted hover:text-black duration-300 transition-colors'
							size={20}
						/>
					</span>
					<span
						className='hover:scale-105 dark:text-white-muted dark:hover:text-white text-black-muted hover:text-black duration-300 transition-all'
						title={playPauseTitle}>
						{PlayPauseIcon}
					</span>
					<span title='Next'>
						<SkipForwardIcon
							className='dark:text-white-muted dark:hover:text-white text-black-muted hover:text-black duration-300 transition-colors'
							size={20}
						/>
					</span>
				</div>
				<div className='flex gap-2 justify-end'>
					<span
						className='text-black-muted hover:text-black dark:text-white-muted dark:hover:text-white duration-300 transition-colors'
						title={volumeTitle}>
						{VolumeIcon}
					</span>
					<Slider
						className='w-1/2'
						value={[volume]}
						min={0}
						max={100}
						step={1}
						onValueChange={handleVolumeChange}
					/>
				</div>
			</div>
		</section>
	);
};

export default AudioPlayer;
