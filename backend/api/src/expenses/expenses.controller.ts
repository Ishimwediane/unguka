import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './expenses.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('farm-crops/:id/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Param('id') id: string, @Request() req, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(id, req.user.id, dto);
  }

  @Get()
  findAll(@Param('id') id: string) {
    return this.expensesService.findAll(id);
  }
}
