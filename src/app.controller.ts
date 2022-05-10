import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/register')
  async register(@Request() req) {
    return this.authService.register(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/change-password')
  async changePassword(@Request() req) {
    return this.authService.changePassword(
      req.body.username,
      req.body.password,
    );
  }

  @Get('auth/reset-password/:id')
  async sendResetPaswordToken(@Param() params) {
    return this.authService.sendResetPaswordToken(params.id);
  }

  @Post('auth/reset-password')
  async resetPassword(@Request() req) {
    return this.authService.resetPasword(req.body);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {}

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Request() req) {}

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect(@Request() req) {
    return this.authService.githubLogin(req);
  }
}
