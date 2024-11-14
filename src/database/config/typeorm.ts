import { registerAs } from '@nestjs/config';
import { config as dotenvConfiguration } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenvConfiguration({ path: '.development.env' });

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
      synchronize: true,
      logging: true,
      dropSchema: false,
    }) as DataSourceOptions,
);
