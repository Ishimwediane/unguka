import { connect, connection } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { UserSchema } from '../../schemas/user.schema';
import { CropSchema } from '../../schemas/crop.schema';
import { MarketSchema } from '../../schemas/market.schema';
import { MarketPriceSchema } from '../../schemas/market-price.schema';
import { SaleSchema } from '../../schemas/sale.schema';
import { FarmSchema } from '../../schemas/farm.schema';
import { FarmCropSchema } from '../../schemas/farm-crop.schema';

dotenv.config();

function parseCsv(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== '');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const obj: any = {};
    headers.forEach((header, i) => {
      let val: any = values[i]?.trim();
      if (val === '' || val === undefined) val = null;
      else if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (!isNaN(Number(val)) && val !== '' && !val.startsWith('+') && !val.startsWith('0')) val = Number(val);
      obj[header] = val;
    });
    return obj;
  });
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }

  await connect(uri);
  console.log('Connected to MongoDB');

  const User = connection.model('User', UserSchema);
  const Crop = connection.model('Crop', CropSchema);
  const Market = connection.model('Market', MarketSchema);
  const MarketPrice = connection.model('MarketPrice', MarketPriceSchema);
  const Sale = connection.model('Sale', SaleSchema);
  const Farm = connection.model('Farm', FarmSchema);
  const FarmCrop = connection.model('FarmCrop', FarmCropSchema);

  const seedDir = path.join(__dirname, '../../../../data/seed');

  console.log('Seeding Crops...');
  const crops = parseCsv(path.join(seedDir, 'crops.csv'));
  await Crop.deleteMany({});
  await Crop.insertMany(crops);

  console.log('Seeding Markets...');
  const markets = parseCsv(path.join(seedDir, 'markets.csv'));
  await Market.deleteMany({});
  await Market.insertMany(markets);

  console.log('Seeding Market Prices...');
  const prices = parseCsv(path.join(seedDir, 'market_prices.csv'));
  await MarketPrice.deleteMany({});
  await MarketPrice.insertMany(prices);

  console.log('Seeding Farmers & Creating Farms...');
  const farmers = parseCsv(path.join(seedDir, 'farmers.csv'));
  console.log(`Parsed ${farmers.length} farmers`);
  await User.deleteMany({ role: 'farmer' });
  await Farm.deleteMany({});
  await FarmCrop.deleteMany({});
  
  const hashedPassword = await bcrypt.hash('password123', 10);

  let createdCount = 0;
  for (const f of farmers) {
    await User.create({ ...f, password: hashedPassword });
    createdCount++;
    // Create one farm per farmer
    const farmId = uuidv7();
    await Farm.create({
      id: farmId,
      user_id: f.id,
      name: `${f.full_name}'s Farm`,
      district: f.district,
      sector: f.sector,
      size_ha: 2.5,
    });

    // Create 2 active crops per farmer
    for (let i = 0; i < 2; i++) {
      const crop = crops[Math.floor(Math.random() * crops.length)];
      const status = i === 0 ? 'near_harvest' : 'growing';
      const expectedHarvest = new Date();
      expectedHarvest.setDate(expectedHarvest.getDate() + (i === 0 ? 5 : 45));

      await FarmCrop.create({
        id: uuidv7(),
        farm_id: farmId,
        crop_id: crop.id,
        season_label: '2026A',
        planted_at: '2026-02-01',
        expected_harvest_at: expectedHarvest.toISOString().split('T')[0],
        expected_qty_kg: 1200,
        status,
      });
    }
  }
  console.log(`Successfully created ${createdCount} farmers and farms`);

  console.log('Seeding Sales...');
  const sales = parseCsv(path.join(seedDir, 'sales.csv'));
  await Sale.deleteMany({});
  // Note: These sales might refer to farm_crop_ids that don't exist in our newly generated farm_crops.
  // For v1 demo purposes, we'll just insert them as is, but in a real QA we'd link them.
  await Sale.insertMany(sales);

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
