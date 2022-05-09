import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);
    const rightPassword = await bcrypt.compare(password, user.password);
    if (user && rightPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const { username, isActive, roles } = user;
    const access_token = this.jwtService.sign({
      username,
      isActive,
      roles,
    });

    return {
      access_token,
    };
  }
}
