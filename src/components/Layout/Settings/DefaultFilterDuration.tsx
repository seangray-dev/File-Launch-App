import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

export default function DefaultFilterDuration() {
	const durations = [
		'None',
		'1 day',
		'3 days',
		'5 days',
		'7 days',
		'14 days',
		'30 days',
	];
	const [selectedDuration, setSelectedDuration] = useState(() => {
		const savedDuration = window.localStorage.getItem('fileFilterDuration');
		return savedDuration ? savedDuration : durations[3]; // default to 30 days
	});

	useEffect(() => {
		window.localStorage.setItem('fileFilterDuration', selectedDuration);
		// call the backend function here to rescan the files based on the new duration.
	}, [selectedDuration]);

	return (
		<section className='border-b border-b-gray pb-10'>
			<p className='mb-2 text-xl cursor-default'>Filter Duration:</p>
			<div className='flex items-center justify-between'>
				<div className='flex flex-col gap-2'>
					<p className='text-muted-foreground text-sm cursor-default'>
						Set the default duration for filtering files
					</p>
					<p className='text-xs text-muted-foreground cursor-default w-1/2 hover:text-white duration-300 transition-all'>
						Note: Setting a longer filter duration may cause the loading time of
						files to be longer. It is set to 30 days by default.
					</p>
				</div>
				<div className='w-48'>
					<Select onValueChange={setSelectedDuration} value={selectedDuration}>
						<SelectTrigger>
							<SelectValue placeholder={selectedDuration} />
						</SelectTrigger>
						<SelectContent>
							{durations.map((duration) => (
								<SelectItem key={duration} value={duration}>
									{duration}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</section>
	);
}
