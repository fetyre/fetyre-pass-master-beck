import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator';
import { ICreateFeedback } from '../interface/create-feedback.interface';
import { ApiProperty } from '@nestjs/swagger';

const MIN_LENGTH: number = 1;
const MAX_LENGTH: number = 500;
const VALID_CHARACTERS_REGEX: RegExp = /^[\p{L}\p{N}\p{Z}\p{P}\p{S}]+$/gu;

export class CreateFeedbackDto implements ICreateFeedback {
	@ApiProperty({
		description: 'Email пользователя',
		required: true,
		type: String,
		example: 'user@example.com'
	})
	@IsNotEmpty({ message: 'Email не может быть пустым.' })
	@IsEmail({}, { message: 'Некорректный формат email.' })
	email: string;

	@ApiProperty({
		description: 'Сообщение от пользователя',
		required: true,
		type: String,
		example: 'Крутой сайт!'
	})
	@IsNotEmpty({ message: 'Сообщение не может быть пустым.' })
	@MinLength(MIN_LENGTH, {
		message: 'Сообщение должно содержать хотя бы один символ.'
	})
	@MaxLength(MAX_LENGTH, {
		message: 'Сообщение не может содержать более 500 символов.'
	})
	@IsString({ message: 'Сообщение должно быть строкой.' })
	@Matches(VALID_CHARACTERS_REGEX, {
		message:
			'Сообщение может содержать только буквы, цифры, пробелы, знаки препинания и смайлики.'
	})
	message: string;
}
