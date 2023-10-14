import { OAuthConfigs } from '@/config/oauth';
import { open } from '@tauri-apps/api/shell';
import {
	AuthCredential,
	GoogleAuthProvider,
	getAuth,
	signInWithCredential,
} from 'firebase/auth';

const openBrowserToConsent = async (port: string, provider: string) => {
	const config = OAuthConfigs[provider];
	if (!config) return Promise.reject('Invalid Provider');

	// Use the config to construct the URL
	if (provider === 'google') {
		const url =
			`${config.authorizationEndpoint}` +
			'?response_type=token&' +
			'client_id=548682664229-7ac3l0o35o6bjomkduj66uafrv653svb.apps.googleusercontent.com&' +
			`redirect_uri=http%3A//localhost:${port}&` +
			`scope=${config.scope}` +
			'prompt=consent';

		return open(url);
	} else {
		console.error('Invalid provider', provider);
	}
};

export const initiateOAuthSignIn = async (port: string, provider: string) => {
	try {
		await openBrowserToConsent(port, provider);
	} catch (error) {
		return Promise.reject(error);
	}
};

export const signIn = (payload: string, provider: string) => {
	const url = new URL(payload);
	const access_token = new URLSearchParams(url.hash.substring(1)).get(
		'access_token'
	);

	if (!access_token) return Promise.reject('No access token found');

	const auth = getAuth();
	let credential: AuthCredential | null = null;

	if (provider === 'google') {
		credential = GoogleAuthProvider.credential(null, access_token);
	}
	// Extend this part to add more providers

	if (credential) {
		// Check if it's not null
		return signInWithCredential(auth, credential).catch((error) => {
			return Promise.reject(error);
		});
	}
	return Promise.reject('Invalid provider or failed to generate credential');
};

export const signOut = async () => {
	const auth = getAuth();
	try {
		await auth.signOut();
	} catch (error) {
		return Promise.reject(error);
	}
};
