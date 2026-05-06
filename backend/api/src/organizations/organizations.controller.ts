import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './organizations.dto';

@ApiTags('Organizations (Admin Only)')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  /** POST /v1/organizations — admin only */
  @Post()
  @Roles('admin')
  create(@Body() dto: CreateOrganizationDto) {
    return this.orgsService.create(dto);
  }

  /** GET /v1/organizations — admin, ngo_user, coop_manager */
  @Get()
  @Roles('admin', 'ngo_user', 'coop_manager')
  findAll(@Query('limit') limit?: string, @Query('cursor') cursor?: string) {
    return this.orgsService.findAll(limit ? parseInt(limit) : 20, cursor);
  }

  /** GET /v1/organizations/:id — any authenticated user */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgsService.findOne(id);
  }

  /** PATCH /v1/organizations/:id — admin only */
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.orgsService.update(id, dto);
  }

  /** DELETE /v1/organizations/:id — admin only */
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.orgsService.remove(id);
  }
}
