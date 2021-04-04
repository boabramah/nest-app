import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from 'nest-router';
import { routes } from './routes/routes';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NunjucksModule } from 'nest-nunjucks';
import { ApiModule } from './api/api.module';
import { User } from './api/user/user.entity';
import { RefreshToken } from './api/user/refresh-token.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nest_db',
      entities: [User, RefreshToken],
      synchronize: true,
      keepConnectionAlive: true,
    }), 
    NunjucksModule.forRoot({
      paths: [
          "src/backend/templates/",
          "src/backend/templates/partials/",
          "src/backend/templates/layouts/",
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
