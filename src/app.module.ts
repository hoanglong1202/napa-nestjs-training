import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { GithubStrategy } from './auth/strategies/github.strategy';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost/napa-express'),
    AuthModule,
    UserModule,
    TokenModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, GithubStrategy],
})
export class AppModule {}
