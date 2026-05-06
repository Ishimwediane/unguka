import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';
import { FarmCrop, FarmCropSchema } from '../schemas/farm-crop.schema';
import { Farm, FarmSchema } from '../schemas/farm.schema';
import { PricesModule } from '../prices/prices.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FarmCrop.name, schema: FarmCropSchema },
      { name: Farm.name, schema: FarmSchema },
    ]),
    PricesModule,
  ],
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
