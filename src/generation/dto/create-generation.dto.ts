import {
	IsBoolean,
	IsInt,
	IsNumber,
	IsOptional,
	Max,
	Min
} from 'class-validator';
import { ICreatePassword } from '../interface/create-password.interface';
import { ApiProperty } from '@nestjs/swagger';

const MIN_LEN_PASSWORD: number = 2;
const MAX_LEN_PASSWORD: number = 100;

export class CreateGenerationDto implements ICreatePassword {
	@ApiProperty({
		description: 'Длина генерируемого пароля',
		required: false,
		type: Number,
		example: 10
	})
	@IsOptional()
	@IsNumber()
	@IsInt({ message: 'Длина должна быть целым числом' })
	@Min(MIN_LEN_PASSWORD, {
		message: `Минимальная длина пароля - ${MIN_LEN_PASSWORD} символов`
	})
	@Max(MAX_LEN_PASSWORD, {
		message: `Максимальная длина пароля - ${MAX_LEN_PASSWORD} символов`
	})
	public readonly length?: number;

	@ApiProperty({
		description:
			'Параметр, указывающий на необходимость включения чисел в пароль',
		required: false,
		type: Boolean,
		example: true
	})
	@IsOptional()
	@IsBoolean({ message: 'Параметр "numbers" должен быть булевым значением' })
	public readonly numbers?: boolean;

	@ApiProperty({
		description:
			'Параметр, указывающий на необходимость включения строчных букв в пароль',
		required: false,
		type: Boolean,
		example: true
	})
	@IsOptional()
	@IsBoolean({ message: 'Параметр "lowercase" должен быть булевым значением' })
	public readonly lowercase?: boolean;

	@ApiProperty({
		description:
			'Параметр, указывающий на необходимость включения прописных букв в пароль',
		required: false,
		type: Boolean,
		example: true
	})
	@IsOptional()
	@IsBoolean({ message: 'Параметр "uppercase" должен быть булевым значением' })
	public readonly uppercase?: boolean;
}
