import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, UserSchema } from './schemas/user.schema';
import { Organization, OrganizationSchema } from './schemas/organization.schema';
import { Membership, MembershipSchema } from './schemas/membership.schema';
import { Crop, CropSchema } from './schemas/crop.schema';
import { Farm, FarmSchema } from './schemas/farm.schema';
import { FarmCrop, FarmCropSchema } from './schemas/farm-crop.schema';
import { AuthModule } from './auth/auth.module';
import { FarmsModule } from './farms/farms.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ExpensesModule } from './expenses/expenses.module';
import { HarvestsModule } from './harvests/harvests.module';
import { SalesModule } from './sales/sales.module';
import { PricesModule } from './prices/prices.module';
import { InsightsModule } from './insights/insights.module';
import { GroupsModule } from './groups/groups.module';
import { CoopModule } from './coop/coop.module';
import { GroupSale, GroupSaleSchema } from './schemas/group-sale.schema';
import { GroupPledge, GroupPledgeSchema } from './schemas/group-pledge.schema';
import { GroupCollection, GroupCollectionSchema } from './schemas/group-collection.schema';
import { Expense, ExpenseSchema } from './schemas/expense.schema';
import { Harvest, HarvestSchema } from './schemas/harvest.schema';
import { Sale, SaleSchema } from './schemas/sale.schema';
import { Market, MarketSchema } from './schemas/market.schema';
import { MarketPrice, MarketPriceSchema } from './schemas/market-price.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: Crop.name, schema: CropSchema },
      { name: Farm.name, schema: FarmSchema },
      { name: FarmCrop.name, schema: FarmCropSchema },
      { name: Expense.name, schema: ExpenseSchema },
      { name: Harvest.name, schema: HarvestSchema },
      { name: Sale.name, schema: SaleSchema },
      { name: Market.name, schema: MarketSchema },
      { name: MarketPrice.name, schema: MarketPriceSchema },
      { name: GroupSale.name, schema: GroupSaleSchema },
      { name: GroupPledge.name, schema: GroupPledgeSchema },
      { name: GroupCollection.name, schema: GroupCollectionSchema },
    ]),
    AuthModule,
    FarmsModule,
    UsersModule,
    OrganizationsModule,
    ExpensesModule,
    HarvestsModule,
    SalesModule,
    PricesModule,
    InsightsModule,
    GroupsModule,
    CoopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
