export interface User {
  id: number;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}

export interface UserResponse extends User {}

export interface UserFromDB extends User {
  password: string;
  isDeleted: boolean;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  password?: string;
}
