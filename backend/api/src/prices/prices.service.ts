import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';
import { MarketPrice, MarketPriceDocument } from '../schemas/market-price.schema';
import { Market, MarketDocument } from '../schemas/market.schema';

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

@Injectable()
export class PricesService {
  constructor(
    @InjectModel(MarketPrice.name) private priceModel: Model<MarketPriceDocument>,
    @InjectModel(Market.name) private marketModel: Model<MarketDocument>,
  ) { }

  async getLatestByCrop(crop_id: string) {
    const prices = await this.priceModel
      .aggregate([
        { $match: { crop_id } },
        { $sort: { reported_at: -1 } },
        { $group: { _id: '$market_id', doc: { $first: '$$ROOT' } } },
        { $replaceRoot: { newRoot: '$doc' } },
      ]);

    return prices.map((p) => ({
      ...p,
      freshness_hours: Math.round((Date.now() - new Date(p.reported_at).getTime()) / 3600000),
    }));
  }

  async getBestMarket(crop_id: string, from_lat?: number, from_lng?: number) {
    const prices = await this.getLatestByCrop(crop_id);
    if (!prices.length) return null;

    const markets = await this.marketModel.find().lean();
    const marketMap = Object.fromEntries(markets.map((m) => [m.id, m]));

    const scored = prices.map((p) => {
      const market = marketMap[p.market_id];
      let distance_km: number | null = null;
      let score = p.price_per_kg_rwf;

      if (from_lat && from_lng && market?.gps_lat && market?.gps_lng) {
        distance_km = haversineKm(from_lat, from_lng, market.gps_lat, market.gps_lng);
        score = p.price_per_kg_rwf - (distance_km as number) * 2;
      }

      return { ...p, market, distance_km, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];

    return {
      market: best.market,
      price_per_kg_rwf: best.price_per_kg_rwf,
      distance_km: best.distance_km,
      freshness_hours: best.freshness_hours,
      source_count: best.source_count,
      uplift_rwf_per_kg: best.price_per_kg_rwf - scored[scored.length - 1].price_per_kg_rwf,
    };
  }

  async getPriceTrend(market_id: string, crop_id: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const latest = await this.priceModel
      .findOne({ market_id, crop_id })
      .sort({ reported_at: -1 })
      .lean();

    if (!latest) return 'stable';

    const historical = await this.priceModel
      .findOne({
        market_id,
        crop_id,
        reported_at: { $lte: sevenDaysAgo },
      })
      .sort({ reported_at: -1 })
      .lean();

    if (!historical) return 'stable';

    const diff = latest.price_per_kg_rwf - historical.price_per_kg_rwf;
    const threshold = historical.price_per_kg_rwf * 0.02;

    if (diff > threshold) return 'rising';
    if (diff < -threshold) return 'falling';
    return 'stable';
  }

  async getTrending() {
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);

    const result = await this.priceModel.aggregate([
      { $match: { reported_at: { $gte: since } } },
      { $sort: { crop_id: 1, reported_at: 1 } },
      {
        $group: {
          _id: '$crop_id',
          first_price: { $first: '$price_per_kg_rwf' },
          last_price: { $last: '$price_per_kg_rwf' },
          latest_at: { $last: '$reported_at' },
        },
      },
      {
        $project: {
          crop_id: '$_id',
          first_price: 1,
          last_price: 1,
          latest_at: 1,
          change_pct: {
            $multiply: [
              { $divide: [{ $subtract: ['$last_price', '$first_price'] }, '$first_price'] },
              100,
            ],
          },
        },
      },
      { $sort: { change_pct: -1 } },
      { $limit: 7 },
    ]);

    return result;
  }

  async reportFromSale(market_id: string, crop_id: string, price: number) {
    const report = new this.priceModel({
      id: uuidv7(),
      market_id,
      crop_id,
      price_per_kg_rwf: price,
      source: 'farmer_report',
      source_count: 1,
      reported_at: new Date(),
    });
    return report.save();
  }
}
