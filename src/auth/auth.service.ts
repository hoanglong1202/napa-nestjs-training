import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';

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

  async register(data: CreateUserDto) {
    const { username, email, password } = data;

    const user = await this.userService.getUserByUsername(username);
    if (user) {
      throw new ForbiddenException('Dupplicated Username');
    }

    const userMail = await this.userService.getUserByMail(email);

    if (userMail) {
      throw new ForbiddenException('Dupplicated User Mail');
    }

    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUND),
    );

    await this.userService.register({ ...data, password: hashPassword });

    return {
      success: true,
      message: 'Create User successfullyy',
    };
  }

  async changePassword(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUND),
    );

    const result = await this.userService.changePassword(
      username,
      hashPassword,
    );

    return {
      success: true,
      message: 'Change password successfullyy',
      dataObj: result,
    };
  }
}
