import { Slider } from '@/components/ui/slider';
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

const AudioPlayer = () => {
	const [volume, setVolume] = useState([50]);
	const [previousVolume, setPreviousVolume] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const handleVolumeChange = (value) => {
		setVolume(value);
	};

	const toggleMute = () => {
		if (volume[0] === 0 && previousVolume !== null) {
			setVolume([previousVolume]);
		} else {
			setPreviousVolume(volume[0]);
			setVolume([0]);
		}
	};

	const togglePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	let VolumeIcon;
	let volumeTitle;
	const currentVolume = volume[0];
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
		<section className='grid grid-cols-3 bg-secondary py-6 px-4 items-center'>
			<div>Current Track</div>
			<div className='flex items-center gap-4 justify-center'>
				<span title='Previous'>
					<SkipBackIcon
						className='text-white-muted hover:text-white duration-300 transition-color'
						size={20}
					/>
				</span>
				<span
					className='hover:scale-105 hover:text-white-muted transition-all duration-300'
					title={playPauseTitle}>
					{PlayPauseIcon}
				</span>
				<span title='Next'>
					<SkipForwardIcon
						className='text-white-muted hover:text-white duration-300 transition-color'
						size={20}
					/>
				</span>
			</div>
			<div className='flex gap-2 justify-end'>
				<span
					className='text-white-muted hover:text-white duration-300 transition-colors'
					title={volumeTitle}>
					{VolumeIcon}
				</span>
				<Slider
					className='w-1/2'
					value={volume}
					min={0}
					max={100}
					step={1}
					onValueChange={handleVolumeChange}
				/>
			</div>
		</section>
	);
};

export default AudioPlayer;
