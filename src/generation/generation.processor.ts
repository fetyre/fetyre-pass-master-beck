import { Processor, Process } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { GenerationRepository } from './generation.repository';

const START_OF_DAY: number = 0;

@Injectable()
@Processor('generation')
export class GenerationProcessor {
	private readonly logger: Logger = new Logger(GenerationProcessor.name);
	constructor(private readonly generationRepository: GenerationRepository) {}

	@Process('count')
	async passwordGenerationСout(): Promise<void> {
		try {
			this.logger.log('passwordGenerationСout: Starting process.');
			const today: Date = new Date();
			today.setHours(START_OF_DAY, START_OF_DAY, START_OF_DAY, START_OF_DAY);
			await this.generationRepository.upadteGeneration(today);
			this.logger.log(`passwordGenerationСout: Process completed.`);
		} catch (error) {
			this.logger.error(
				`passwordGenerationСout: Error in process, error:${error}.`
			);
			throw error;
		}
	}
}
