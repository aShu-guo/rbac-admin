import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/modules/users/dtos/create.dto';
import * as bcrypt from 'bcrypt';
import { UsersEntity } from '@/modules/users/users.entity';
import { JwtTokensDto } from '@/modules/auth/dtos/jwt-tokens.dto';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from '@/modules/auth/dtos/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UsersEntity> {
    return this.userService.create(createUserDto);
  }

  async signIn(username: string, pass: string): Promise<JwtTokensDto> {
    const user = await this.userService.findOne({ name: username });

    if (user && (await bcrypt.compare(pass, await bcrypt.hash(user.password, user.salt)))) {
      // 用户存在 而且 密码匹配
      const payload: JwtPayloadDto = { sub: user.id, username: user.name };
      return new JwtTokensDto({
        access_token: this.jwtService.sign(payload),
        refresh_token: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        }),
      });
    }
    throw new UnauthorizedException();
  }

  async refresh(refreshToken: string): Promise<JwtTokensDto> {
    const { sub } = await this.jwtService.verifyAsync<JwtPayloadDto>(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
    if (sub) {
      const user = await this.userService.findOne({ id: sub });

      const payload: JwtPayloadDto = { sub, username: user.name };
      // 需要记录旧refresh
      return new JwtTokensDto({
        access_token: this.jwtService.sign(payload),
        refresh_token: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        }),
      });
    }
    throw new UnauthorizedException();
  }
}
