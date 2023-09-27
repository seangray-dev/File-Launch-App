import { Slider } from '@/components/ui/slider';
import { RootState } from '@/redux/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const ProgressSlider = () => {
	const isPlaying = useSelector((state) => state.currentFile.isPlaying);
	const duration = useSelector((state) => state.currentFile.duration);
	const [totalDuration, setTotalDuration] = useState(100); // in seconds
	const [currentTime, setCurrentTime] = useState(0); // in seconds

	const handlePlaybackChange = (value: number[]) => {
		// Update the audio playback position here
		// Assuming value is an array with one element
		setCurrentTime(value[0]);
	};

	return (
		<div className='w-full absolute top-0'>
			<Slider
				className='w-full'
				value={[currentTime]}
				min={0}
				max={totalDuration}
				step={1}
				onValueChange={handlePlaybackChange}
			/>
			{/* <div>
				<p>Is Playing: {isPlaying ? 'Yes' : 'No'}</p>
				<p>Duration: {duration !== null ? `${duration} seconds` : 'Unknown'}</p>
			</div> */}
		</div>
	);
};

export default ProgressSlider;
