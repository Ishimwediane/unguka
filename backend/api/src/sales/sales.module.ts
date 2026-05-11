import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale, SaleSchema } from '../schemas/sale.schema';
import { FarmCrop, FarmCropSchema } from '../schemas/farm-crop.schema';
import { PricesModule } from '../prices/prices.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sale.name, schema: SaleSchema },
      { name: FarmCrop.name, schema: FarmCropSchema },
    ]),
    PricesModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
