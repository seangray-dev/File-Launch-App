interface OAuthProviderConfig {
	authorizationEndpoint: string;
	scope: string;
}

export interface OAuthConfigsType {
	[key: string]: OAuthProviderConfig;
}
