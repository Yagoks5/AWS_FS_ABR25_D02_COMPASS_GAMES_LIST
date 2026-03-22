import prisma from '../lib/prisma';
import { NotFoundError } from '../utils/appError';

export class UserService {
  private prisma = prisma;

  async getCurrentUser(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}
