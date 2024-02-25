import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/settings/prisma.database/prisma.service';
import { PasswordGeneration } from '@prisma/client';

const INITIAL_COUNT: number = 1;

@Injectable()
export class GenerationRepository {
	private readonly logger: Logger = new Logger(GenerationRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	public async upadteGeneration(date: Date): Promise<void> {
		this.logger.log(`upadteGeneration: Starting process.`);
		await this.prisma.passwordGeneration.upsert({
			where: { date },
			update: { count: { increment: INITIAL_COUNT } },
			create: { date, count: INITIAL_COUNT }
		});
	}

	public async getWeeklyStats(
		startDate: Date,
		endDate: Date
	): Promise<PasswordGeneration[]> {
		this.logger.log(`getWeeklyStats: Starting process.`);
		return await this.prisma.passwordGeneration.findMany({
			where: {
				date: {
					gte: startDate,
					lt: endDate
				}
			}
		});
	}
}
