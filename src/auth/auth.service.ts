import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { resetPasswordMail } from 'src/helpers/mailTemplate';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
// import { mailer } from 'src/helpers/mailer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailer: MailerService,
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

  async register(data: CreateUserDto): Promise<any> {
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

  async changePassword(username: string, password: string): Promise<any> {
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

  async sendResetPaswordToken(id: string): Promise<any> {
    const user = await this.userService.getUserById(id);

    if (!user || !user.email) {
      throw new UnauthorizedException();
    }

    const token = await this.userService.addResetToken(user._id);
    const template = resetPasswordMail(token, user._id);

    let info = await this.mailer.sendMail({
      from: `NAPA GLOBAL <${process.env.TRANSPORTER_MAIL}>`, // sender address
      to: user.email || `vdhlong1202@gmail.com`, // list of receivers
      subject: template.subject, // Subject line
      html: template.template, // html body
    });

    console.log('Message sent: ', info.messageId);
    console.log('Message token: ', token);

    return {
      success: true,
      message: 'Reset password send successfullyy',
    };
  }

  async resetPasword(data: ResetPasswordDto): Promise<any> {
    const { userId, newPassword, token } = data;
    console.log("userid: ", data)
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    let passwordResetToken = await this.userService.findTokenByUserId(userId);
    if (!passwordResetToken) {
      throw new ForbiddenException('Invalid or expired password reset token');
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new ForbiddenException('Invalid or expired password reset token');
    }

    const hashPassword = await bcrypt.hash(
      newPassword,
      Number(process.env.SALT_ROUND),
    );
    const result = await this.userService.changePassword(
      user.username,
      hashPassword,
    );

    return {
      success: true,
      message: 'Reset password successfullyy',
      dataObj: result,
    };
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
    }
  }

  githubLogin(req) {
    if (!req.user) {
      return 'No user from Github'
    }

    return {
      message: 'User information from Github',
      user: req.user
    }
  }
}
