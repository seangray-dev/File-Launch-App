import { OAuthConfigsType } from './types';

export const OAuthConfigs: OAuthConfigsType = {
	google: {
		authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
		scope: 'email profile openid',
	},
	dropbox: {
		authorizationEndpoint: 'https://www.dropbox.com/oauth2/authorize',
		scope: 'account_info.read',
	},
};
