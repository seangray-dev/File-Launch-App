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

const Header = ({ setCurrentView, logout }) => {
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
				<li onClick={() => setCurrentView('User Profile')}>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<span className='hover:text-primary transition-all duration-300 cursor-pointer'>
									<UserIcon className='w-6' />
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>Profile</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</li>
				<li onClick={() => setCurrentView('Settings')}>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<span className='hover:text-primary transition-all duration-300 cursor-pointer'>
									<Cog6ToothIcon className='w-6' />
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>Settings</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</li>
				<li>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<span className='hover:text-primary transition-all duration-300 cursor-pointer'>
									<BellIcon className='w-6' />
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>Notifications</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</li>
				<li onClick={logout}>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<span className='hover:text-primary transition-all duration-300 cursor-pointer'>
									<ArrowLeftOnRectangleIcon className='w-6' />
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>Logout</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</li>
			</ul>
		</header>
	);
};

export default Header;
