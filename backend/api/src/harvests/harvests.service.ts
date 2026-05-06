import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';
import { Harvest, HarvestDocument } from '../schemas/harvest.schema';
import { FarmCrop, FarmCropDocument } from '../schemas/farm-crop.schema';
import { CreateHarvestDto } from './harvests.dto';

@Injectable()
export class HarvestsService {
  constructor(
    @InjectModel(Harvest.name) private harvestModel: Model<HarvestDocument>,
    @InjectModel(FarmCrop.name) private farmCropModel: Model<FarmCropDocument>,
  ) {}

  async create(farm_crop_id: string, dto: CreateHarvestDto) {
    const farmCrop = await this.farmCropModel.findOne({ id: farm_crop_id });
    if (!farmCrop) throw new NotFoundException('FarmCrop not found');

    // update farm_crop status to harvested
    farmCrop.status = 'harvested';
    await farmCrop.save();

    const harvest = new this.harvestModel({ id: uuidv7(), farm_crop_id, ...dto });
    return harvest.save();
  }
}
