import { AudioSlider } from '@/components/ui/audioslider';
import {
	audioBuffer,
	audioContext,
	offsetTime,
	startTime,
	updatePlaybackPosition,
} from '@/redux/features/currentFile-slice';
import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const formatTime = (time: number) => {
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const ProgressSlider = () => {
	const dispatch = useDispatch();
	const isPlaying = useSelector(
		(state: RootState) => state.currentFile.isPlaying
	);
	const [totalDuration, setTotalDuration] = useState(0); // in seconds
	const [currentTime, setCurrentTime] = useState(0); // in seconds

	const updateTimeline = () => {
		const currentTimeCalculation =
			audioContext.currentTime - startTime + offsetTime;
		// console.log('Calculated currentTime: ', currentTimeCalculation);

		if (
			isPlaying &&
			audioContext &&
			typeof startTime !== 'undefined' &&
			currentTimeCalculation <= totalDuration
		) {
			setCurrentTime(currentTimeCalculation);
		}

		// Schedule the next frame
		requestAnimationFrame(updateTimeline);
	};

	useEffect(() => {
		if (audioBuffer) {
			setTotalDuration(audioBuffer.duration);
		}

		// Initialize the animation
		requestAnimationFrame(updateTimeline);

		return () => {};
	}, [isPlaying, totalDuration]);

	const handlePlaybackChange = (value: number[]) => {
		const newTime = value[0];
		setCurrentTime(newTime);
		dispatch(updatePlaybackPosition(newTime) as any);
	};

	return (
		<div className='w-full absolute top-0'>
			<AudioSlider
				className='w-full'
				value={[currentTime]}
				min={0}
				max={totalDuration}
				step={1}
				onValueChange={handlePlaybackChange}
			/>
			<div className='w-full pt-2 px-2 flex justify-between'>
				<div className='text-xs text-muted-foreground'>
					{formatTime(currentTime)}
				</div>
				<div className='text-xs text-muted-foreground'>
					{formatTime(totalDuration)}
				</div>
			</div>
		</div>
	);
};

export default ProgressSlider;
