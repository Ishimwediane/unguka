import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HarvestsController } from './harvests.controller';
import { HarvestsService } from './harvests.service';
import { Harvest, HarvestSchema } from '../schemas/harvest.schema';
import { FarmCrop, FarmCropSchema } from '../schemas/farm-crop.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Harvest.name, schema: HarvestSchema },
      { name: FarmCrop.name, schema: FarmCropSchema },
    ]),
  ],
  controllers: [HarvestsController],
  providers: [HarvestsService],
})
export class HarvestsModule {}
