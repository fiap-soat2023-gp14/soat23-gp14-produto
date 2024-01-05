import { Module } from '@nestjs/common';

import ApplicationModule from '../core/application/application.module';
import ProductApi from './api/ProductApi';
import { MongoConnection } from './adapters/external/MongoConnection';
import { IConnection } from './adapters/external/IConnection';

@Module({
  imports: [ApplicationModule],
  controllers: [ProductApi],
  providers: [
    {
      provide: IConnection,
      useClass: MongoConnection,
    },
  ]
})
export default class InfrastructureModule {}
