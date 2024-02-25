import { ICreateFeedback } from 'src/feedback/interface/create-feedback.interface';
import { IEmailStats } from './email-stats.interface';

export interface IEmailParams {
	template: string;
	subject: string;
	context: ICreateFeedback | IEmailStats;
}
