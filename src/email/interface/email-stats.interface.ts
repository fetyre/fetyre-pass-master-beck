import { IEmailMaxDay } from './email-stats-max-day.interface';

export interface IEmailStats {
	totalGenerations: number;
	maxDay: IEmailMaxDay;
}
