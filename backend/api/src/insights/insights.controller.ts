import { Controller, Get, Request, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { InsightsService } from './insights.service';

@ApiTags('insights')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  @ApiOperation({ summary: 'Get crop recommendations for the authenticated farmer' })
  getRecommendations(@Request() req) {
    return this.insightsService.getRecommendations(req.user.id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get estimated profit and expense summary' })
  getSummary(@Request() req) {
    return this.insightsService.getSummary(req.user.id);
  }

  @Get('market-comparison')
  @ApiOperation({ summary: 'Compare profit across all markets for a specific crop' })
  @ApiQuery({ name: 'farm_crop_id', description: 'UUID of the farm crop cycle' })
  getMarketComparison(@Request() req, @Query('farm_crop_id') farm_crop_id: string) {
    return this.insightsService.getMarketComparison(farm_crop_id, req.user.id);
  }
}
