import { connect, connection } from 'mongoose';
import { UserSchema } from './src/schemas/user.schema';
import * as dotenv from 'dotenv';

dotenv.config();

async function check() {
  await connect(process.env.MONGODB_URI!);
  const User = connection.model('User', UserSchema);
  const users = await User.find({}).limit(5).lean();
  console.log('Total users:', await User.countDocuments());
  users.forEach(u => console.log(`- ${u.phone_e164} (${u.role})`));
  process.exit(0);
}

check();
