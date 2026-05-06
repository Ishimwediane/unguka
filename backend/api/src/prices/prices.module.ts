import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { MarketPrice, MarketPriceSchema } from '../schemas/market-price.schema';
import { Market, MarketSchema } from '../schemas/market.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MarketPrice.name, schema: MarketPriceSchema },
      { name: Market.name, schema: MarketSchema },
    ]),
  ],
  controllers: [PricesController],
  providers: [PricesService],
  exports: [PricesService],
})
export class PricesModule {}
