import { IConfig } from './interface/config.interface';

export function config(): IConfig {
	return {
		id: process.env.APP_ID,
		supportEmail: process.env.SUPPORT_EMAIL,
		emailConfig: {
			host: process.env.EMAIL_HOST,
			port: parseInt(process.env.EMAIL_PORT, 10),
			secure: process.env.EMAIL_SECURE === 'true',
			from: process.env.EMAIL_FROM,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD
			}
		},
		redisConfig: {
			host: process.env.REDIS_HOST,
			port: parseInt(process.env.REDIS_PORT, 10),
			password: process.env.REDIS_PASSWORD,
			url: process.env.REDIS_URL
		}
	};
}
