import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { IEmailParams } from './interface/email-params.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigLoaderService } from 'src/config/config-loader.service';
import { ICreateFeedback } from 'src/feedback/interface/create-feedback.interface';
import { IEmailMaxDay } from './interface/email-stats-max-day.interface';

const JOB_NAME_FEEDBACK: string = 'sendfeedback';
const MAX_ATTEMPTS: number = 5;
const BACKOFF_DELAY: number = 5000;
const FEEDBACK_SUBJECT: string = 'Запрос на обратную связь';
const FEEDBACK_TEMPLATE: string = 'feedback';
const STATS_TEMPLATE: string = 'stats';
const JOB_NAME_STATS: string = 'sendStats';
const STATS_SUBJECT: string = 'Статистика за неделю';

@Injectable()
export class EmailService {
	private readonly logger: Logger = new Logger(EmailService.name);

	constructor(
		private readonly mailerService: MailerService,
		@InjectQueue('email') private mailQueue: Queue,
		private readonly configLoaderService: ConfigLoaderService
	) {}

	public async sendEmail(data: IEmailParams): Promise<void> {
		this.logger.log(`sendEmail: Starting process.`);
		await this.mailerService
			.sendMail({
				to: this.configLoaderService.supportEmail,
				subject: data.subject,
				template: data.template,
				context: data.context
			})
			.then(() => {
				this.logger.log(`sendEmail: email send.`);
			})
			.catch(error => {
				this.logger.error(`sendEmail: Error in process, error:${error}`);
			});
	}

	public async sendReqFeedback(data: ICreateFeedback): Promise<void> {
		this.logger.log(`sendReqFeedback: Starting process`);
		const feedbackData: IEmailParams = {
			subject: FEEDBACK_SUBJECT,
			template: FEEDBACK_TEMPLATE,
			context: { ...data }
		};
		await this.mailQueue.add(JOB_NAME_FEEDBACK, feedbackData, {
			attempts: MAX_ATTEMPTS,
			backoff: BACKOFF_DELAY
		});
		this.logger.log(`sendReqFeedback: Process completed`);
	}

	public async sendStats(
		totalGenerations: number,
		maxDay: IEmailMaxDay
	): Promise<void> {
		this.logger.log(`sendStats: Starting process`);
		const feedbackData: IEmailParams = {
			subject: STATS_SUBJECT,
			template: STATS_TEMPLATE,
			context: { totalGenerations, maxDay }
		};
		await this.mailQueue.add(JOB_NAME_STATS, feedbackData, {
			attempts: MAX_ATTEMPTS,
			backoff: BACKOFF_DELAY
		});
		this.logger.log(`sendStats: Process completed`);
	}
}
