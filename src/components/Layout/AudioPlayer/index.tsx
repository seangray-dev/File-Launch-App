import { Slider } from '@/components/ui/slider';
import { TooltipIcon } from '@/components/ui/tooltipicon';
import {
	pauseAudio,
	playAudio,
	restartAudio,
	updateVolume,
} from '@/redux/features/currentFile-slice';
import { AppDispatch, RootState } from '@/redux/store';

import {
	audioSource,
	nextTrack,
	prevTrack,
	skipAhead,
	skipBack,
	toggleRepeat,
} from '@/redux/features/currentFile-slice';
import {
	PauseCircleIcon,
	PlayCircleIcon,
	Repeat,
	RotateCcw,
	RotateCw,
	SkipBackIcon,
	SkipForwardIcon,
	Volume1Icon,
	Volume2Icon,
	VolumeXIcon,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProgressSlider from './ProgressSlider';

const AudioPlayer = () => {
	// Redux State
	const dispatch: AppDispatch = useDispatch();
	const currentFileName = useSelector(
		(state: RootState) => state.currentFile.name
	);
	const { isPlaying, isRepeating } = useSelector(
		(state: RootState) => state.currentFile
	);

	// Local State
	const [volume, setVolume] = useState(50);
	const [previousVolume, setPreviousVolume] = useState<number | null>(null);

	// Hooks
	useEffect(() => {
		// When the audio ends, if repeat is enabled, play it again
		if (audioSource) {
			audioSource.onended = () => {
				if (isRepeating) {
					dispatch(playAudio());
				}
			};
		}
	}, [isRepeating, dispatch]);

	// Functions
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
	};

	const handlePrevTrack = () => {
		dispatch(prevTrack());
	};

	const handleToggleRepeat = () => {
		dispatch(toggleRepeat());
	};

	const VOLUME_THRESHOLD = 50;

	const getVolumeIcon = () => {
		if (volume === 0) {
			return (
				<TooltipIcon tooltipText='Unmute'>
					<VolumeXIcon className='-mb-1' size={24} onClick={toggleMute} />
				</TooltipIcon>
			);
		}
		if (volume < VOLUME_THRESHOLD) {
			return (
				<TooltipIcon tooltipText='Mute'>
					<Volume1Icon className='-mb-1' size={24} onClick={toggleMute} />
				</TooltipIcon>
			);
		}
		return (
			<TooltipIcon tooltipText='Mute'>
				<Volume2Icon className='-mb-1' size={24} onClick={toggleMute} />
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

	// Keyboard event handler
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			switch (e.code) {
				case 'Enter': // Go back to beginning of track
					dispatch(restartAudio());
					break;
				case 'Space': // Play/Pause
					e.preventDefault(); // Prevent scrolling
					togglePlayPause();
					break;
				case 'ArrowRight': // Skip ahead
					dispatch(skipAhead());
					break;
				case 'ArrowLeft': // Skip back
					dispatch(skipBack());
					break;
				case 'ArrowUp': // Play previous track
					handlePrevTrack();
					break;
				case 'ArrowDown': // Play next track
					handleNextTrack();
					break;
				case 'KeyM': // Toggle mute
					toggleMute();
					break;
				case 'KeyR': // Toggle repeat
					handleToggleRepeat();
					break;
				case 'Equal': // Increase volume ('+' key without shift)
				case 'NumpadAdd': // Increase volume (Numpad '+')
					if (volume < 100) {
						const newVolume = Math.min(volume + 5, 100);
						setVolume(newVolume);
						dispatch(updateVolume(newVolume));
					}
					break;
				case 'Minus': // Decrease volume ('-' key)
				case 'NumpadSubtract': // Decrease volume (Numpad '-')
					if (volume > 0) {
						const newVolume = Math.max(volume - 5, 0);
						setVolume(newVolume);
						dispatch(updateVolume(newVolume));
					}
					break;
				default:
					break;
			}
		},
		[
			togglePlayPause,
			handleNextTrack,
			handlePrevTrack,
			toggleMute,
			handleToggleRepeat,
			volume,
			dispatch,
		]
	);

	useEffect(() => {
		// Attach the event listener
		window.addEventListener('keydown', handleKeyDown);

		// Detach the event listener on unmount
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	return (
		<section className='bg-secondary py-6 relative'>
			<ProgressSlider />
			<div className='grid grid-cols-3 mt-6 px-2 items-center'>
				<div className='text-xs cursor-default select-none'>
					{currentFileName}
				</div>
				<div className='flex items-center gap-3 justify-center'>
					<TooltipIcon tooltipText='Skip Back 15 Seconds'>
						<RotateCcw
							className='dark:text-white-muted dark:hover:text-white text-black-muted hover:text-black duration-300 transition-colors mb-1'
							size={18}
							onClick={() => dispatch(skipBack())}
						/>
					</TooltipIcon>
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
					<TooltipIcon tooltipText='Skip Ahead 15 Seconds'>
						<RotateCw
							className='dark:text-white-muted dark:hover:text-white text-black-muted hover:text-black duration-300 transition-colors mb-1'
							size={18}
							onClick={() => dispatch(skipAhead())}
						/>
					</TooltipIcon>
					<TooltipIcon tooltipText='Repeat'>
						<Repeat
							className={`dark:hover:text-white text-black-muted hover:text-black duration-300 transition-colors mb-1 ${
								isRepeating
									? 'text-primary'
									: 'dark:text-white-muted text-black-muted'
							}`}
							size={18}
							onClick={handleToggleRepeat}
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
