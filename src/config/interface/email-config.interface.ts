interface IEmailAuth {
	user: string;
	pass: string;
}

export interface IEmailConfig {
	host: string;
	port: number;
	from: string;
	secure: boolean;
	auth: IEmailAuth;
}
