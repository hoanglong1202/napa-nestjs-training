import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUser(): Promise<any | undefined> {
    const result = await this.userModel.find({}).select('-password -isDeleted');
    return result;
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<any> {
    const result = await this.userModel.findOneAndUpdate(
      { _id: id },
      updateData,
      {
        new: true,
      },
    );

    return result;
  }

  async deleteUser(id: string): Promise<any> {
    const result = await this.userModel
      .findOneAndUpdate(
        { _id: id },
        { isDeleted: true },
        {
          new: true,
        },
      )
      .select('-password');

    return result;
  }

  async activeUser(id: string): Promise<any> {
    const result = await this.userModel
      .findOneAndUpdate(
        { _id: id },
        { isActive: true },
        {
          new: true,
        },
      )
      .select('-password');

    return result;
  }

  async inactiveUser(id: string): Promise<any> {
    const result = await this.userModel
      .findOneAndUpdate(
        { _id: id },
        { isActive: false },
        {
          new: true,
        },
      )
      .select('-password');

    return result;
  }

  async register(data: RegisterUserDto) {
    const { username, email, password } = data;

    const newUser = new this.userModel({ username, email, password });
    await newUser.save();
  }

  async getUserByUsername(username: string): Promise<any> {
    const result = await this.userModel.findOne({ username });

    return result;
  }

  async getUserByMail(email: string): Promise<any> {
    const result = await this.userModel.findOne({ email });

    return result;
  }

  async getUserById(id: string): Promise<any> {
    const result = await this.userModel.findOne({ _id: id });

    return result;
  }

  async changePassword(username: string, newPassword: string): Promise<any> {
    let result = await this.userModel.findOneAndUpdate(
      { username },
      { password: newPassword },
      {
        new: true,
      },
    );

    return result;
  }
}
