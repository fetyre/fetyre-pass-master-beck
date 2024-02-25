import { Module } from '@nestjs/common';
import { GenerationModule } from './generation/generation.module';
import { FeedbackModule } from './feedback/feedback.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { ConfigLoaderService } from './config/config-loader.service';
import { config } from './config';
import { validationSchema } from './config/config.schema';
import { ConfigLoaderModule } from './config/config-loader.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailModule } from './email/email.module';
import { PrismaModule } from './settings/prisma.database/prisma.module';
import { BullModule } from '@nestjs/bull';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema,
			load: [config]
		}),
		ConfigLoaderModule,
		BullModule.forRootAsync({
			imports: [ConfigLoaderModule],
			useFactory: async (configService: ConfigLoaderService) => ({
				redis: {
					host: configService.redis.host,
					port: configService.redis.port
				}
			}),
			inject: [ConfigLoaderService]
		}),
		PrismaModule,
		GenerationModule,
		PrometheusModule.register({}),
		FeedbackModule,
		MailerModule.forRootAsync({
			imports: [ConfigLoaderModule],
			useFactory: async (configService: ConfigLoaderService) => ({
				transport: {
					host: configService.emailConfig.host,
					port: configService.emailConfig.port,
					secure: configService.emailConfig.secure,
					auth: {
						user: configService.emailConfig.auth.user,
						pass: configService.emailConfig.auth.pass
					}
				},
				defaults: {
					from: `"${configService.emailConfig.from}" <${configService.emailConfig.auth.user}>`
				},
				template: {
					dir: __dirname + '/email/templates',
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true
					}
				}
			}),
			inject: [ConfigLoaderService]
		}),
		EmailModule,
		ScheduleModule.forRoot()
	],
	controllers: [],
	providers: []
})
export class AppModule {}
