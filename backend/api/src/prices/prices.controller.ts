import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PricesService } from './prices.service';

@UseGuards(AuthGuard('jwt'))
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get()
  getLatest(@Query('crop_id') crop_id: string) {
    return this.pricesService.getLatestByCrop(crop_id);
  }

  @Get('best')
  getBest(
    @Query('crop_id') crop_id: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
  ) {
    return this.pricesService.getBestMarket(
      crop_id,
      lat ? parseFloat(lat) : undefined,
      lng ? parseFloat(lng) : undefined,
    );
  }

  @Get('trending')
  getTrending() {
    return this.pricesService.getTrending();
  }
}
