import { CheckIn, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { CheckInsRepository } from '../checkin-repository';
import dayjs from 'dayjs';

export class InMemoryCheckInRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async countByUserId(user_id: string): Promise<number> {
    return this.items.filter((item) => (item.user_id = user_id)).length;
  }

  async findManyByUserId(user_id: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.items
      .filter((item) => item.user_id === user_id)
      .slice((page - 1) * 20, page * 20);
    return checkIns;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };
    this.items.push(checkIn);
    return checkIn;
  }

  async findByUserIdOnDate(
    user_id: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkInOnSameDay = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === user_id && isOnSameDate;
    });
    if (!checkInOnSameDay) {
      return null;
    }
    return checkInOnSameDay;
  }
}
