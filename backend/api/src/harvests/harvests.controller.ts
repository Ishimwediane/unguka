import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HarvestsService } from './harvests.service';
import { CreateHarvestDto } from './harvests.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('farm-crops/:id/harvests')
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Post()
  create(@Param('id') id: string, @Body() dto: CreateHarvestDto) {
    return this.harvestsService.create(id, dto);
  }
}
