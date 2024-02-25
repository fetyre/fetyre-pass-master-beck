import { Prisma } from '@prisma/client';

export type WeeklyPasswordStats = (Prisma.PickEnumerable<
	Prisma.PasswordGenerationGroupByOutputType,
	'date'[]
> & {
	_sum: {
		count: number;
	};
})[];
