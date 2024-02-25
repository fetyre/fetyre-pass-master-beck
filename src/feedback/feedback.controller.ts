import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
	constructor(private readonly feedbackService: FeedbackService) {}

	@ApiOperation({ summary: 'Create feedback' })
	@ApiResponse({
		status: 201,
		description: 'Feedback successfully created.'
	})
	@ApiBody({ type: CreateFeedbackDto, description: 'Feedback data' })
	@Post()
	async create(
		@Body() createFeedbackDto: CreateFeedbackDto,
		@Res() res: Response
	): Promise<void> {
		await this.feedbackService.create(createFeedbackDto);
		res.sendStatus(HttpStatus.CREATED);
	}
}
