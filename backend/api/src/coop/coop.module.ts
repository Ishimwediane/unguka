import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoopController } from './coop.controller';
import { CoopService } from './coop.service';
import { Membership, MembershipSchema } from '../schemas/membership.schema';
import { GroupSale, GroupSaleSchema } from '../schemas/group-sale.schema';
import { GroupPledge, GroupPledgeSchema } from '../schemas/group-pledge.schema';
import { GroupCollection, GroupCollectionSchema } from '../schemas/group-collection.schema';
import { Farm, FarmSchema } from '../schemas/farm.schema';
import { FarmCrop, FarmCropSchema } from '../schemas/farm-crop.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Membership.name, schema: MembershipSchema },
      { name: GroupSale.name, schema: GroupSaleSchema },
      { name: GroupPledge.name, schema: GroupPledgeSchema },
      { name: GroupCollection.name, schema: GroupCollectionSchema },
      { name: Farm.name, schema: FarmSchema },
      { name: FarmCrop.name, schema: FarmCropSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CoopController],
  providers: [CoopService],
})
export class CoopModule {}
