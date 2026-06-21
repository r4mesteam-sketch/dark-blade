import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'log', 'warn', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || 'http://localhost:3000',
    credentials: configService.get('CORS_CREDENTIALS') === 'true',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Dark Blade API')
    .setDescription('Enterprise-grade multi-vendor marketplace API')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addServer(configService.get('API_URL') || 'http://localhost:3001')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Sellers', 'Seller operations')
    .addTag('Products', 'Product management')
    .addTag('Orders', 'Order operations')
    .addTag('Payments', 'Bitcoin payment processing')
    .addTag('Chat', 'Encrypted messaging')
    .addTag('Notifications', 'Notification system')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('APP_PORT') || 3001;
  await app.listen(port, '0.0.0.0', () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   🚀 Dark Blade API Server Started     ║
    ║   🔗 http://localhost:${port}           ║
    ║   📖 Docs: http://localhost:${port}/api/docs ║
    ╚════════════════════════════════════════╝
    `);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Bootstrap error:', err);
  process.exit(1);
});
