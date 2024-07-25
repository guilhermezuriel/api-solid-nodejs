import { prisma } from '@/lib/prisma';
import { Prisma, Gym } from '@prisma/client';

export class PrismaGymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });
    return gym;
  }
}
