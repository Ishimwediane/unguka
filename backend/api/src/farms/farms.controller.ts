import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FarmsService } from './farms.service';
import { CreateFarmDto, UpdateFarmDto } from './farms.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  /** POST /v1/farms — farmer creates their own farm */
  @Post()
  create(@Request() req, @Body() dto: CreateFarmDto) {
    return this.farmsService.create(req.user.id, dto);
  }

  /** GET /v1/farms — farmer: own farms | admin: all farms */
  @Get()
  findAll(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.farmsService.findAll(
      req.user.id,
      req.user.role,
      limit ? parseInt(limit) : 20,
      cursor,
    );
  }

  /** GET /v1/farms/:id — farmer: own | admin: any */
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.farmsService.findOne(id, req.user.id, req.user.role);
  }

  /** PATCH /v1/farms/:id — farmer: own | admin: any */
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateFarmDto,
  ) {
    return this.farmsService.update(id, req.user.id, req.user.role, dto);
  }

  /** DELETE /v1/farms/:id — soft-delete, farmer: own | admin: any */
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.farmsService.remove(id, req.user.id, req.user.role);
  }
}
