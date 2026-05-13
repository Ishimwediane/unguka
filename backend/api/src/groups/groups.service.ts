import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';
import { GroupSale, GroupSaleDocument } from '../schemas/group-sale.schema';
import { GroupPledge, GroupPledgeDocument } from '../schemas/group-pledge.schema';
import { GroupCollection, GroupCollectionDocument } from '../schemas/group-collection.schema';
import { Membership, MembershipDocument } from '../schemas/membership.schema';
import { Farm, FarmDocument } from '../schemas/farm.schema';
import { FarmCrop, FarmCropDocument } from '../schemas/farm-crop.schema';
import { CreateGroupDto, CreatePledgeDto, UpdatePledgeDto, CreateCollectionDto, TransitionDto } from './groups.dto';

// valid state transitions
const TRANSITIONS: Record<string, string[]> = {
  open: ['filled', 'cancelled'],
  filled: ['confirmed', 'cancelled'],
  confirmed: ['collected', 'cancelled'],
  collected: ['paid', 'cancelled'],
  paid: [],
  cancelled: [],
};

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(GroupSale.name) private groupModel: Model<GroupSaleDocument>,
    @InjectModel(GroupPledge.name) private pledgeModel: Model<GroupPledgeDocument>,
    @InjectModel(GroupCollection.name) private collectionModel: Model<GroupCollectionDocument>,
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
    @InjectModel(Farm.name) private farmModel: Model<FarmDocument>,
    @InjectModel(FarmCrop.name) private farmCropModel: Model<FarmCropDocument>,
  ) {}

  // POST /v1/groups — coop manager creates a group sale
  async create(user_id: string, dto: CreateGroupDto) {
    const membership = await this.membershipModel.findOne({ user_id, role_in_org: { $in: ['manager'] } });
    if (!membership) throw new ForbiddenException('Only coop managers can create group sales');

    const group = new this.groupModel({
      id: uuidv7(),
      organization_id: membership.organization_id,
      ...dto,
      deadline_at: new Date(dto.deadline_at),
      status: 'open',
    });
    return group.save();
  }

  // GET /v1/groups — farmer discovers nearby open groups
  async findAll(crop_id?: string): Promise<any[]> {
    const query: any = { status: 'open', deadline_at: { $gte: new Date() } };
    if (crop_id) query.crop_id = crop_id;

    const groups = await this.groupModel.find(query).lean();

    // attach fill progress % to each group
    const result = await Promise.all(
      groups.map(async (g) => {
        const pledges = await this.pledgeModel.find({ group_sale_id: g.id }).lean();
        const total_pledged = pledges.reduce((sum, p) => sum + p.pledged_qty_kg, 0);
        const fill_pct = Math.min(100, Math.round((total_pledged / g.target_qty_kg) * 100));
        const time_remaining_hours = Math.max(0, Math.round((new Date(g.deadline_at).getTime() - Date.now()) / 3600000));
        return { ...g, total_pledged_kg: total_pledged, fill_pct, time_remaining_hours };
      }),
    );

    return result;
  }

  // GET /v1/groups/:id — group detail with progress
  async findOne(id: string): Promise<any> {
    const group = await this.groupModel.findOne({ id }).lean();
    if (!group) throw new NotFoundException('Group not found');

    const pledges = await this.pledgeModel.find({ group_sale_id: id }).lean();
    const total_pledged = pledges.reduce((sum, p) => sum + p.pledged_qty_kg, 0);
    const fill_pct = Math.min(100, Math.round((total_pledged / group.target_qty_kg) * 100));
    const time_remaining_hours = Math.max(0, Math.round((new Date(group.deadline_at).getTime() - Date.now()) / 3600000));

    return { ...group, total_pledged_kg: total_pledged, fill_pct, time_remaining_hours, pledges };
  }

  // POST /v1/groups/:id/pledges — farmer pledges quantity
  async createPledge(group_id: string, user_id: string, dto: CreatePledgeDto) {
    const group = await this.groupModel.findOne({ id: group_id });
    if (!group) throw new NotFoundException('Group not found');
    if (group.status !== 'open') throw new BadRequestException('Group is not open for pledges');
    if (new Date() > group.deadline_at) throw new BadRequestException('Group deadline has passed');

    const existing = await this.pledgeModel.findOne({ group_sale_id: group_id, user_id });
    if (existing) throw new BadRequestException('You already have a pledge in this group. Use PATCH to update.');

    const pledge = new this.pledgeModel({
      id: uuidv7(),
      group_sale_id: group_id,
      user_id,
      ...dto,
    });
    await pledge.save();

    // auto-transition to filled if target reached
    const allPledges = await this.pledgeModel.find({ group_sale_id: group_id }).lean();
    const total = allPledges.reduce((sum, p) => sum + p.pledged_qty_kg, 0);
    if (total >= group.target_qty_kg && group.status === 'open') {
      group.status = 'filled';
      await group.save();
    }

    return pledge;
  }

  // PATCH /v1/groups/:id/pledges/:pid — farmer updates pledge
  async updatePledge(group_id: string, pledge_id: string, user_id: string, dto: UpdatePledgeDto) {
    const pledge = await this.pledgeModel.findOne({ id: pledge_id, group_sale_id: group_id, user_id });
    if (!pledge) throw new NotFoundException('Pledge not found');

    const group = await this.groupModel.findOne({ id: group_id });
    if (!group || group.status !== 'open') throw new BadRequestException('Can only update pledge when group is open');

    pledge.pledged_qty_kg = dto.pledged_qty_kg;
    return pledge.save();
  }

  // DELETE /v1/groups/:id/pledges/:pid — farmer cancels pledge
  async cancelPledge(group_id: string, pledge_id: string, user_id: string) {
    const pledge = await this.pledgeModel.findOne({ id: pledge_id, group_sale_id: group_id, user_id });
    if (!pledge) throw new NotFoundException('Pledge not found');

    const group = await this.groupModel.findOne({ id: group_id });
    if (!group || group.status !== 'open') throw new BadRequestException('Can only cancel pledge when group is open');

    await this.pledgeModel.deleteOne({ id: pledge_id });
    return { message: 'Pledge cancelled' };
  }

  // POST /v1/groups/:id/collections — coop logs delivered kg per farmer
  async createCollection(group_id: string, dto: CreateCollectionDto) {
    const group = await this.groupModel.findOne({ id: group_id });
    if (!group) throw new NotFoundException('Group not found');
    if (group.status !== 'confirmed') throw new BadRequestException('Group must be confirmed before logging collections');

    const collection = new this.collectionModel({
      id: uuidv7(),
      group_sale_id: group_id,
      ...dto,
      paid_at: dto.paid_amount_rwf ? new Date() : undefined,
    });
    return collection.save();
  }

  // POST /v1/groups/:id/transition — state machine
  async transition(group_id: string, user_id: string, dto: TransitionDto) {
    const group = await this.groupModel.findOne({ id: group_id });
    if (!group) throw new NotFoundException('Group not found');

    const allowed = TRANSITIONS[group.status] || [];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(`Cannot transition from '${group.status}' to '${dto.status}'`);
    }

    // only coop_manager or admin can transition beyond open
    const membership = await this.membershipModel.findOne({ user_id, role_in_org: 'manager' });
    if (!membership) throw new ForbiddenException('Only coop managers can change group status');

    group.status = dto.status;
    return group.save();
  }
}
