import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import RolesGuard from 'src/auth/guards/roles.guard';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [UserModule],
  providers: [AdminService, JwtStrategy],
  controllers: [AdminController],
})
export class AdminModule {}
