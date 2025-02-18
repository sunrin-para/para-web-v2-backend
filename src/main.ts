import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { PrismaService } from './prisma/prisma.service';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorized.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Set-Cookie'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      name: 'sessionId',
      proxy: true, // 프록시 뒤에서 실행되는 경우 필요
      cookie: {
        httpOnly: true,
        secure: false, // 개발환경에서는 false로 설정
        sameSite: 'lax', // 개발환경에서는 'lax'로 설정
        maxAge: 60 * 60 * 1000 * 6, // 6 hour
      },
    }),
  );

  app.use((req: any, res: any, next: any) => {
    if (!req.session.data) {
      req.session.data = {};
    }
    next();
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
  });

  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => console.log('PARA Web API Started successfully'))
  .catch((error) => console.error('Failed to start PARA Web API:', error));
