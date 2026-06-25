import 'dotenv/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadType } from '../type/auth.type';
import { UserService } from '../../user/user.service';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env['SECRET_AUTH_KEY']!,
    });
  }

  async validate(req: PayloadType) {
    const user = await this.userService.getUser(req.sub);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
