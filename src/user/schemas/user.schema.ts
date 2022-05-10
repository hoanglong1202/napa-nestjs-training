import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/enum/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ require: true, trim: true, unique: true })
  username: string;

  @Prop({ trim: true })
  email: string;

  @Prop({ require: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: [Role.User] })
  roles: Role[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  googleId: string;

  @Prop()
  githubId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
