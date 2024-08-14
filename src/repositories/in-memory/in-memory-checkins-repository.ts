import { CheckIn, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { CheckInsRepository } from '../checkin-repository';
import dayjs from 'dayjs';

export class InMemoryCheckInRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findManyByUserId(user_id: string): Promise<CheckIn[]> {
    const checkIns = this.items.filter((item) => item.user_id === user_id);
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
