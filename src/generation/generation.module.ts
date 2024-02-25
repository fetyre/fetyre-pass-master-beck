import { Module } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { GenerationController } from './generation.controller';
import { BullModule } from '@nestjs/bull';
import { GenerationRepository } from './generation.repository';
import { GenerationProcessor } from './generation.processor';
import { EmailService } from 'src/email/email.service';

@Module({
	imports: [
		BullModule.registerQueue({
			name: 'generation'
		}),
		BullModule.registerQueue({
			name: 'email'
		})
	],
	controllers: [GenerationController],
	providers: [
		GenerationService,
		GenerationRepository,
		GenerationProcessor,
		EmailService
	]
})
export class GenerationModule {}
