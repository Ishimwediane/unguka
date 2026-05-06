import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { v7 as uuidv7 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { SignupDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const { phone_e164, password, role, full_name, language, district, sector, gps_lat, gps_lng } = dto;

    const existingUser = await this.userModel.findOne({ phone_e164 });
    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      id: uuidv7(),
      phone_e164,
      password: hashedPassword,
      full_name,
      language: language || 'rw',
      district,
      sector,
      gps_lat,
      gps_lng,
      role,
    });

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

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ phone_e164: dto.phone_e164 });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

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
