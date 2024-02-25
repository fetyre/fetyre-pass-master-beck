import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailService } from 'src/email/email.service';
import { IEmailParams } from 'src/email/interface/email-params.interface';

@Injectable()
@Processor('email')
export class EmailProcessor {
	private readonly logger: Logger = new Logger(EmailProcessor.name);
	constructor(private readonly emailService: EmailService) {}

	@Process('sendfeedback')
	async sendFeedback(job: Job<IEmailParams>): Promise<void> {
		try {
			this.logger.log(`sendFeedback: Starting process.`);
			return await this.emailService.sendEmail(job.data);
		} catch (error) {
			this.logger.error(`sendFeedback: Error in process.`);
			throw error;
		}
	}

	@Process('sendStats')
	async sendStats(job: Job<IEmailParams>): Promise<void> {
		try {
			this.logger.log(`sendFeedback: Starting process.`);
			return await this.emailService.sendEmail(job.data);
		} catch (error) {
			this.logger.error(`sendFeedback: Error in process.`);
			throw error;
		}
	}
}
