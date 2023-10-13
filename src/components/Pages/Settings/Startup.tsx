import { useEffect, useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../ui/select';

export default function Startup() {
	const startupViews = [
		'Recent Files',
		'Clients',
		'Format Files',
		'Email Templates',
		'User Profile',
		'Settings',
	];

	const [startupView, setStartupView] = useState(() => {
		const savedStartupView = window.localStorage.getItem('startupView');
		return savedStartupView ? savedStartupView : startupViews[0];
	});

	useEffect(() => {
		window.localStorage.setItem('startupView', startupView);
	}, [startupView]);

	return (
		<section>
			<p className='mb-2 text-xl'>Startup Settings:</p>
			<div className='flex items-center justify-between'>
				<p className='text-muted-foreground text-sm'>
					Set the default view on application launch
				</p>
				<div className='w-48'>
					<Select onValueChange={setStartupView} value={startupView}>
						<SelectTrigger>
							<SelectValue placeholder={startupView} />
						</SelectTrigger>
						<SelectContent>
							{startupViews.map((view) => (
								<SelectItem key={view} value={view}>
									{view}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</section>
	);
}
