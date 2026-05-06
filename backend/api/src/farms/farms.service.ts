import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';
import { Farm, FarmDocument } from '../schemas/farm.schema';
import { CreateFarmDto, UpdateFarmDto } from './farms.dto';

@Injectable()
export class FarmsService {
  constructor(@InjectModel(Farm.name) private farmModel: Model<FarmDocument>) {}

  // ── Create ────────────────────────────────────────────────────────────────
  async create(user_id: string, dto: CreateFarmDto): Promise<Farm> {
    const farm = new this.farmModel({ id: uuidv7(), user_id, ...dto });
    return farm.save();
  }

  // ── List ──────────────────────────────────────────────────────────────────
  // farmer → own farms only | admin → all farms
  async findAll(
    requesterId: string,
    requesterRole: string,
    limit = 20,
    cursor?: string,
  ): Promise<{ items: Farm[]; next_cursor: string | null }> {
    const query: any = { archived_at: null };
    if (requesterRole !== 'admin') query.user_id = requesterId;
    if (cursor) query._id = { $gt: cursor };

    const items = await this.farmModel.find(query).limit(limit + 1).lean();
    const hasMore = items.length > limit;
    if (hasMore) items.pop();

    return {
      items,
      next_cursor: hasMore ? items[items.length - 1]._id.toString() : null,
    };
  }

  // ── Get one ───────────────────────────────────────────────────────────────
  async findOne(
    id: string,
    requesterId: string,
    requesterRole: string,
  ): Promise<Farm> {
    const farm = await this.farmModel.findOne({ id, archived_at: null }).lean();
    if (!farm) throw new NotFoundException(`Farm ${id} not found`);
    if (requesterRole !== 'admin' && farm.user_id !== requesterId) {
      throw new ForbiddenException('You do not own this farm');
    }
    return farm;
  }

  // ── Update ────────────────────────────────────────────────────────────────
  async update(
    id: string,
    requesterId: string,
    requesterRole: string,
    dto: UpdateFarmDto,
  ): Promise<Farm> {
    const farm = await this.farmModel.findOne({ id, archived_at: null });
    if (!farm) throw new NotFoundException(`Farm ${id} not found`);
    if (requesterRole !== 'admin' && farm.user_id !== requesterId) {
      throw new ForbiddenException('You do not own this farm');
    }

    Object.assign(farm, dto);
    return farm.save();
  }

  // ── Soft-delete ───────────────────────────────────────────────────────────
  async remove(
    id: string,
    requesterId: string,
    requesterRole: string,
  ): Promise<{ message: string }> {
    const farm = await this.farmModel.findOne({ id, archived_at: null });
    if (!farm) throw new NotFoundException(`Farm ${id} not found`);
    if (requesterRole !== 'admin' && farm.user_id !== requesterId) {
      throw new ForbiddenException('You do not own this farm');
    }

    farm.archived_at = new Date();
    await farm.save();
    return { message: `Farm ${id} archived` };
  }
}
