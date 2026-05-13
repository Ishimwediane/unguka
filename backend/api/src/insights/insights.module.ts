import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';
import { FarmCrop, FarmCropSchema } from '../schemas/farm-crop.schema';
import { Farm, FarmSchema } from '../schemas/farm.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Expense, ExpenseSchema } from '../schemas/expense.schema';
import { Harvest, HarvestSchema } from '../schemas/harvest.schema';
import { GroupSale, GroupSaleSchema } from '../schemas/group-sale.schema';
import { PricesModule } from '../prices/prices.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FarmCrop.name, schema: FarmCropSchema },
      { name: Farm.name, schema: FarmSchema },
      { name: User.name, schema: UserSchema },
      { name: Expense.name, schema: ExpenseSchema },
      { name: Harvest.name, schema: HarvestSchema },
      { name: GroupSale.name, schema: GroupSaleSchema },
    ]),
    PricesModule,
  ],
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
