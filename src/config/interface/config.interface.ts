import { IEmailConfig } from './email-config.interface';
import { IRedisConfig } from './redis.interface';

export interface IConfig {
	id: string;
	emailConfig: IEmailConfig;
	redisConfig: IRedisConfig;
	supportEmail: string;
}
