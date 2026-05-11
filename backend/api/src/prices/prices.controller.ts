import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PricesService } from './prices.service';

@ApiTags('prices')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get()
  @ApiOperation({ summary: 'Get latest prices for a crop across all markets' })
  @ApiQuery({ name: 'crop_id', description: 'UUID of the crop' })
  getLatest(@Query('crop_id') crop_id: string) {
    return this.pricesService.getLatestByCrop(crop_id);
  }

  @Get('best')
  @ApiOperation({ summary: 'Find the best market for a crop based on price and distance' })
  @ApiQuery({ name: 'crop_id', description: 'UUID of the crop' })
  @ApiQuery({ name: 'lat', required: false, description: 'Farmer latitude' })
  @ApiQuery({ name: 'lng', required: false, description: 'Farmer longitude' })
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
  @ApiOperation({ summary: 'Get crops with the highest price increase in the last 7 days' })
  getTrending() {
    return this.pricesService.getTrending();
  }
}
