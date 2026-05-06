import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FarmCrop, FarmCropDocument } from '../schemas/farm-crop.schema';
import { Farm, FarmDocument } from '../schemas/farm.schema';
import { PricesService } from '../prices/prices.service';

@Injectable()
export class InsightsService {
  constructor(
    @InjectModel(FarmCrop.name) private farmCropModel: Model<FarmCropDocument>,
    @InjectModel(Farm.name) private farmModel: Model<FarmDocument>,
    private pricesService: PricesService,
  ) {}

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

      // Rule 3: best market exists → best_market
      recommendations.push({
        farm_crop_id: crop.id,
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
}
