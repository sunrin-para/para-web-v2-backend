import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UnauthorizedExceptionFilter } from '@/common/filters/unauthorized.filter';
import { PrismaExceptionFilter } from '@/common/filters/prisma-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(
    new UnauthorizedExceptionFilter(),
    new PrismaExceptionFilter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://sunrin-para.dev',
      'https://api.sunrin-para.dev',
      'https://apply.sunrin-para.dev',
      'https://internal.sunrin-para.dev',
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Set-Cookie'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const config = new DocumentBuilder()
    .setTitle(process.env.NAME)
    .setDescription(process.env.DESCRIPTION)
    .setVersion(process.env.VERSION)
    .addTag(process.env.TAG)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: 'api-docs/json',
    explorer: true,
    yamlDocumentUrl: 'api-docs/yaml',
    customCss: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DARK),
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => console.log('PARA Web API Started successfully'))
  .catch((error) => console.error('Failed to start PARA Web API:', error));
