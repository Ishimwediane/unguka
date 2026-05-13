import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Membership, MembershipDocument } from '../schemas/membership.schema';
import { GroupSale, GroupSaleDocument } from '../schemas/group-sale.schema';
import { GroupPledge, GroupPledgeDocument } from '../schemas/group-pledge.schema';
import { GroupCollection, GroupCollectionDocument } from '../schemas/group-collection.schema';
import { Farm, FarmDocument } from '../schemas/farm.schema';
import { FarmCrop, FarmCropDocument } from '../schemas/farm-crop.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class CoopService {
  constructor(
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
    @InjectModel(GroupSale.name) private groupModel: Model<GroupSaleDocument>,
    @InjectModel(GroupPledge.name) private pledgeModel: Model<GroupPledgeDocument>,
    @InjectModel(GroupCollection.name) private collectionModel: Model<GroupCollectionDocument>,
    @InjectModel(Farm.name) private farmModel: Model<FarmDocument>,
    @InjectModel(FarmCrop.name) private farmCropModel: Model<FarmCropDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async getOrgId(user_id: string): Promise<string> {
    const membership = await this.membershipModel.findOne({ user_id, role_in_org: 'manager' });
    if (!membership) throw new ForbiddenException('Only coop managers can access this');
    return membership.organization_id;
  }

  // GET /v1/coop/overview — KPI tiles
  async getOverview(user_id: string) {
    const org_id = await this.getOrgId(user_id);

    const groups = await this.groupModel.find({ organization_id: org_id }).lean();
    const groupIds = groups.map((g) => g.id);

    const [totalMembers, activeGroups, collections] = await Promise.all([
      this.membershipModel.countDocuments({ organization_id: org_id }),
      this.groupModel.countDocuments({ organization_id: org_id, status: { $in: ['open', 'filled', 'confirmed'] } }),
      this.collectionModel.find({ group_sale_id: { $in: groupIds } }).lean(),
    ]);

    const total_rwf_collected = collections.reduce((sum, c) => sum + (c.paid_amount_rwf || 0), 0);
    const total_kg_collected = collections.reduce((sum, c) => sum + c.delivered_qty_kg, 0);

    const pledges = await this.pledgeModel.find({ group_sale_id: { $in: groupIds } }).lean();
    const total_pledged_kg = pledges.reduce((sum, p) => sum + p.pledged_qty_kg, 0);

    return {
      total_members: totalMembers,
      active_groups: activeGroups,
      total_groups: groups.length,
      total_pledged_kg,
      total_kg_collected,
      total_rwf_collected,
      groups_by_status: groups.reduce((acc: any, g) => {
        acc[g.status] = (acc[g.status] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  // GET /v1/coop/farmers — member roster with active crops
  async getFarmers(user_id: string) {
    const org_id = await this.getOrgId(user_id);

    const memberships = await this.membershipModel.find({ organization_id: org_id }).lean();
    const memberUserIds = memberships.map((m) => m.user_id);

    const users = await this.userModel.find({ id: { $in: memberUserIds } }).lean();

    const result = await Promise.all(
      users.map(async (u) => {
        const farms = await this.farmModel.find({ user_id: u.id, archived_at: null }).lean();
        const farmIds = farms.map((f) => f.id);
        const activeCrops = await this.farmCropModel
          .find({ farm_id: { $in: farmIds }, status: { $in: ['planted', 'growing', 'near_harvest'] } })
          .lean();

        return {
          id: u.id,
          full_name: u.full_name,
          phone_e164: u.phone_e164,
          district: u.district,
          farms_count: farms.length,
          active_crops_count: activeCrops.length,
          membership_role: memberships.find((m) => m.user_id === u.id)?.role_in_org,
        };
      }),
    );

    return result;
  }
}
