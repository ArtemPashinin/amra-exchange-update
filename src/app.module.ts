import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CurrencyModel } from './models/currency.model';
import { CourseExchangeModel } from './models/currency-exchange.model';
import { CurrencyExchangeService } from './currency-exchange.service';
import { RubUpdateCourseService } from './courses-services/rub-course-update.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UpdatorService } from './courses-services/updator.service';
import { BtcUpdateCourseService } from './courses-services/btc-course-update.service';
import { EthUpdateCourseService } from './courses-services/eth-course-update.service';
import { AedUpdateCourseService } from './courses-services/aed-course-update.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get('HOST'),
        username: configService.get('DBUSERNAME'),
        password: configService.get('PASSWORD'),
        database: configService.get('DATABASE'),
        autoLoadModels: true,
        synchronize: configService.get<boolean>('SYNCHRONIZE'),
        logging: false,
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([CourseExchangeModel, CurrencyModel]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CurrencyExchangeService,
    RubUpdateCourseService,
    BtcUpdateCourseService,
    EthUpdateCourseService,
    AedUpdateCourseService,
    UpdatorService,
  ],
})
export class AppModule {}
