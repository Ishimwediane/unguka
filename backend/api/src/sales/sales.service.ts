import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';
import { Sale, SaleDocument } from '../schemas/sale.schema';
import { FarmCrop, FarmCropDocument } from '../schemas/farm-crop.schema';
import { PricesService } from '../prices/prices.service';
import { CreateSaleDto } from './sales.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(FarmCrop.name) private farmCropModel: Model<FarmCropDocument>,
    private pricesService: PricesService,
  ) {}

  async create(dto: CreateSaleDto) {
    const sale = new this.saleModel({ id: uuidv7(), ...dto });
    const savedSale = await sale.save();

    // Feedback loop: Report this price to the market comparison system
    if (dto.farm_crop_id && dto.market_id) {
      const cropCycle = await this.farmCropModel.findOne({ id: dto.farm_crop_id }).lean();
      if (cropCycle) {
        await this.pricesService.reportFromSale(dto.market_id, cropCycle.crop_id, dto.price_per_kg_rwf);
      }
    }

    return savedSale;
  }
}
