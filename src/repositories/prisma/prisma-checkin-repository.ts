import { prisma } from '@/lib/prisma';
import { Prisma, CheckIn } from '@prisma/client';
import { CheckInsRepository } from '../checkin-repository';
import { aW, C } from 'vitest/dist/reporters-BECoY4-b';

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findByUserIdOnDate(
    user_id: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findFirst({
      where: { user_id, created_at: date },
    });
    if (!checkIn) {
      return null;
    }
    return checkIn;
  }
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({ data });
    return checkIn;
  }
  async findManyByUserId(user_id: string): Promise<CheckIn[]> {
    throw new Error('Method not implemented.');
  }
}
