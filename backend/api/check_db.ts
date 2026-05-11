import { connect, connection } from 'mongoose';
import { UserSchema } from './src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function check() {
  await connect(process.env.MONGODB_URI!);
  const User = connection.model('User', UserSchema);
  const user = await User.findOne({ phone_e164: '+250783283577' });
  if (!user) {
    console.log('User not found');
  } else {
    console.log('User found:', user.id, user.phone_e164, user.role);
    console.log('Has password:', !!user.password);
    const ok = await bcrypt.compare('password123', user.password!);
    console.log('Password valid:', ok);
  }
  process.exit(0);
}

check();
