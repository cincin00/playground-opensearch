import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigureModule } from '../config/config.module';

/**
 * ConfigModule 객체와 함께 TypeOrmModule 설정 처리.
 * @link https://nestjs.burt.pe.kr/techniques/database
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigureModule], // ConfigService 주입을 위해 설정 모듈 로딩
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('MYSQL_HOST'),
        port: config.get<number>('MYSQL_DB_PORT') ?? 3306,
        username: config.get<string>('MYSQL_USER'),
        password: config.get<string>('MYSQL_PASSWORD'),
        database: config.get<string>('MYSQL_DATABASE'),
        synchronize: false, // 운영 환경에선 반드시 false (DDL 자동 생성 방지)
        autoLoadEntities: true, // 각 feature module의 forFeature() 호출 시 자동 인식되게 설정
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
