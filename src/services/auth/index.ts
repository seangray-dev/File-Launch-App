import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import * as auth from '../firebase/auth'; // Import all exported methods from firebase/auth.ts
import callbackTemplate from './callback.template';

export const login = (handleError: (error: any) => void, provider: string) => {
	// Wait for callback from tauri oauth plugin
	listen(`oauth://url`, (data) => {
		try {
			auth.signIn(data.payload as string, provider);
		} catch (error) {
			handleError(error);
		}
	});

	// Start tauri oauth plugin. When receive first request
	// When it starts, will return the server port
	// it will kill the server
	invoke('plugin:oauth|start', {
		config: {
			// Optional config, but use here for a more friendly callback page
			response: callbackTemplate,
		},
	})
		.then((port) => {
			try {
				// This function initiates OAuth sign-in
				auth.initiateOAuthSignIn(port as string, provider);
			} catch (error) {
				handleError(error);
			}
		})
		.catch((error) => {
			handleError(error);
		});
};

export const logout = () => {
	return auth.signOut();
};
