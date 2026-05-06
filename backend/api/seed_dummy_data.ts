import { connect, connection } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';
import * as dotenv from 'dotenv';
import { UserSchema } from './src/schemas/user.schema';
import { FarmSchema } from './src/schemas/farm.schema';
import { OrganizationSchema } from './src/schemas/organization.schema';

dotenv.config();

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await connect(uri);
  console.log('Connected!');

  const User = connection.model('User', UserSchema);
  const Farm = connection.model('Farm', FarmSchema);
  const Organization = connection.model('Organization', OrganizationSchema);

  // Clear existing dummy data (optional, but good for idempotency)
  // await User.deleteMany({});
  // await Farm.deleteMany({});
  // await Organization.deleteMany({});

  console.log('Creating Admin...');
  const adminId = uuidv7();
  await User.findOneAndUpdate(
    { phone_e164: '+250780000000' },
    {
      id: adminId,
      phone_e164: '+250780000000',
      full_name: 'System Admin',
      language: 'rw',
      role: 'admin',
    },
    { upsert: true, new: true }
  );

  console.log('Creating Farmers...');
  const farmer1Id = uuidv7();
  const farmer2Id = uuidv7();
  
  await User.findOneAndUpdate(
    { phone_e164: '+250781111111' },
    {
      id: farmer1Id,
      phone_e164: '+250781111111',
      full_name: 'Jean Claude (Farmer)',
      language: 'rw',
      district: 'Gasabo',
      sector: 'Bumbogo',
      role: 'farmer',
    },
    { upsert: true, new: true }
  );

  await User.findOneAndUpdate(
    { phone_e164: '+250782222222' },
    {
      id: farmer2Id,
      phone_e164: '+250782222222',
      full_name: 'Marie Claire (Farmer)',
      language: 'en',
      district: 'Nyagatare',
      sector: 'Matimba',
      role: 'farmer',
    },
    { upsert: true, new: true }
  );

  console.log('Creating Farms...');
  // Check if farm exists to avoid duplicates if run multiple times
  const existingFarms = await Farm.countDocuments();
  if (existingFarms === 0) {
    await Farm.create([
      {
        id: uuidv7(),
        user_id: farmer1Id,
        name: 'Bumbogo Plot A',
        size_ha: 1.5,
        district: 'Gasabo',
        sector: 'Bumbogo',
      },
      {
        id: uuidv7(),
        user_id: farmer1Id,
        name: 'Bumbogo Plot B (Valley)',
        size_ha: 0.8,
        district: 'Gasabo',
        sector: 'Bumbogo',
      },
      {
        id: uuidv7(),
        user_id: farmer2Id,
        name: 'Matimba Maize Farm',
        size_ha: 5.0,
        district: 'Nyagatare',
        sector: 'Matimba',
      }
    ]);
  }

  console.log('Creating Organizations...');
  const existingOrgs = await Organization.countDocuments();
  if (existingOrgs === 0) {
    await Organization.create([
      {
        id: uuidv7(),
        type: 'cooperative',
        name: 'Kigali Agri-Producers Cooperative',
        region: 'Kigali',
        contact_phone: '+250783333333',
      },
      {
        id: uuidv7(),
        type: 'ngo',
        name: 'Rwanda Farming Support NGO',
        region: 'National',
        contact_phone: '+250784444444',
      }
    ]);
  }

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
