import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';
import { Expense, ExpenseDocument } from '../schemas/expense.schema';
import { FarmCrop, FarmCropDocument } from '../schemas/farm-crop.schema';
import { CreateExpenseDto } from './expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
    @InjectModel(FarmCrop.name) private farmCropModel: Model<FarmCropDocument>,
  ) {}

  async create(farm_crop_id: string, user_id: string, dto: CreateExpenseDto) {
    const farmCrop = await this.farmCropModel.findOne({ id: farm_crop_id });
    if (!farmCrop) throw new NotFoundException('FarmCrop not found');

    const expense = new this.expenseModel({
      id: uuidv7(),
      farm_crop_id,
      created_by: user_id,
      ...dto,
    });
    return expense.save();
  }

  async findAll(farm_crop_id: string) {
    return this.expenseModel.find({ farm_crop_id }).sort({ occurred_on: -1 }).lean();
  }
}
