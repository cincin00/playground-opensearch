import { ConfigModule } from '@nestjs/config';

/**
 * ConfigModule 로 nestjs 에서 dotenv 를 사용하여 환경 설정을 이용할 수 있도록 함.
 * @link https://docs.nestjs.com/techniques/configuration
 */

export const ConfigureModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['.env', '.env.development', '.env.development.local'],
});
