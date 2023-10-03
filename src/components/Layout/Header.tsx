import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

import {
	ArrowLeftOnRectangleIcon,
	BellIcon,
	Cog6ToothIcon,
	MagnifyingGlassIcon,
	UserIcon,
} from '@heroicons/react/24/solid';
import { HeaderIcon } from '../ui/headericon';

type HeaderProps = {
	setCurrentView: (view: string) => void;
	logout: () => void;
};

const Header = ({ setCurrentView, logout }: HeaderProps) => {
	return (
		<header className='p-4 border-b border-gray/10'>
			<ul className='flex gap-2 items-center justify-end'>
				<li className='relative search-input'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<span className='hover:text-primary transition-all duration-300 cursor-pointer absolute top-2 left-3 w-6 search-icon'>
									<MagnifyingGlassIcon />
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>Search</p>
							</TooltipContent>
						</Tooltip>
						<input
							className='bg-transparent outline-none border border-gray rounded-full py-2 pl-12 pr-2 focus:border-cyan transition-all duration-300 text-grey'
							type='text'
							placeholder='Search'
						/>
					</TooltipProvider>
				</li>
				
				<HeaderIcon
					tooltipText='Profile'
					onClick={() => setCurrentView('User Profile')}>
					<UserIcon className='w-6 -mb-1' />
				</HeaderIcon>
				<HeaderIcon
					tooltipText='Settings'
					onClick={() => setCurrentView('Settings')}>
					<Cog6ToothIcon className='w-6 -mb-1' />
				</HeaderIcon>
				<HeaderIcon tooltipText='Notifications'>
					<BellIcon className='w-6 -mb-1' />
				</HeaderIcon>
				<HeaderIcon tooltipText='Logout' onClick={logout}>
					<ArrowLeftOnRectangleIcon className='w-6 -mb-1' />
				</HeaderIcon>
			</ul>
		</header>
	);
};

export default Header;
