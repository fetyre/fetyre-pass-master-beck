import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.process';

@Module({
	imports: [
		BullModule.registerQueue({
			name: 'email'
		})
	],
	providers: [EmailService, EmailProcessor]
})
export class EmailModule {}
