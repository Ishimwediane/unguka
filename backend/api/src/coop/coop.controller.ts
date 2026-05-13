import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoopService } from './coop.service';

@UseGuards(AuthGuard('jwt'))
@Controller('coop')
export class CoopController {
  constructor(private readonly coopService: CoopService) {}

  // KPI overview tiles for coop dashboard
  @Get('overview')
  getOverview(@Request() req) {
    return this.coopService.getOverview(req.user.id);
  }

  // member roster with active crops
  @Get('farmers')
  getFarmers(@Request() req) {
    return this.coopService.getFarmers(req.user.id);
  }
}
