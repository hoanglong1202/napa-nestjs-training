import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(private userService: UserService) {}

  async getAllUser(): Promise<any> {
    const result = await this.userService.getAllUser();

    return {
      success: true,
      message: 'Fetching data successfullyy',
      dataObj: result,
    };
  }

  async updateUserInfor(data: UpdateUserDto): Promise<any> {
    const { username } = data;
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      throw new ForbiddenException('User is not exist');
    }

    const result = await this.userService.updateUser(user._id, data);

    return {
      success: true,
      message: 'Update user successfullyy',
      dataObj: result,
    };
  }

  async deleteUser(id: string): Promise<any> {
    const user = await this.userService.getUserById(id);

    if (!id || !user) {
      throw new ForbiddenException('Request is not valid');
    }

    const result = await this.userService.deleteUser(id);

    return {
      success: true,
      message: 'Delete user successfullyy',
      dataObj: result,
    };
  }

  async activeUser(id: string): Promise<any> {
    const user = await this.userService.getUserById(id);

    if (!id || !user) {
      throw new ForbiddenException('Request is not valid');
    }

    const result = await this.userService.activeUser(id);

    return {
      success: true,
      message: 'Active user successfullyy',
      dataObj: result,
    };
  }

  async inactiveUser(id: string): Promise<any> {
    const user = await this.userService.getUserById(id);

    if (!id || !user) {
      throw new ForbiddenException('Request is not valid');
    }

    const result = await this.userService.inactiveUser(id);

    return {
      success: true,
      message: 'Inactive user successfullyy',
      dataObj: result,
    };
  }
}
