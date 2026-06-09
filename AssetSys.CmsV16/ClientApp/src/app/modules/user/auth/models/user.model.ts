import { AuthModel } from './auth.model';

export class UserModel extends AuthModel {
  id: number;
  username: string;
  password: string;
  fullname: string;
  email: string;
  pic: string;
  phone: string;
  firstname: string;
  lastname: string;
  language: string;
  timeZone: string;
  communication: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };

  setUser(_user: unknown) {
    const user = _user as UserModel;
    this.id = user.id;
    this.username = user.username || '';
    this.password = user.password || '';
    this.fullname = user.fullname || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/avatars/blank.png';
    this.phone = user.phone || '';
  }
}
