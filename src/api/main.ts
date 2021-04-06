import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { JwtExceptionFilter } from './exceptions/jwt-exception.filter';
import { swaggerSetup } from './swagger-setup';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  ); 
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector))
  ); 
  
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new JwtExceptionFilter(httpAdapter));

  //app.enableCors();

  swaggerSetup(app);

  app.useStaticAssets(join(__dirname, '../client'));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }  

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
