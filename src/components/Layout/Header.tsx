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
					<span
						className='hover:text-primary transition-all duration-300 cursor-pointer absolute top-2 left-3 w-6 search-icon'
						title='Settings'>
						<MagnifyingGlassIcon />
					</span>
					<input
						className='bg-transparent outline-none border border-gray rounded-full py-2 pl-12 pr-2 focus:border-cyan transition-all duration-300 text-grey'
						type='text'
						placeholder='Search'
						title='Search'
					/>
				</li>
				<li onClick={() => setCurrentView('User Profile')}>
					<span
						className='hover:text-primary transition-all duration-300 cursor-pointer'
						title='User Profile'>
						<UserIcon className='w-6' />
					</span>
				</li>
				<li onClick={() => setCurrentView('Settings')}>
					<span
						className='hover:text-primary transition-all duration-300 cursor-pointer'
						title='Settings'>
						<Cog6ToothIcon className='w-6' />
					</span>
				</li>
				<li>
					<span
						className='hover:text-primary transition-all duration-300 cursor-pointer'
						title='Notifications'>
						<BellIcon className='w-6' />
					</span>
				</li>
				<li onClick={logout}>
					<span
						className='hover:text-primary transition-all duration-300 cursor-pointer'
						title='Logout'>
						<ArrowLeftOnRectangleIcon className='w-6' />
					</span>
				</li>
			</ul>
		</header>
	);
};

export default Header;
