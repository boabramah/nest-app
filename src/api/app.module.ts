import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from 'nest-router';
import { routes } from './routes/routes';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NunjucksModule } from 'nest-nunjucks';
import { ApiModule } from './modules/api.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './config/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),   
    NunjucksModule.forRoot({
      paths: [
          "src/api/templates/",
          "src/api/templates/partials/",
          "src/api/templates/layouts/",
      ],
      options: {
        autoescape: true,
        watch: true,
      },
    }),       
    RouterModule.forRoutes(routes), 
    ApiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
