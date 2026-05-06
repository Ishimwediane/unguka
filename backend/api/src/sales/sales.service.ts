import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';
import { Sale, SaleDocument } from '../schemas/sale.schema';
import { CreateSaleDto } from './sales.dto';

@Injectable()
export class SalesService {
  constructor(@InjectModel(Sale.name) private saleModel: Model<SaleDocument>) {}

  async create(dto: CreateSaleDto) {
    const sale = new this.saleModel({ id: uuidv7(), ...dto });
    return sale.save();
  }
}
