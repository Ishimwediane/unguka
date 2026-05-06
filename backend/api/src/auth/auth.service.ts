import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async requestOtp(phone_e164: string) {
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    let user = await this.userModel.findOne({ phone_e164 });

    if (!user) {
      user = new this.userModel({
        id: uuidv7(),
        phone_e164,
        language: 'rw',
        role: 'farmer',
        otp_code,
        otp_expires_at,
      });
    } else {
      user.otp_code = otp_code;
      user.otp_expires_at = otp_expires_at;
    }

    await user.save();

    // TODO: Send SMS via Twilio/Africa's Talking
    console.log(`[OTP] ${phone_e164} → ${otp_code}`);

    return { message: 'OTP sent' };
  }

  async verifyOtp(phone_e164: string, otp_code: string) {
    const user = await this.userModel.findOne({ phone_e164 });

    if (!user || !user.otp_code || !user.otp_expires_at) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (user.otp_code !== otp_code) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (new Date() > user.otp_expires_at) {
      throw new UnauthorizedException('OTP expired');
    }

    user.otp_code = undefined;
    user.otp_expires_at = undefined;
    await user.save();

    const token = this.jwtService.sign({ sub: user.id, role: user.role });

    return {
      access_token: token,
      user: {
        id: user.id,
        phone_e164: user.phone_e164,
        full_name: user.full_name,
        language: user.language,
        role: user.role,
      },
    };
  }
}
