import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';
import { Organization, OrganizationDocument } from '../schemas/organization.schema';
import { CreateOrganizationDto, UpdateOrganizationDto } from './organizations.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private orgModel: Model<OrganizationDocument>,
  ) {}

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    const org = new this.orgModel({ id: uuidv7(), ...dto });
    return org.save();
  }

  async findAll(
    limit = 20,
    cursor?: string,
  ): Promise<{ items: Organization[]; next_cursor: string | null }> {
    const query: any = {};
    if (cursor) query._id = { $gt: cursor };

    const items = await this.orgModel.find(query).limit(limit + 1).lean();
    const hasMore = items.length > limit;
    if (hasMore) items.pop();

    return {
      items,
      next_cursor: hasMore ? items[items.length - 1]._id.toString() : null,
    };
  }

  async findOne(id: string): Promise<Organization> {
    const org = await this.orgModel.findOne({ id }).lean();
    if (!org) throw new NotFoundException(`Organization ${id} not found`);
    return org;
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    const org = await this.orgModel
      .findOneAndUpdate({ id }, { $set: dto }, { new: true })
      .lean();
    if (!org) throw new NotFoundException(`Organization ${id} not found`);
    return org;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.orgModel.deleteOne({ id });
    if (result.deletedCount === 0)
      throw new NotFoundException(`Organization ${id} not found`);
    return { message: `Organization ${id} deleted` };
  }
}
