import {
	Injectable,
	InternalServerErrorException,
	Logger
} from '@nestjs/common';
import { ICreateFeedback } from './interface/create-feedback.interface';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class FeedbackService {
	private readonly logger: Logger = new Logger(FeedbackService.name);

	constructor(private readonly emailService: EmailService) {}

	public async create(data: ICreateFeedback): Promise<void> {
		try {
			this.logger.log(`create: Starting process, emailReq:${data.email}`);
			await this.emailService.sendReqFeedback(data);
			this.logger.log(`create: send email completed, emailReq:${data.email}`);
		} catch (error) {
			this.logger.error(
				`create: Error in process, error:${error.message}, emailReq:${data.email}`
			);
			throw new InternalServerErrorException('Error in service.');
		}
	}
}
