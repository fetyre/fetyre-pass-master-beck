// import { Injectable } from '@nestjs/common';
// import pino, { LoggerOptions } from 'pino';
// import pinoElastic, { DestinationStream } from 'pino-elasticsearch';
// import { ConfigLoaderService } from '../config/config-loader.service';
// import moment from 'moment';
// import { StreamOptions } from './interface';

// const DATA_FORMAT: string = 'YYYY-MM-DD';
// const ES_NODE: string = 'http://localhost:9200';
// const ES_VERSION: number = 7;
// const FLUSH_BYTES: number = 1000;
// const LOGGER_LEVEL: string = 'trace';
// const TIMESTAMP_FUNC: () => string = () =>
// 	`,"time":"${new Date().toISOString()}"`;

// @Injectable()
// export class PinoLogger {
// 	private errorStream: DestinationStream;
// 	private generalStream: DestinationStream;
// 	private errorLogger: pino.Logger;
// 	private generalLogger: pino.Logger;

// 	constructor(private readonly configLoaderService: ConfigLoaderService) {
// 		const dateSuffix: string = moment().format(DATA_FORMAT);

// 		const streamOptions: StreamOptions = {
// 			node: ES_NODE,
// 			esVersion: ES_VERSION,
// 			flushBytes: FLUSH_BYTES
// 		};

// 		this.errorStream = pinoElastic({
// 			...streamOptions,
// 			index: `${this.configLoaderService.elasticsearchLoggerErrorIndex}-${dateSuffix}`
// 		});

// 		this.generalStream = pinoElastic({
// 			...streamOptions,
// 			index: `${this.configLoaderService.elasticsearchLoggerOtherIndex}-${dateSuffix}`
// 		});

// 		const loggerOptions: LoggerOptions = {
// 			level: LOGGER_LEVEL,
// 			timestamp: TIMESTAMP_FUNC,
// 			formatters: {
// 				level(label: string, number: number) {
// 					return { level: label };
// 				},
// 				bindings(bindings: { pid: number; hostname: string }) {
// 					return { pid: bindings.pid, hostname: bindings.hostname };
// 				},
// 				log(object: object) {
// 					return { message: (object as any).message, ...object };
// 				}
// 			}
// 		};

// 		this.errorLogger = pino(loggerOptions, this.errorStream);
// 		this.generalLogger = pino(loggerOptions, this.generalStream);
// 	}

// 	public error(message: string, trace?: string): void {
// 		this.errorLogger.error({ trace }, message);
// 	}

// 	public debug(message: string): void {
// 		this.generalLogger.debug(message);
// 	}

// 	public info(message: string): void {
// 		this.generalLogger.info(message);
// 	}

// 	public warn(message: string, trace?: string): void {
// 		this.errorLogger.warn({ trace }, message);
// 	}

// 	public fatal(message: string, trace?: string): void {
// 		this.errorLogger.fatal({ trace }, message);
// 	}

// 	public verbose(message: string): void {
// 		this.generalLogger.trace(message);
// 	}
// }
