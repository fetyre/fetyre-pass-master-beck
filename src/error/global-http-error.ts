import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { HttpAdapterHost } from '@nestjs/core';

const DEFAULT_ERROR_MESSAGE: string = 'Internet server error';
const DEFAULT_ERROR_CODE: number = HttpStatus.INTERNAL_SERVER_ERROR;

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: unknown, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;
		const ctx: HttpArgumentsHost = host.switchToHttp();
		const httpStatus: number = this.extractStatus(exception);
		const message: string | object = this.extractErrorMessage(exception);
		httpAdapter.reply(ctx.getResponse(), { message }, httpStatus);
	}

	private extractErrorMessage(exception: unknown): string | object {
		return exception instanceof HttpException
			? exception.getResponse()
			: DEFAULT_ERROR_MESSAGE;
	}

	private extractStatus(exception: unknown): number {
		return exception instanceof HttpException
			? exception.getStatus()
			: DEFAULT_ERROR_CODE;
	}
}
