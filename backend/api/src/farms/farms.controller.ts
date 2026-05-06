import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './farms.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateFarmDto) {
    return this.farmsService.create(req.user.id, dto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.farmsService.findAll(req.user.id, limit ? parseInt(limit) : 20, cursor);
  }
}
