import { prisma } from '@/lib/prisma';
import { Prisma, Gym } from '@prisma/client';
import { GymsRepository } from '../gyms-repository';

export class PrismaGymsRepository implements GymsRepository {
  findById(id: string): Promise<Gym | null> {
    throw new Error('Method not implemented.');
  }
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });
    return gym;
  }
}
