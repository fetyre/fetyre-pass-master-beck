import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { CreateGenerationDto } from './dto/create-generation.dto';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('generation')
@Controller('generation')
export class GenerationController {
	constructor(private readonly generationService: GenerationService) {}

	@ApiOperation({ summary: 'Create password' })
	@ApiResponse({
		status: 201,
		description: 'Password successfully created.',
		schema: {
			type: 'object',
			properties: {
				password: {
					type: 'string',
					description: 'The generated password'
				}
			}
		}
	})
	@ApiBody({ type: CreateGenerationDto })
	@Post()
	public async create(
		@Body() createGenerationDto: CreateGenerationDto,
		@Res() res: Response
	): Promise<void> {
		const password: string =
			await this.generationService.create(createGenerationDto);
		res.status(HttpStatus.CREATED).json({ password });
	}
}
