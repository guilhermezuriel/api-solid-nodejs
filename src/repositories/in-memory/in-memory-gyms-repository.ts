import { Gym, Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';
import { randomUUID } from 'node:crypto';
import { GymsRepository } from '../gyms-repository';

export class InMemoryGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    const gymId = this.items.find((item) => item.id === id);
    if (!gymId) {
      return null;
    }
    return gymId;
  }
  public items: Gym[] = [];
}
