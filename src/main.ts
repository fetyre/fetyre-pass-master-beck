import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './settings/prisma.database/prisma.service';
import helmet from 'helmet';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './error/global-http-error';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	);
	const prismaService: PrismaService = app.get(PrismaService);
	const httpAdapter = app.get(HttpAdapterHost);
	app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
	app.enableShutdownHooks();
	app
		.getHttpAdapter()
		.getInstance()
		.on('beforeShutdown', async () => {
			await prismaService.$disconnect();
		});
	app.enableCors();
	app.use(helmet());
	const config = new DocumentBuilder()
		.setTitle('PassMaster')
		.setDescription('The API description')
		.setVersion('1.0')
		.addTag('generator password')
		.build();
	const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	await app.listen(3005);
}
bootstrap();
