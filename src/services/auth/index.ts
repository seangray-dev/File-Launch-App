import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { auth } from '../firebase';
import callbackTemplate from './callback.template';

const { openGoogleSignIn, googleSignIn, signOut } = auth;

export const login = (handleError: (error: any) => void) => {
	// Wait for callback from tauri oauth plugin
	listen('oauth://url', (data) => {
		try {
			googleSignIn(data.payload as string);
		} catch (error) {
			handleError(error);
		}
	});

	// Start tauri oauth plugin. When receive first request
	// When it starts, will return the server port
	// it will kill the server
	invoke('plugin:oauth|start', {
		config: {
			// Optional config, but use here to more friendly callback page
			response: callbackTemplate,
		},
	})
		.then((port) => {
			try {
				openGoogleSignIn(port as string);
			} catch (error) {
				handleError(error);
			}
		})
		.catch((error) => {
			handleError(error);
		});
};

export const logout = () => {
	return signOut();
};
