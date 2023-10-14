import { OAuthConfigsType } from './types';

export const OAuthConfigs: OAuthConfigsType = {
	google: {
		authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
		scope: 'email%20profile%20openid&',
	},
	dropbox: {
		authorizationEndpoint: 'https://www.dropbox.com/oauth2/authorize',
		scope: 'account_info.read',
	},
};
