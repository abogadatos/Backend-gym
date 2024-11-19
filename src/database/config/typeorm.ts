import { DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';
import { config as dotenvConfiguracion } from 'dotenv';

dotenvConfiguracion({ path: '.development.env' });

export default registerAs(
  'typeorm',
  () =>
    ({
      type: 'postgres',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
      autoLoadEntities: true,
      logger: 'advanced-console',
      synchronize: process.env.DB_SYNC === 'true',
      logging: true,
      dropSchema: true,
      retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS, 10) || 5,
      retryDelay: parseInt(process.env.DB_RETRY_DELAY, 10) || 3000,
    }) as DataSourceOptions,
);
