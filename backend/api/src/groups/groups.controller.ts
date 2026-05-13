import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupsService } from './groups.service';
import { CreateGroupDto, CreatePledgeDto, UpdatePledgeDto, CreateCollectionDto, TransitionDto } from './groups.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // coop manager creates a group sale
  @Post()
  create(@Request() req, @Body() dto: CreateGroupDto) {
    return this.groupsService.create(req.user.id, dto);
  }

  // farmer discovers nearby open groups
  @Get()
  findAll(@Query('crop_id') crop_id?: string): Promise<any[]> {
    return this.groupsService.findAll(crop_id);
  }

  // group detail with fill progress %
  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.groupsService.findOne(id);
  }

  // farmer pledges quantity to a group
  @Post(':id/pledges')
  createPledge(@Param('id') id: string, @Request() req, @Body() dto: CreatePledgeDto) {
    return this.groupsService.createPledge(id, req.user.id, dto);
  }

  // farmer updates their pledge
  @Patch(':id/pledges/:pid')
  updatePledge(@Param('id') id: string, @Param('pid') pid: string, @Request() req, @Body() dto: UpdatePledgeDto) {
    return this.groupsService.updatePledge(id, pid, req.user.id, dto);
  }

  // farmer cancels their pledge
  @Delete(':id/pledges/:pid')
  cancelPledge(@Param('id') id: string, @Param('pid') pid: string, @Request() req) {
    return this.groupsService.cancelPledge(id, pid, req.user.id);
  }

  // coop logs collection day deliveries
  @Post(':id/collections')
  createCollection(@Param('id') id: string, @Body() dto: CreateCollectionDto) {
    return this.groupsService.createCollection(id, dto);
  }

  // coop manager transitions group state
  @Post(':id/transition')
  transition(@Param('id') id: string, @Request() req, @Body() dto: TransitionDto) {
    return this.groupsService.transition(id, req.user.id, dto);
  }
}
