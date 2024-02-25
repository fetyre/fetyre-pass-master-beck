import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { EmailService } from 'src/email/email.service';
import { BullModule } from '@nestjs/bull';

@Module({
	imports: [
		BullModule.registerQueue({
			name: 'email'
		})
	],
	controllers: [FeedbackController],
	providers: [FeedbackService, EmailService]
})
export class FeedbackModule {}
