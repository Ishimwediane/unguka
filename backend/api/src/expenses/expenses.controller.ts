import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './expenses.dto';

@ApiTags('expenses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('farm-crops/:id/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Log a new expense for a farm crop cycle' })
  @ApiParam({ name: 'id', description: 'UUID of the farm crop cycle' })
  create(@Param('id') id: string, @Request() req, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(id, req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all expenses for a specific farm crop cycle' })
  @ApiParam({ name: 'id', description: 'UUID of the farm crop cycle' })
  findAll(@Param('id') id: string) {
    return this.expensesService.findAll(id);
  }
}
