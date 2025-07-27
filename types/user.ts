export interface UserQuery {
  getMe: UserModel;
}

export interface UserModel {
  id: number;
  email: string;
  name: string;
  role: string;
}
