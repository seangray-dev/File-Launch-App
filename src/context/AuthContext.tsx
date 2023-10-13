import { createContext, ReactNode, useEffect, useState } from 'react';
import SignInPage from '../components/Layout/SignIn';

import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

// Type the context
interface AuthContextType {
	user: User | null;
}
export const AuthContext = createContext<AuthContextType | null>(null);

// Type the children and other props
interface AuthProviderProps {
	children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	// Type the user state
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});

		return () => unsubscribe();
	}, []);

	if (!user) {
		return <SignInPage />;
	}

	return (
		<AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
