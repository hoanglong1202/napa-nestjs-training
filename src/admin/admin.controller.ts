import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/auth/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import RoleGuard from 'src/auth/guards/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('user')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  async getAllUser() {
    return this.adminService.getAllUser();
  }

  @Put('user')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  async updateUser(@Request() req) {
    return this.adminService.updateUserInfor(req.body);
  }

  @Delete('user/:id')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  async deleteUser(@Param() params) {
    return this.adminService.deleteUser(params.id);
  }

  @Put('user/active/:id')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  async activeUser(@Param() params) {
    return this.adminService.activeUser(params.id);
  }

  @Put('user/inactive/:id')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  async inactiveUser(@Param() params) {
    return this.adminService.inactiveUser(params.id);
  }
}
