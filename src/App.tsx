import { useState } from 'react';
import AudioPlayer from './components/Layout/AudioPlayer';
import Clients from './components/Layout/Clients';
import EmailTemplates from './components/Layout/EmailTemplates';
import FormatFiles from './components/Layout/FormatFiles';
import Header from './components/Layout/Header';
import RecentFiles from './components/Layout/RecentFiles';
import Settings from './components/Layout/Settings';
import SideBar from './components/Layout/SideBar';
import Stats from './components/Layout/Stats';
import UserProfile from './components/Layout/UserProfile';
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { logout } from './services/auth';

function App() {
	const [currentView, setCurrentView] = useState(() => {
		const savedStartupView = window.localStorage.getItem('startupView');
		return savedStartupView ? savedStartupView : 'default-view';
	});

	let componentInView;
	switch (currentView) {
		case 'Recent Files':
			componentInView = <RecentFiles />;
			break;
		case 'Clients':
			componentInView = <Clients />;
			break;
		case 'Format Files':
			componentInView = <FormatFiles />;
			break;
		case 'Email Templates':
			componentInView = <EmailTemplates />;
			break;
		case 'User Profile':
			componentInView = <UserProfile />;
			break;
		case 'Settings':
			componentInView = <Settings />;
			break;
		case 'Stats':
			componentInView = <Stats />;
			break;
	}

	return (
		<AuthProvider>
			<ThemeProvider>
				<main className='min-h-screen grid grid-cols-[200px_1fr] grid-rows-[auto_1fr_auto]'>
					<>
						<SideBar setCurrentView={setCurrentView} />
						<section className='flex flex-col h-full'>
							<Header logout={logout} setCurrentView={setCurrentView} />
							<div className='flex-grow grid pt-4 px-4'>{componentInView}</div>
							<div className='bottom-0 sticky z-50'>
								<AudioPlayer />
							</div>
						</section>
					</>
				</main>
			</ThemeProvider>
		</AuthProvider>
	);
}

export default App;
