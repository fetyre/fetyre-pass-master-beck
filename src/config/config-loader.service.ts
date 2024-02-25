import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEmailConfig } from './interface';
import { IRedisConfig } from './interface/redis.interface';

@Injectable()
export class ConfigLoaderService {
	private readonly logger: Logger = new Logger(ConfigLoaderService.name);

	readonly issuer: string;
	readonly emailConfig: IEmailConfig;
	readonly redis: IRedisConfig;
	readonly supportEmail: string;

	constructor(private readonly configService: ConfigService) {
		this.issuer = this.getStringConfig('id');
		this.emailConfig = this.configService.get<IEmailConfig>('emailConfig');
		this.redis = this.configService.get<IRedisConfig>('redisConfig');
		this.supportEmail = this.getStringConfig('supportEmail');
	}

	private getNumberConfig(key: string): number {
		this.logger.log(`getNumberConfig: Starting process, key:${key}`);
		return this.configService.get<number>(key);
	}

	private getStringConfig(key: string): string {
		this.logger.log(`getStringConfig: Starting process, key:${key}`);
		return this.configService.get<string>(key);
	}
}
