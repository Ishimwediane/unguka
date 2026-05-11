import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { HarvestsService } from './harvests.service';
import { CreateHarvestDto } from './harvests.dto';

@ApiTags('harvests')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('farm-crops/:id/harvests')
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Post()
  @ApiOperation({ summary: 'Log a new harvest for a farm crop cycle' })
  @ApiParam({ name: 'id', description: 'UUID of the farm crop cycle' })
  create(@Param('id') id: string, @Body() dto: CreateHarvestDto) {
    return this.harvestsService.create(id, dto);
  }
}
