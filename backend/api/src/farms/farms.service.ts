import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';
import { Farm, FarmDocument } from '../schemas/farm.schema';
import { CreateFarmDto } from './farms.dto';

@Injectable()
export class FarmsService {
  constructor(@InjectModel(Farm.name) private farmModel: Model<FarmDocument>) {}

  async create(user_id: string, dto: CreateFarmDto): Promise<Farm> {
    const farm = new this.farmModel({ id: uuidv7(), user_id, ...dto });
    return farm.save();
  }

  async findAll(user_id: string, limit = 20, cursor?: string): Promise<{ items: Farm[]; next_cursor: string | null }> {
    const query: any = { user_id, archived_at: null };
    if (cursor) query._id = { $gt: cursor };

    const items = await this.farmModel.find(query).limit(limit + 1).lean();
    const hasMore = items.length > limit;
    if (hasMore) items.pop();

    return {
      items,
      next_cursor: hasMore ? items[items.length - 1]._id.toString() : null,
    };
  }
}
