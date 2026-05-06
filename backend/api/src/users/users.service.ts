import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({ phone_e164: dto.phone_e164 });
    if (existing) throw new ConflictException('Phone number already registered');

    const user = new this.userModel({
      id: uuidv7(),
      language: 'rw',
      role: 'farmer',
      ...dto,
    });
    return user.save();
  }

  async findAll(
    limit = 20,
    cursor?: string,
  ): Promise<{ items: User[]; next_cursor: string | null }> {
    const query: any = {};
    if (cursor) query._id = { $gt: cursor };

    const items = await this.userModel
      .find(query)
      .limit(limit + 1)
      .select('-otp_code -otp_expires_at')
      .lean();

    const hasMore = items.length > limit;
    if (hasMore) items.pop();

    return {
      items,
      next_cursor: hasMore ? items[items.length - 1]._id.toString() : null,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findOne({ id })
      .select('-otp_code -otp_expires_at')
      .lean();
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate({ id }, { $set: dto }, { new: true })
      .select('-otp_code -otp_expires_at')
      .lean();
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.userModel.deleteOne({ id });
    if (result.deletedCount === 0)
      throw new NotFoundException(`User ${id} not found`);
    return { message: `User ${id} deleted` };
  }
}
