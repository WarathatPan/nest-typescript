import { Types } from 'mongoose';
import { RolesEnum } from 'src/common/decorators/roles.decorator';

export interface UserInterface {
  readonly _id: Types.ObjectId;
  readonly email: string;
  readonly password?: string;
  readonly role: RolesEnum;
}
