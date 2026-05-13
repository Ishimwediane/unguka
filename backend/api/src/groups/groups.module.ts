import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { GroupSale, GroupSaleSchema } from '../schemas/group-sale.schema';
import { GroupPledge, GroupPledgeSchema } from '../schemas/group-pledge.schema';
import { GroupCollection, GroupCollectionSchema } from '../schemas/group-collection.schema';
import { Membership, MembershipSchema } from '../schemas/membership.schema';
import { Farm, FarmSchema } from '../schemas/farm.schema';
import { FarmCrop, FarmCropSchema } from '../schemas/farm-crop.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupSale.name, schema: GroupSaleSchema },
      { name: GroupPledge.name, schema: GroupPledgeSchema },
      { name: GroupCollection.name, schema: GroupCollectionSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: Farm.name, schema: FarmSchema },
      { name: FarmCrop.name, schema: FarmCropSchema },
    ]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
