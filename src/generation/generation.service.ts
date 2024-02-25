import {
	Injectable,
	InternalServerErrorException,
	Logger
} from '@nestjs/common';
import { ICreatePassword } from './interface/create-password.interface';
import * as generator from 'generate-password';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Cron } from '@nestjs/schedule';
import { GenerationRepository } from './generation.repository';
import { PasswordGeneration } from '@prisma/client';
import { EmailService } from 'src/email/email.service';

const DEFAULT_LENGTH: number = 10;
const DEFAULT_NUMBERS: boolean = false;
const DEFAULT_LOWERCASE: boolean = true;
const DEFAULT_UPPERCASE: boolean = true;
const UNDEFINED: undefined = undefined;
const MAX_ATTEMPTS: number = 5;
const BACKOFF_DELAY: number = 5000;
const JOB_NAME: string = 'count';
const DAY_IN_WEEK: number = 7;
const START_OF_DAY: number = 0;
const EVERY_FIVE_SECONDS: string = '0 9 * * 0';
const INITIAL_SUM_VALUE: number = 0;
const FIRST_INDEX: number = 0;
const LOCATE_DATE: Intl.LocalesArgument = 'ru-RU';

@Injectable()
export class GenerationService {
	private readonly logger: Logger = new Logger(GenerationService.name);

	constructor(
		@InjectQueue('generation') private generationQueue: Queue,
		private readonly generationRepository: GenerationRepository,
		private readonly emailService: EmailService
	) {}

	public async create(data: ICreatePassword): Promise<string> {
		try {
			this.logger.log(`create: Starting process.`);
			const password: string = this.generatePassword(data);
			this.logger.debug(`create: geneeration completed.`);
			await this.addJobToQueue();
			this.logger.debug(`create: job completed.`);
			return password;
		} catch (error) {
			this.logger.error(`create: Error in process, error:${error}.`);
			throw new InternalServerErrorException('Server error.');
		}
	}

	private generatePassword(data: ICreatePassword): string {
		this.logger.log(`generatePassword: Starting process.`);
		return generator.generate({
			length: data.length !== UNDEFINED ? data.length : DEFAULT_LENGTH,
			numbers: data.numbers !== UNDEFINED ? data.numbers : DEFAULT_NUMBERS,
			lowercase:
				data.lowercase !== UNDEFINED ? data.lowercase : DEFAULT_LOWERCASE,
			uppercase:
				data.uppercase !== UNDEFINED ? data.uppercase : DEFAULT_UPPERCASE
		});
	}

	private async addJobToQueue(): Promise<void> {
		this.logger.log(`addJobToQueue: Starting process`);
		await this.generationQueue.add(JOB_NAME, {
			attempts: MAX_ATTEMPTS,
			backoff: BACKOFF_DELAY
		});
		this.logger.log(`addJobToQueue: Process completed`);
	}

	@Cron(EVERY_FIVE_SECONDS)
	private async sendWeeklyStats(): Promise<void> {
		try {
			this.logger.log(`sendWeeklyStats: Starting process.`);
			const startDate: Date = new Date();
			startDate.setDate(startDate.getDate() - DAY_IN_WEEK);
			startDate.setHours(
				START_OF_DAY,
				START_OF_DAY,
				START_OF_DAY,
				START_OF_DAY
			);
			this.logger.debug(`sendWeeklyStats: Start date is ${startDate}.`);
			const endDate: Date = new Date();
			endDate.setHours(START_OF_DAY, START_OF_DAY, START_OF_DAY, START_OF_DAY);
			this.logger.debug(`sendWeeklyStats: End date is ${endDate}.`);
			const passwordGenerations: PasswordGeneration[] =
				await this.generationRepository.getWeeklyStats(startDate, endDate);
			this.logger.debug(`sendWeeklyStats: Retrieved password generations.`);
			const totalGenerations: number = passwordGenerations.reduce(
				(sum, pg) => sum + pg.count,
				INITIAL_SUM_VALUE
			);
			this.logger.debug(
				`sendWeeklyStats: Total generations is ${totalGenerations}.`
			);
			const maxDay: PasswordGeneration = passwordGenerations.reduce(
				(max, pg) => (pg.count > max.count ? pg : max),
				passwordGenerations[FIRST_INDEX]
			);
			this.logger.debug(
				`sendWeeklyStats: Max day is ${maxDay.date} with ${maxDay.count} generations.`
			);
			const manDayData: string = maxDay.date.toLocaleDateString(LOCATE_DATE);
			await this.emailService.sendStats(totalGenerations, {
				date: manDayData,
				count: maxDay.count
			});
			this.logger.debug(`sendWeeklyStats: Email sent.`);
			this.logger.log(`sendWeeklyStats: Completed process.`);
		} catch (error) {
			this.logger.error(`sendWeeklyStats: An error occurred: ${error.message}`);
		}
	}
}
