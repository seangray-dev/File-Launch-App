import { Slider } from '@/components/ui/slider';
import { TooltipIcon } from '@/components/ui/tooltipicon';
import {
	pauseAudio,
	playAudio,
	updateVolume,
} from '@/redux/features/currentFile-slice';
import { AppDispatch, RootState } from '@/redux/store';

import { nextTrack, prevTrack } from '@/redux/features/currentFile-slice';
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

	const togglePlayPause = async () => {
		if (isPlaying) {
			await dispatch(pauseAudio());
		} else {
			await dispatch(playAudio());
		}
	};

	const handleNextTrack = () => {
		dispatch(nextTrack());
		// Auto-play logic here
	};

	const handlePrevTrack = () => {
		dispatch(prevTrack());
		// Auto-play logic here
	};

	const VOLUME_THRESHOLD = 50;

	const getVolumeIcon = () => {
		if (volume === 0) {
			return (
				<TooltipIcon tooltipText='Unmute'>
					<VolumeXIcon className='-mb-1' size={28} onClick={toggleMute} />
				</TooltipIcon>
			);
		}
		if (volume < VOLUME_THRESHOLD) {
			return (
				<TooltipIcon tooltipText='Mute'>
					<Volume1Icon className='-mb-1' size={28} onClick={toggleMute} />
				</TooltipIcon>
			);
		}
		return (
			<TooltipIcon tooltipText='Mute'>
				<Volume2Icon className='-mb-1' size={28} onClick={toggleMute} />
			</TooltipIcon>
		);
	};

	const getPlayPauseIcon = () => {
		return isPlaying ? (
			<TooltipIcon tooltipText='Pause'>
				<PauseCircleIcon size={32} onClick={togglePlayPause} />
			</TooltipIcon>
		) : (
			<TooltipIcon tooltipText='Play'>
				<PlayCircleIcon size={32} onClick={togglePlayPause} />
			</TooltipIcon>
		);
	};

	return (
		<section className='bg-secondary py-6 relative'>
			<ProgressSlider />
			<div className='grid grid-cols-3 mt-6 px-2 items-center'>
				<div className='text-sm cursor-default select-none'>
					{currentFileName}
				</div>
				<div className='flex items-center gap-4 justify-center'>
					<TooltipIcon tooltipText='Previous'>
						<SkipBackIcon
							className='dark:text-white-muted dark:hover:text-white text-black-muted hover:text-black duration-300 transition-colors mb-1'
							size={20}
							onClick={handlePrevTrack}
						/>
					</TooltipIcon>
					<span className='hover:scale-105 dark:text-white-muted dark:hover:text-white text-black-muted hover:text-black duration-300 transition-all'>
						{getPlayPauseIcon()}
					</span>
					<TooltipIcon tooltipText='Next'>
						<SkipForwardIcon
							className='dark:text-white-muted dark:hover:text-white text-black-muted hover:text-black duration-300 transition-colors mb-1'
							size={20}
							onClick={handleNextTrack}
						/>
					</TooltipIcon>
				</div>
				<div className='flex gap-2 justify-end'>
					<span className='text-black-muted hover:text-black dark:text-white-muted dark:hover:text-white duration-300 transition-colors'>
						{getVolumeIcon()}
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
