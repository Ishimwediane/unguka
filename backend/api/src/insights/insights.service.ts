import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FarmCrop, FarmCropDocument } from '../schemas/farm-crop.schema';
import { Farm, FarmDocument } from '../schemas/farm.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Expense, ExpenseDocument } from '../schemas/expense.schema';
import { Harvest, HarvestDocument } from '../schemas/harvest.schema';
import { GroupSale, GroupSaleDocument } from '../schemas/group-sale.schema';
import { PricesService } from '../prices/prices.service';

@Injectable()
export class InsightsService {
  constructor(
    @InjectModel(FarmCrop.name) private farmCropModel: Model<FarmCropDocument>,
    @InjectModel(Farm.name) private farmModel: Model<FarmDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
    @InjectModel(Harvest.name) private harvestModel: Model<HarvestDocument>,
    @InjectModel(GroupSale.name) private groupModel: Model<GroupSaleDocument>,
    private pricesService: PricesService,
  ) { }

  async getRecommendations(user_id: string) {
    const farms = await this.farmModel.find({ user_id, archived_at: null }).lean();
    const farmIds = farms.map((f) => f.id);

    const activeCrops = await this.farmCropModel
      .find({ farm_id: { $in: farmIds }, status: { $in: ['planted', 'growing', 'near_harvest'] } })
      .lean();

    const recommendations: any[] = [];

    for (const crop of activeCrops) {
      const best = await this.pricesService.getBestMarket(crop.crop_id);
      if (!best) continue;

      const daysToHarvest = crop.expected_harvest_at
        ? Math.ceil((new Date(crop.expected_harvest_at).getTime() - Date.now()) / 86400000)
        : null;

      // Rule 1: near harvest + good price → sell_now
      if (daysToHarvest !== null && daysToHarvest <= 14 && best.price_per_kg_rwf > 0) {
        recommendations.push({
          farm_crop_id: crop.id,
          crop_id: crop.crop_id,
          kind: 'sell_now',
          confidence: 0.85,
          payload: {
            market_name: best.market?.name,
            price_per_kg_rwf: best.price_per_kg_rwf,
            uplift_rwf_per_kg: best.uplift_rwf_per_kg,
            freshness_hours: best.freshness_hours,
            source_count: best.source_count,
            explanation_en: `Best market: ${best.market?.name}, +${best.uplift_rwf_per_kg} RWF/kg above local`,
            explanation_rw: `Isoko ryiza: ${best.market?.name}, +${best.uplift_rwf_per_kg} RWF/kg`,
          },
        });
        continue;
      }

      // Rule 2: harvest far away → wait
      if (daysToHarvest !== null && daysToHarvest > 14) {
        recommendations.push({
          farm_crop_id: crop.id,
          crop_id: crop.crop_id,
          kind: 'wait',
          confidence: 0.7,
          payload: {
            days_to_harvest: daysToHarvest,
            explanation_en: `Harvest in ${daysToHarvest} days. Monitor prices closer to harvest.`,
            explanation_rw: `Isarura mu minsi ${daysToHarvest}. Kurikirana ibiciro.`,
          },
        });
        continue;
      }

      // Rule 3: check open group sales for this crop → join_group if uplift ≥ 10%
      const openGroups = await this.groupModel
        .find({ crop_id: crop.crop_id, status: 'open', deadline_at: { $gte: new Date() } })
        .lean();

      for (const group of openGroups) {
        if (!best.price_per_kg_rwf || !group.target_price_per_kg_rwf) continue;
        const uplift_pct = ((group.target_price_per_kg_rwf - best.price_per_kg_rwf) / best.price_per_kg_rwf) * 100;
        if (uplift_pct >= 10) {
          recommendations.push({
            farm_crop_id: crop.id,
            crop_id: crop.crop_id,
            kind: 'join_group',
            confidence: 0.9,
            payload: {
              group_sale_id: group.id,
              collection_center: group.collection_center,
              target_price_per_kg_rwf: group.target_price_per_kg_rwf,
              best_individual_price_rwf: best.price_per_kg_rwf,
              uplift_pct: Math.round(uplift_pct),
              deadline_at: group.deadline_at,
              explanation_en: `Group earns +${Math.round(uplift_pct)}% over your local price. Join before ${new Date(group.deadline_at).toLocaleDateString()}.`,
              explanation_rw: `Itsinda ryinjiza +${Math.round(uplift_pct)}% kuruta isoko ryawe. Injira mbere ya ${new Date(group.deadline_at).toLocaleDateString()}.`,
            },
          });
          break; // one join_group recommendation per crop
        }
      }

      // Rule 4: best market exists → best_market
      recommendations.push({
        farm_crop_id: crop.id,
        crop_id: crop.crop_id,
        kind: 'best_market',
        confidence: 0.75,
        payload: {
          market_name: best.market?.name,
          price_per_kg_rwf: best.price_per_kg_rwf,
          distance_km: best.distance_km,
          freshness_hours: best.freshness_hours,
          source_count: best.source_count,
          explanation_en: `Sell at ${best.market?.name} for ${best.price_per_kg_rwf} RWF/kg`,
          explanation_rw: `Gurisha i ${best.market?.name} kuri ${best.price_per_kg_rwf} RWF/kg`,
        },
      });
    }

    return recommendations;
  }

  async getSummary(user_id: string) {
    const farms = await this.farmModel.find({ user_id, archived_at: null }).lean();
    const farmIds = farms.map((f) => f.id);

    const activeCrops = await this.farmCropModel
      .find({ farm_id: { $in: farmIds }, status: { $in: ['planted', 'growing', 'near_harvest', 'harvested'] } })
      .lean();

    let totalEstimatedRevenue = 0;
    let totalExpenses = 0;

    for (const crop of activeCrops) {
      // 1. Calculate Expenses
      const expenses = await this.expenseModel.find({ farm_crop_id: crop.id }).lean();
      const cropExpenses = expenses.reduce((sum, e) => sum + e.amount_rwf, 0);
      totalExpenses += cropExpenses;

      // 2. Calculate Revenue
      const best = await this.pricesService.getBestMarket(crop.crop_id);
      if (best) {
        const qty = Number(crop.expected_qty_kg) || 0;
        totalEstimatedRevenue += qty * best.price_per_kg_rwf;
      }
    }

    return {
      active_crops_count: activeCrops.length,
      total_estimated_revenue_rwf: totalEstimatedRevenue,
      total_expenses_rwf: totalExpenses,
      estimated_profit_rwf: totalEstimatedRevenue - totalExpenses,
    };
  }

  async getMarketComparison(farm_crop_id: string, user_id: string) {
    const crop = await this.farmCropModel.findOne({ id: farm_crop_id }).lean();
    if (!crop) throw new Error('Farm crop not found');

    const user = await this.userModel.findOne({ id: user_id }).lean();
    const expenses = await this.expenseModel.find({ farm_crop_id }).lean();
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount_rwf, 0);

    // Get latest prices for this crop across ALL markets
    const latestPrices = await this.pricesService.getLatestByCrop(crop.crop_id);
    
    const comparison = await Promise.all(
      latestPrices.map(async (p) => {
        const market = await this.pricesService['marketModel'].findOne({ id: p.market_id }).lean();
        
        // Calculate Distance/Penalty
        let distance_km: number | null = null;
        let penalty = 0;
        if (user?.gps_lat && user?.gps_lng && market?.gps_lat && market?.gps_lng) {
          const haversineKm = (lat1, lon1, lat2, lon2) => {
            const R = 6371;
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          };
          distance_km = haversineKm(user.gps_lat, user.gps_lng, market.gps_lat, market.gps_lng);
          penalty = distance_km * 2;
        } else if (user?.district && market?.district) {
          const isSameDistrict = user.district.toLowerCase() === market.district.toLowerCase();
          penalty = isSameDistrict ? 0 : 50;
          distance_km = isSameDistrict ? 5 : 25;
        }

        const effectivePrice = p.price_per_kg_rwf - penalty;
        const revenue = (Number(crop.expected_qty_kg) || 0) * p.price_per_kg_rwf;
        const profit = revenue - totalExpenses;

        const trend = await this.pricesService.getPriceTrend(p.market_id, crop.crop_id);

        return {
          market_id: p.market_id,
          market_name: market?.name,
          district: market?.district,
          price_per_kg_rwf: p.price_per_kg_rwf,
          effective_price_rwf: effectivePrice,
          estimated_revenue_rwf: revenue,
          estimated_profit_rwf: profit,
          distance_km: distance_km ? Math.round(distance_km) : null,
          trend,
          freshness_hours: p.freshness_hours,
        };
      })
    );

    return comparison.sort((a, b) => b.estimated_profit_rwf - a.estimated_profit_rwf);
  }
}
